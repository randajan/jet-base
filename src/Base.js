
import jet from "@randajan/jet-core";

import { BaseErr, filterChanges, untieArgs } from "./Helpers";

import Serf from "./Serf";
import Store from "./Store";

let BID = 0;

const PRIVATE = {};
const priv = base=>PRIVATE[base.name];

const forFlat = (flat, path, callback)=>{
    for (const i in flat) {
        if (i.startsWith(path)) { callback(flat[i], i, flat, path); }
    }
}

class Base {

    static dutyTypes = {
        fit:"fce",
        eye:"fce",
        spy:"fce"
    }

    static fit(duty, data, path, to) {
        const from = {};
        jet.match(data, to, (data, to, p)=>{ //heart of base DO not touch :)
            const isin = p === path || p.startsWith(path+".");
            const ison = path.startsWith(p+".");
            const pool = duty.fit[p];
            if (data != null && !jet.isMapable(data)) { jet.put(from, p, data, false); } //create copy
            if (!isin && !ison) { return data; } // skipping validation if it's out of scope
            if (ison || jet.isMapable(to)) { to = data; } //replace mapable and above
            return pool ? pool.fit(to, jet.dig(from, p)) : to;
        });

        if (duty.fit[""]) { duty.fit[""].fit(data, from); }
        return from;
    }

    static async run(duty, data, changes) {
        const { eye, spy } = duty;
        changes = Array.from(new Set(changes));
        changes.map(path=>{
            if (!eye[path] && !spy[path]) { return; }
            const to = jet.dig(data, path);
            if (eye[path]) { eye[path].run(to); }
            if (spy[path]) { spy[path].run(to, filterChanges(path, changes)); }
        });
        if (eye[""]) { eye[""].run(data); }
        if (spy[""]) { spy[""].run(data, changes); }
        return changes;
    }

    constructor(name, version, debug) {

        const enumerable = true;
        Object.defineProperties(this, {
            name:{enumerable, value:String.jet.to(name)},
            version:{enumerable, value:String.jet.to(version)},
            debug:{enumerable, value:Boolean.jet.to(debug)},
            serfs:{enumerable, value:{}}
        });

        jet.prop.add(this, {
            _id:BID++,
            _data:{},
            _duty:jet.prop.add({}, {
                fit:{},
                eye:{},
                spy:{},
                pipe:{},
                store:{},
            })
        });

        if (!this.name) { this.throw("constructor", "first argument 'name' missing"); }
        if (priv(this)) { this.throw("constructor", "name must be unique"); }

        PRIVATE[name] = {
            body:{},
            flat:{},
            fit:{},
            eye:{},
            store:{}
        }
    }

    throw(method, msg, path) {
        throw `jet-base${this.name ? ` '${this.name}'` : ""}${method ? ` ${method}(...)` : ""}${path ? ` path '${path}'` : ""} ${msg}`;
    }

    tag(path) { return this._id+"_"+String.jet.to(path, "."); }

    mount(path, Prototype, ...args) {
        path = String.jet.to(path, ".");
        if (Prototype.$$symbol !== Serf.$$symbol) { this.throw("mount", "invalid second argument (prototype). Must be Serf or extend Serf", path); }
        return this.serf[path] = this.serf[path] || new Prototype(this, path, ...args);
    }

    open(path, ...args) { return jet.isFull(path) ? this.mount(path, Serf, ...args) : this; }

    is(path, value) { return this.get(path) === value; }
    isType(path, type, soft) { return jet.is(type, this.get(path), soft); }
    isFull(path) { return jet.isFull(this.get(path)); }

    get(path, def) { return jet.dig(this._data, path, def); }
    getType(path, all) { return jet(this.get(path), all); }
    getDuty(type, path) {
        const duty = this._duty[type];
        if (!duty) { throw new BaseErr("There is no duty like '"+type+"'"); }
        path = jet.Str.to(path, ".");
        return jet.Map.of(duty, (v,k)=>{
            if (k.startsWith(path) && jet.type.is.full(v)) { return v; }
        });
    }

    getStore(path) { return this._duty.store[jet.Str.to(path, ".")]; }
    saveStore(path, ...a) { const store = this.getStore(path); return store ? store.save(...a) : false; }
    pullStore(path, ...a) { const store = this.getStore(path); return store ? store.pull(...a) : false; }
    fillStore(path, ...a) { const store = this.getStore(path); return store ? store.fill(...a) : false; }

