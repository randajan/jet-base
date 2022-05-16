import jet from "@randajan/jet-core";
import { BaseSync, BaseAsync } from "../../dist/index.js";
import screen from "./screen.js";


window.jet = jet;



window.baseScreen = screen;

window.base = new BaseAsync(async (base)=>{

    await new Promise((res, rej)=>{
        setTimeout(_=>{
            base.set({test:"test"});
            rej();
        }, 1000);
    })
    
});


