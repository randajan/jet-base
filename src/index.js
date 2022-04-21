
import jet from "@randajan/jet-core";
import * as _ from "./private.js";

class Base {

    constructor(debug=false) {

        Object.defineProperty(this,  "debug", {enumerable:true, value:Boolean.jet.to(debug)});
        _.register(this);

    }

    throw(method, msg, path) {
        throw `jet-base${method ? ` ${method}(...)` : ""}${path ? ` path '${path}'` : ""} ${msg}`;
    }

    is(path, value) { return _.get(this, path) === value; }
    isType(path, type, soft) { return jet.is(type, _.get(this, path), soft); }
    isFull(path) { return jet.isFull(_.get(this, path)); }

    get(path, def) { const v = _.get(this, path); return v != null ? jet.copy(v, true) : def; }
    getType(path, all=false) { return jet(_.get(this, path), all); }

    set(path, value) {
        if (value === undefined && typeof path === "object" && !Array.isArray(path)) { value = path; path = ""; }
        const ms = new Date();
        const changes = _.set(this, path, value);
        this.log("changes", (new Date()-ms)+"ms", changes);
        return changes;
    }

    remove(path) { return _.set(this, path); }
    pull(path) { const value = this.get(path); this.remove(path); return value; }
    
    watch(path, fce) { return _.watch(this, path, fce); }
    fit(path, fce) { return _.fit(this, path, fce); }

    fitTo(path, type, ...args) { return this.fit(path, (next, v, f)=>jet.to(type, next(v, f), ...args)); }
    fitType(path, type, ...args) { return this.fit(path, (next, v, f)=>jet.tap(type, next(v, f), ...args)); }

    default(path, value, force=false) {
        const isFull = force ? jet.isFull : v=>v!=null;
        return this.fit(path, (next, v, f)=>isFull(next(v, f)) ? v : value );
    }
    lock(path, value) {
        return this.fit(path, value === undefined ? (next,v,f)=>f : _=>value);
    }

    log(...msg) { if (this.debug) { console.log("jet-base log", ...msg); } }

}


export default Base;