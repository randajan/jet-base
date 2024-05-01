import jet from "@randajan/jet-core";
import RunPool from "@randajan/jet-core/runpool";

import { use } from "./defs.js";
import { set } from "./vals.js";


const formatDutyArgs = (path, fce)=>{
    if (fce === undefined && jet.isRunnable(path)) { fce = path; path = ""; }
    else { path = jet.dot.toString(path); }

    return [path, fce]
}

const addDuty = (priv, kind, path, fce)=>(priv[kind][path] = (priv[kind][path] || new RunPool())).add(fce);

const filterChanges = (path, changes)=>{
    if (!path) { return [...changes]; }
    const result = [];
    for (const c of changes) {
        if (c.startsWith(path)) { result.push(c.slice(path.length+1));}
    }
    return result;
}

export const addWatch = (base, path, fce, initRun=false)=>{
    [path, fce] = formatDutyArgs(path, fce);
    const get = p=>base.get(jet.dot.glue(path, jet.dot.toString(p)));
    if (initRun) { setTimeout(_=>fce(get, _=>[])); }
    return addDuty(use(base), "watches", path, cngs=>{ fce(get, _=>filterChanges(path, cngs)); });
}

export const addFit = (base, path, fce)=>{
    [path, fce] = formatDutyArgs(path, fce);

    const _p = use(base);
    const rem = addDuty(_p, "fits", path, fce);
    
    const refit = path ? _=>set(base, path, jet.digOut(_p.input, path)) : _=>set(base, path, _p.input);
    refit();
    return _=>{ rem(); refit(); }
}