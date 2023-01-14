import jet from "@randajan/jet-core";
import BaseSync from "../../dist/sync";

const def = {
    width:[600, 960, 1280, 1920],
    height:[300, 600, 920, 1280]
}

class Screen extends Base {

    constructor() {
        super(options=>{
            const { widths, heights } = Object.jet.to(options);
    
            const check = {
                width:Array.jet.tap(widths, def.width).sort((a,b)=>a-b),
                height:Array.jet.tap(heights, def.height).sort((a,b)=>a-b)
            }    
    
            window.addEventListener("resize", _=>this.set());
    
            this.fit(_=>{
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

}

export default new Screen();