import BaseSync from "../../dist/sync";

const _def = {
    width:[600, 960, 1280, 1920],
    height:[300, 600, 920, 1280]
}

class Screen extends BaseSync {

    constructor() {

        super((base, { widths, heights })=>{
    
            const check = {
                width:Array.jet.tap(widths, _def.width).sort((a,b)=>a-b),
                height:Array.jet.tap(heights, _def.height).sort((a,b)=>a-b)
            }    
    
            window.addEventListener("resize", _=>base.set());
    
            base.fit(_=>{
                const r = {};
                for (let k in check) {
                    const d = check[k], v = this[k];
                    for (let i in d) { r[d[i]+k[0]] = v >= d[i]; };
                }
                return r;
            });
        });

        Object.defineProperties(this, {
            width:{get:_=>Math.max(document.documentElement.clientWidth, window.innerWidth)},
            height:{get:_=>Math.max(document.documentElement.clientHeight, window.innerHeight)}
        });
    }

    getList() {
        const result = [];
        const index = this.get();
        for (const i in index) {
            if(index[i]) { result.push(i); }
        }
        return result;
    }

}

export default new Screen();