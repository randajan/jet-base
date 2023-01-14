import jet from "@randajan/jet-core";
import BaseAsync from "../../dist/async";
import screen from "./screen.js";


window.jet = jet;



window.baseScreen = screen;

window.base = new BaseAsync(async (base, options)=>{
    await new Promise((res, rej)=>{
        setTimeout(_=>{
            base.set({test:"test"});
            res();
        }, 1000);
    })
    
});


