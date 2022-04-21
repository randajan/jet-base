import slib from "@randajan/simple-lib";

slib(
    process.env.NODE_ENV !== "dev",
    {
        minify:false,
        external:["@randajan/jet-core"]
    }
)