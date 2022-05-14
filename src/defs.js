import BaseSync from "./sync";

const LIST = new Map();

export const use = base=>LIST.get(base);

export const register = (base)=>{

    const priv = {
        paths:new Set(),
        flat:{},
        fits:{},
        watches:{},
        state:"pending",
        debug:false
    };

    LIST.set(base, priv);

    return priv;
}

export const config = (base, ...args)=>{
    const priv = use(base);
    if (priv.state !== "pending") { base.throw("config", `state must be 'pending' insted of ${priv.state}`) }
    if (priv.config) { base.throw("config", "can be called just once"); }
    priv.config = args;
}

export const init = (base)=>{
    use(base).initialized = true;
    return base;
}