import jet from "@randajan/jet-core";
import Base from "./Base.js";
import { autoInit } from "../private";

class BaseAsync extends Base {

    constructor(onInit) {
        super(async (image, options, closure)=>{
            if (!jet.isRunnable(onInit)) { return closure(true); }
            try { await onInit(image, options); } catch (e) { return closure(false, e); }
            return closure(true);
        });
    }

    async is(path, value) {
        await autoInit(this);
        return super.is(path, value);
    }
    async isType(path, type, strict=true) {
        await autoInit(this);
        return super.isType(path, type, strict);
    }
    async isFull(path) {
        await autoInit(this);
        return super.isFull(path);
    }
    async get(path, def) {
        await autoInit(this);
        return super.get(path, def);
    }
    async getType(path, strict=true) {
        await autoInit(this);
        return super.getType(path, strict);
    }
    async set(path, value) {
        await autoInit(this);
        return super.set(path, value);
    }
    async remove(path) {
        await autoInit(this);
        return super.remove(path);
    }
    async pull(path, def) {
        await autoInit(this);
        return super.pull(path, def);
    }
    async watch(path, fce, initRun=false) {
        await autoInit(this);
        return super.watch(path, fce, initRun);
    }
    async fit(path, fce) {
        await autoInit(this);
        return super.fit(path, fce);
    }
    async fitTo(path, type, ...args) {
        await autoInit(this);
        return super.fitTo(path, type, ...args);
    }
    async fitType(path, type, strict=true) {
        await autoInit(this);
        return super.fitType(path, type, strict);
    }
    async setDefault(path, value, fullDetect=true) {
        await autoInit(this);
        return super.setDefault(path, value, fullDetect);
    }
    async setLock(path, value) {
        await autoInit(this);
        return super.setLock(path, value);
    }
}


export default BaseAsync;