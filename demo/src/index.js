import jet from "@randajan/jet-core";
import BaseAsync from "../../dist/async";
import BaseSync from "../../dist/sync";
import screen from "./screen.js";


window.jet = jet;


screen.config({
    width:[400, 600, 960, 1280, 1920],
    height:[300, 600, 920, 1280]
});

window.baseScreen = screen;

window.baseA = new BaseAsync(async (base, options)=>{
    await new Promise((res, rej)=>{
        setTimeout(_=>{
            base.set({test:"test"});
            res();
        }, 1000);
    })
    
});


window.base = new BaseSync();

