import jet from "@randajan/jet-core";

const LIST = new Map();

export const use = base=>LIST.get(base);

export const register = base=>{
    LIST.set(base, {
        flat:{},
        fit:{},
        watch:{},
        store:{}
    })
}

export const get = (base, path)=>{
    path = String.jet.to(path, ".");
    return path ? use(base).flat[path] : use(base).output;
};

const formatDutyArgs = (path, fce)=>{
    if (fce === undefined && jet.isRunnable(path)) { fce = path; path = ""; }
    else { path = String.jet.to(path, "."); }

    return [path, fce]
}

const addDuty = (priv, kind, path, fce)=>(priv[kind][path] = (priv[kind][path] || jet.create.RunPool())).add(fce);

const filterChanges = (path, changes)=>{
    if (!path) { return [...changes]; }
    const result = [];
    for (const c of changes) {
        if (c.startsWith(path)) { result.push(c.slice(path.length+1));}
    }
    return result;
}

export const watch = (base, path, fce)=>{
    [path, fce] = formatDutyArgs(path, fce);
    return addDuty(use(base), "watch", path, cngs=>{ fce(p=>base.get([path, p]), _=>filterChanges(path, cngs)); });
}

export const fit = (base, path, fce)=>{
    [path, fce] = formatDutyArgs(path, fce);

    const _p = use(base);
    const rem = addDuty(_p, "fit", path, fce);
    
    const refit = path ? _=>set(base, path, jet.digOut(_p.input, path)) : _=>set(base, path, _p.input);
    refit();
    return _=>{ rem(); refit(); }
}

export const set = (base, path, value)=>{
    const _p = use(base), { input, output, flat, fit } = _p;

    path = String.jet.to(path, ".");

    const put = (v, p)=>(p && fit[p] && fit[p].fit) ? fit[p].fit(v, flat[p]) : v;
    const deep = (v, p)=>put(jet.map(v, put, deep, p), p);

    let dummy = jet.map(value, put, deep, path);

    if (!path) {
        _p.input = value;
        _p.output = dummy;
    } else {
        _p.input = jet.digIn(input, path, value, true);
        _p.output = jet.digIn(output, path, dummy, true, (next, parent, path, dir)=>put(next(parent ? jet.copy(parent) : parent), dir));
    }

    if (fit[""]) { _p.output = fit[""].fit(_p.output, output); } //global fit must be different

    return flatIt(base);
}

const flatIt = base=>{
    const _p = use(base), { output, flat, watch } = _p;

    const newFlat = _p.flat = {};
    const cngs = _p.changes = [];

    const put = (v, p)=>{
        if (v !== flat[p]) { cngs.push(p); }
        newFlat[p] = v;
        delete flat[p];
    };
    const deep = (v, p)=>{
        jet.forEach(v, put, deep, p);
        newFlat[p] = v;
        delete flat[p];
    };

    jet.forEach(output, put, deep);

    for (const p in flat) {
        if (!jet.isMapable(flat[p]) && newFlat[p] != flat[p]) { cngs.push(p); }
    }

    if (!cngs.length) { return cngs; }

    const c = " ^"+cngs.join(" ^");

    for (const p in watch) { if (c.includes(" ^"+p)) { watch[p].run(cngs); } }

    return cngs;
}

