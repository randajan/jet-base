import jet from "@randajan/jet-core";
import { BaseAsync } from "../../dist/index.js";

const def = {
    width:[600, 960, 1280, 1920],
    height:[300, 600, 920, 1280]
}

class Screen extends BaseAsync {

    constructor() {
        super();

        Object.defineProperties(this, {
            width:{get:_=>Math.max(document.documentElement.clientWidth, window.innerWidth)},
            height:{get:_=>Math.max(document.documentElement.clientHeight, window.innerHeight)}
        });
    }

    async init(options, debug=false) {
        const { widths, heights } = Object.jet.to(options);

        const check = {
            width:Array.jet.tap(widths, def.width).sort((a,b)=>a-b),
            height:Array.jet.tap(heights, def.height).sort((a,b)=>a-b)
        }    

        window.addEventListener("resize", _=>this.set());

        await this.fit(_=>{
            const r = {};
            for (let k in check) {
                const d = check[k], v = this[k];
                for (let i in d) { r[d[i]+k[0]] = v >= d[i]; };
            }
            return r;
        });

        return super.init(debug);
    }

}

export default new Screen();