
import jet from "@randajan/jet-core";
import { use, register, config, init } from "./defs.js";
import { addWatch, addFit } from "./duty.js";
import * as _ from "./vals.js";

class Base {

    constructor(onInit) {
        const _p = register(this);

        const props = {
            error:{enumerable:true, get:_=>_p.error},
            state:{enumerable:true, get:_=>_p.state},
            stateCode:{enumerable:true, get:_=>_p.stateCode},
            debug:{enumerable:true, get:_=>_p.debug, set:v=>_p.debug = Boolean.jet.to(debug)},
        }

        Object.defineProperties(this, props);

        _p.onInit = (options, closure)=>{
            const image = Object.defineProperties({}, props);
            for (const i in Object.getOwnPropertyDescriptors(Base.prototype)) {
                if (i !== "constructor") { image[i] = Base.prototype[i].bind(this); }
            }

            return onInit(image, options, closure);
        }
        
    }

    log(...msg) { if (this.debug) { console.log("jet-base log", ...msg); } }

    throw(method, msg, path) {
        throw `jet-base${method ? ` ${method}(...)` : ""}${path ? ` path '${path}'` : ""} ${msg}`;
    }

    config(options) { return config(this, options); }
    init(options) { return init(this, options); }

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
    pull(path) {
        const v = _.get(this, path);
        _.set(this, path);
        return v != null ? jet.copy(v, true) : def;
    }
    
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