import jet from "@randajan/jet-core";
import { Sugar } from "../class/Sugar";

const LIST = new Map();
export const statuses = ["pending", "loading", "saving", "ready", "error"];

export const use = base=>LIST.get(base);

export const register = (base)=>{

    const priv = {
        paths:new Set(),
        flat:{},
        seeds:{},
        states:{},
        fits:{},
        watches:{},
        statusCode:0, 
        debug:false,
        sugars:{}
    };

    Object.defineProperty(priv, "status", {get:_=>statuses[priv.statusCode]});

    LIST.set(base, priv);
    return priv;
}

export const config = (base, options)=>{
    const _p = use(base);

    if (_p.statusCode !== 0) { base.throw("config", `status must be '${statuses[0]}' insted of ${_p.status}`) }
    if (_p.optionsSet) { base.throw("config", "can be called just once"); }

    _p.optionsSet = true;
    _p.options = options;

    return base;
}

export const init = (base, options)=>{
    const _p = use(base);

    if (_p.statusCode !== 0) { base.throw("init", `status must be '${statuses[0]}' insted of '${_p.status}'`); }
    if (_p.optionsSet && options) { base.throw("init", "options was predefined with config()"); }

    _p.statusCode = 1;

    const closure = (isReady, error)=>{
        if (isReady) { _p.statusCode = 3 } else {
            _p.statusCode = 4;
            _p.error = error || new Error("Unknown error");
            base.throw("init", _p.error);
        }
        return base;
    };

    return _p.initialization = _p.onInit(_p.options = Object.jet.to(options || _p.options), closure);
}

export const autoInit = (base)=>{
    if (base.statusCode === 3) { return; }
    if (base.statusCode === 4) { base.throw("", use(base).error); }
    if (base.statusCode === 1) { return use(base).initialization; }
    if (base.statusCode === 0) { return init(base); }
}

export const addSugar = (base, path)=>{
    const _p = use(base);
    path = jet.dot.toString(path);
    return _p.sugars[path] || (_p.sugars[path] = new Sugar(base, path));
}