    set(path, value) {
        const ms = new Date();
        const sp = String.jet.to(path, ".");
        const ap = sp.split(".");
        if (!sp) { this.throw("set", "first argument 'path' missing"); }
        const _p = priv(this), { body, flat, fit, eye } = _p;

        const audit = new Set();
        _p.flat = jet.forEach(flat, (v, p)=>{
            audit.add(p); if (!p.startsWith(sp)) { return v; }
        }); // clone flatmap without actual path prefix
        
        const set = (v, p)=>{
            audit.add(p);
            console.log(v, p, flat[p]); //fit every value
            return _p.flat[p] = v;
        }
        const deep = (v, vk)=>set(jet.map(v, set, deep, vk), vk);
        const dummy = jet.map({[sp]:value}, set, deep)[sp];
        console.log("pipe!");
        _p.body = jet.digIn(body, ap, dummy, true, (next, parent, path, dir)=>set(next(parent), dir)); //fit path

        let changes = "";
        audit.forEach((v, vk)=>(!jet.isMapable(v) && v !== flat[vk]) ? changes+=" ^"+vk : undefined);

        setTimeout(_=>{
            jet.forEach(eye, (v, vk)=>changes.includes(" ^"+vk) ? v() : undefined);
        });

        //console.log(flat, _p.flat);
 
        return changes;

        // const pipe = path.split(".")[0];
        // const data = {[pipe]:this._data[pipe]};

        // const oldval = this.get(path);
        // if (oldval && !force) { return []; }
        // const to = jet.put({}, path, value, true);
        // const from = Base.fit(this._duty, data, path, to);
        // this._data[pipe] = data[pipe];

        // const changes = jet.Map.compare(data, from);

        // if (jet.type.is.full(changes)) { Base.run(this._duty, data, changes); }

        // this.debugLog("changes", new Date()-ms, changes);
        // return changes;
    }

    push(path, value, force) {
        path = jet.Str.to(path, ".");
        return this.set(path, jet.Map.merge(force?null:value, this.get(path), force?value:null), true);
    }

    rem(path) { return this.set(path); }
    pull(path) { const value = this.get(path); this.rem(path); return value; }

    addDuty(type, path, add, after) {
        const duty = this._duty[type];
        const dutype = Base.dutyTypes[type];
        if (!duty || !dutype) { throw new BaseErr("There is no duty like '"+type+"'"); }
        [ path, add ] = untieArgs(path, add, after, dutype, "fce");
        let pool = duty[path];
        if (!pool) {
            pool = duty[path] = dutype === "fce" ? jet.rupl() : jet.pool(dutype, true);
        }
        pool.add(add);
        return  _=>pool.rem(add);
    }
    
    eye(path, exe) { return this.addDuty("eye", path, exe); }
    pip(path, exe) { const rem = this.eye(path, exe), pip = this.eye(path, rem); return _=>jet.Fce.run([rem, pip]); }
    fit(path, exe) { return this.addDuty("fit", path, exe); }

    lock(path, val) { return this.fit(path, (v,f)=>val !== undefined ? val : f); }
    fitTo(path, type, ...args) { return this.fit(path, next=>jet.type.to(type, next(), ...args)); }
    fitType(path, type, ...args) { return this.fit(path, next=>jet.type.tap(type, next(), ...args)); }
    fitDefault(path, def) { return this.fit(path, next=>{const v = next(); return jet.type.is.full(v) ? v : def}); }

    store(path, load, save) {
        path = jet.Str.to(path, ".");
        const pool = this._duty.store;
        if (pool[path]) { jet.fce.run(pool[path].cleanUp); }

        const store = pool[path] = new Store();
        store.path = path;

        store.setLoad(load, (s, data)=>this.set(path, data));
        store.setSave(save, s=>this.get(path));

        store.cleanUp = this.eye(path, _=>store.save());
        return store;
    }

    debugLog(...msg) { if (this.debug) { console.log("BASE-DEBUG", ...msg); } }

    spaceCount(path, limit) {
        return jet.Obj.measure(this.get(path), limit);
    }

}


export default Base;

export {
    BaseErr
}