import slib from "@randajan/simple-lib";

slib({
    start:process.env.NODE_ENV === "dev",
    external:["@randajan/jet-core"]
})