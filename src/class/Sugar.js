import jet from "@randajan/jet-core";

const { solid } = jet.prop;


export class Sugar {
    constructor(base, path) {
        solid.all(this, { base, path });
    }
}

const _methods = ["is", "isType", "isFull", "get", "getType", "set", "remove", "pull", "watch", "fit", "fitTo", "fitType", "setDefault", "setLock"];

for (const m of _methods) {
    Sugar.prototype[m] = function (path, ...args) { return this.base[m](jet.dot.glue(this.path, jet.dot.toString(path)), ...args); }
}
