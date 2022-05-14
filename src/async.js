import Base from "./base.js";

class BaseAsync extends Base {

    async is(path, value) {
        await this.autoInit();
        return super.is(path, value);
    }
    async isType(path, type, strict=true) {
        await this.autoInit();
        return super.isType(path, type, strict);
    }
    async isFull(path) {
        await this.autoInit();
        return super.isFull(path);
    }
    async get(path, def) {
        await this.autoInit();
        return super.get(path, def);
    }
    async getType(path, strict=true) {
        await this.autoInit();
        return super.getType(path, strict);
    }
    async set(path, value) {
        await this.autoInit();
        return super.set(path, value);
    }
    async remove(path) {
        await this.autoInit();
        return super.remove(path);
    }
    async pull(path) {
        await this.autoInit();
        return super.pull(path);
    }
    async watch(path, fce, initRun=false) {
        await this.autoInit();
        return super.watch(path, fce, initRun);
    }
    async fit(path, fce) {
        await this.autoInit();
        return super.fit(path, fce);
    }
    async fitTo(path, type, ...args) {
        await this.autoInit();
        return super.fitTo(path, type, ...args);
    }
    async fitType(path, type, strict=true) {
        await this.autoInit();
        return super.fitType(path, type, strict);
    }
    async setDefault(path, value, fullDetect=true) {
        await this.autoInit();
        return super.setDefault(path, value, fullDetect);
    }
    async setLock(path, value) {
        await this.autoInit();
        return super.setLock(path, value);
    }
}


export default BaseAsync;