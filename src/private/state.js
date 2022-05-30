import { use } from "./defs.js";

export const states = ["pending", "loading", "saving", "ready", "error"];

export const getStateCode = (base, path)=>use(base).states[String.jet.to(path, ".")] || 0;