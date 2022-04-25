
const LIST = new Map();

export const use = base=>LIST.get(base);

export const register = base=>{
    LIST.set(base, {
        paths:new Set(),
        flat:{},
        fits:{},
        watches:{}
    })
}