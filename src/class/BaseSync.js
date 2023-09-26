import jet from "@randajan/jet-core";
import Base from "./Base.js";
import { autoInit } from "../private";


class BaseSync extends Base {

    constructor(onInit) {
        super((base, options, closure)=>{
            if (!jet.isRunnable(onInit)) { return closure(true); }
            try { onInit(base, options); } catch (e) { return closure(false, e); }
            return closure(true);
        });
    }

    is(path, value) {
        autoInit(this);
        return super.is(path, value);
    }
    isType(path, type, strict=true) {
        autoInit(this);
        return super.isType(path, type, strict);
    }
    isFull(path) {
        autoInit(this);
        return super.isFull(path);
    }
    get(path, def) {
        autoInit(this);
        return super.get(path, def);
    }
    getType(path, strict=true) {
        autoInit(this);
        return super.getType(path, strict);
    }
    set(path, value) {
        autoInit(this);
        return super.set(path, value);
    }
    remove(path) {
        autoInit(this);
        return super.remove(path);
    }
    pull(path, def) {
        autoInit(this);
        return super.pull(path, def);
    }
    watch(path, fce, initRun=false) {
        autoInit(this);
        return super.watch(path, fce, initRun);
    }
    fit(path, fce) {
        autoInit(this);
        return super.fit(path, fce);
    }
    fitTo(path, type, ...args) {
        autoInit(this);
        return super.fitTo(path, type, ...args);
    }
    fitType(path, type, strict=true) {
        autoInit(this);
        return super.fitType(path, type, strict);
    }
    setDefault(path, value, fullDetect=true) {
        autoInit(this);
        return super.setDefault(path, value, fullDetect);
    }
    setLock(path, value) {
        autoInit(this);
        return super.setLock(path, value);
    }
}


export default BaseSync;