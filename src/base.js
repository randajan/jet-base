
import jet from "@randajan/jet-core";
import { use, register, config } from "./defs.js";
import { addWatch, addFit } from "./duty.js";
import * as _ from "./vals.js";

class Base {

    constructor() {
        const priv = register(this);
        const init = this.init.bind(this);

        Object.defineProperties(this, {
            state:{enumerable:true, get:_=>priv.state},
            debug:{enumerable:true, get:_=>priv.debug},
            init:{value:(...args)=>{
                if (priv.state !== "pending") { this.throw("init", `state must be 'pending' insted is '${priv.state}'`); }
                priv.state = "initializing";
                if (!priv.config) { return init(...args); }
                if (args.length) { this.throw("init", "arguments was predefined with config()"); }
                return init(...priv.config);
            }}
        });
        
    }

    log(...msg) { if (this.debug) { console.log("jet-base log", ...msg); } }

    throw(method, msg, path) {
        throw `jet-base${method ? ` ${method}(...)` : ""}${path ? ` path '${path}'` : ""} ${msg}`;
    }

    config(...args) {
        config(this, ...args);
        return this;
    }

    init(debug=false) {
        const priv = use(this);
        priv.debug = Boolean.jet.to(debug);
        priv.state = "ready";
        return this;
    }

    autoInit() {
        if (this.state === "pending") { return this.init(); }
    }

    is(path, value) { return _.get(this, path) === value; }
    isType(path, type, strict=true) { return jet.is(type, _.get(this, path), strict); }
    isFull(path) { return jet.isFull(_.get(this, path)); }

    get(path, def) { const v = _.get(this, path); return v != null ? jet.copy(v, true) : def; }
    getType(path, strict=true) { return jet(_.get(this, path), strict); }

    set(path, value) {
        if (value === undefined && typeof path === "object" && !Array.isArray(path)) { value = path; path = ""; }
        const ms = new Date();
        const changes = _.set(this, path, value);
        this.log("changes", (new Date()-ms)+"ms", changes);
        return changes;
    }

    remove(path) { return _.set(this, path); }
    pull(path) { const value = this.get(path); this.remove(path); return value; }
    
    watch(path, fce, initRun=false) { return addWatch(this, path, fce, initRun); }
    fit(path, fce) { return addFit(this, path, fce); }

    fitTo(path, type, ...args) { return addFit(this, path, (next, v, f)=>jet.to(type, next(v, f), ...args)); }
    fitType(path, type, strict=true) { return addFit(this, path, (next, v, f)=>{
        v = next(v, f);
        return jet.is(type, v, strict) ? v : jet.create(type);
    }); }

    setDefault(path, value, fullDetect=true) {
        const isFull = fullDetect ? jet.isFull : v=>v!=null;
        return addFit(this, path, (next, v, f)=>isFull(next(v, f)) ? v : value );
    }
    setLock(path, value) {
        if (value === undefined) { value = _.get(this, path); }
        return addFit(this, path, _=>value);
    }
}


export default Base;