import Base from "./base.js";

class BaseSync extends Base {

    is(path, value) {
        this.autoInit();
        return super.is(path, value);
    }
    isType(path, type, strict=true) {
        this.autoInit();
        return super.isType(path, type, strict);
    }
    isFull(path) {
        this.autoInit();
        return super.isFull(path);
    }
    get(path, def) {
        this.autoInit();
        return super.get(path, def);
    }
    getType(path, strict=true) {
        this.autoInit();
        return super.getType(path, strict);
    }
    set(path, value) {
        this.autoInit();
        return super.set(path, value);
    }
    remove(path) {
        this.autoInit();
        return super.remove(path);
    }
    pull(path) {
        this.autoInit();
        return super.pull(path);
    }
    watch(path, fce, initRun=false) {
        this.autoInit();
        return super.watch(path, fce, initRun);
    }
    fit(path, fce) {
        this.autoInit();
        return super.fit(path, fce);
    }
    fitTo(path, type, ...args) {
        this.autoInit();
        return super.fitTo(path, type, ...args);
    }
    fitType(path, type, strict=true) {
        this.autoInit();
        return super.fitType(path, type, strict);
    }
    setDefault(path, value, fullDetect=true) {
        this.autoInit();
        return super.setDefault(path, value, fullDetect);
    }
    setLock(path, value) {
        this.autoInit();
        return super.setLock(path, value);
    }
}


export default BaseSync;