import jet from "@randajan/jet-core";
import { each } from "@randajan/jet-core/eachSync";

import { use } from "./defs.js";

const forEach = (value, callback, root)=>{
    const put = (v, ctx)=>callback(v, ctx.fullpath, false);

    each(value, put, {
        root,
        deep:(v, ctx, next)=>{ callback(v, ctx.fullpath, true); next(v); }
    });
}

const deflate = (paths, path, value)=>{
    const flat = {[path]:value};

    let k, p = path;
    do {
        if (paths.has(p)) { break; }
        paths.add(p);
        [k, p] = jet.dot.biteRight(p);
    } while (p != null);

    forEach(value, (v, p)=>{ paths.add(p); flat[p] = v; }, path); //create input flat and add paths

    return flat;
}

const prepareParent = (key, parent, img, copy=false, create=false)=>{
    if (parent) { return parent; }
    if (!img || !jet.isMapable(img)) { return !create ? undefined : String.jet.isNumeric(key) ? [] : {} }
    return copy ? jet.copy(img, true, false) : jet.create(jet(img, false));
}

const put = (path, value, parents, parentImgs, imgCopy=false)=>{
    let [k, d] = jet.dot.biteRight(path);
    const nudf = value !== undefined;
    parents[d] = prepareParent(k, parents[d], parentImgs[d], imgCopy, nudf);
    if (path && parents[d]) { jet.set(parents[d], k, value); }
    if (nudf) { parents[path] = value; } else { delete parents[path]; }
}

const fit = (fits, path, to, from)=>(fits[path] && fits[path].fit) ? fits[path].fit(to[path], from[path]) : to[path];

const pathStartsWith = (path, startsWith)=>{
    if (startsWith == null || startsWith === "") { return true; }
    if (!path.startsWith(startsWith)) { return false; }
    const endChr = path[startsWith.length];
    return endChr == null || endChr === ".";
}

export const set = (base, path, value)=>{
    const _p = use(base), { input, flat, fits, paths, watches } = _p;

    path = jet.dot.toString(path);

    const flatIn = deflate(paths, path, value); //deflate input value

    const rawPaths = [...paths].sort();

    for (let i=rawPaths.length-1; i>=0; i--) { //fit changes
        const p = rawPaths[i];
        if (path === p) {// SET
            //.log(p, "set");
            put(p, fit(fits, p, flatIn, flat), flatIn, flat, true);
        } 
        else if (pathStartsWith(path, p)) {// MERGE
            //console.log(p, "merge");
            put(p, fit(fits, p, flatIn, flat), flatIn, flat, true);
        } 
        else if (pathStartsWith(p, path)) {// OVERWRITE
            //console.log(p, "overwrite");
            put(p, fit(fits, p, flatIn, flat), flatIn, flatIn);
        }
    }

    _p.input = path ? jet.digIn(input, path, value, true) : value;
    const output = _p.output = flatIn[""];
    const pathsOut = _p.paths = new Set();
    const flatOut = _p.flat = {"":output};
    const cngs = _p.changes = [];

    pathsOut.add("");
    forEach(output, (v, p, isMapable)=>{ //detect updates
        if (!isMapable && v !== flat[p]) { cngs.push(p); }
        pathsOut.add(p);
        flatOut[p] = v;
        delete flat[p];
    });

    for (const p in flat) { //detect removes
        if (!jet.isMapable(flat[p]) && flatOut[p] != flat[p]) { cngs.push(p); }
    }

    if (cngs.length) { //run watches
        const c = " ^"+cngs.join(" ^");
        for (const p in watches) { if (c.includes(" ^"+p)) { watches[p].run(cngs); } }
    }

    return cngs;
}


export const get = (base, path)=>use(base).flat[jet.dot.toString(path)];