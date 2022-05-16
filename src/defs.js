
const LIST = new Map();
const states = ["error", "pending", "initializing", "ready"];

export const use = base=>LIST.get(base);

export const register = (base)=>{

    const priv = {
        paths:new Set(),
        flat:{},
        fits:{},
        watches:{},
        stateCode:1, 
        debug:false,
    };

    Object.defineProperty(priv, "state", {get:_=>states[priv.stateCode]});

    LIST.set(base, priv);

    return priv;
}

export const config = (base, options)=>{
    const _p = use(base);

    if (_p.stateCode !== 1) { base.throw("config", `state must be '${states[1]}' insted of ${_p.state}`) }
    if (_p.optionsSet) { base.throw("config", "can be called just once"); }

    _p.optionsSet = true;
    _p.options = options;

    return base;
}

export const init = (base, options)=>{
    const _p = use(base);

    if (_p.stateCode !== 1) { base.throw("init", `state must be '${states[1]}' insted of '${_p.state}'`); }
    if (_p.optionsSet && options) { base.throw("init", "options was predefined with config()"); }

    _p.stateCode = 2;

    const closure = (isReady, error)=>{
        if (isReady) { _p.stateCode = 3 } else {
            _p.stateCode = 0;
            _p.error = error || new Error("Unknown error");
            base.throw("init", _p.error);
        }
        return base;
    };

    return _p.initialization = _p.onInit(_p.options = (options || _p.options), closure);
}



export const autoInit = (base)=>{
    if (base.stateCode === 3) { return; }
    if (base.stateCode === 0) { base.throw("", use(base).error); }
    if (base.stateCode === 2) { return use(base).initialization; }
    if (base.stateCode === 1) { return init(base); }
}