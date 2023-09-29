import slib from "@randajan/simple-lib";

slib(
    process.env.NODE_ENV !== "dev",
    {
        port:4005,
        lib:{
            entries:["./index.js", "./async.js", "./sync.js"],
            external:["@randajan/jet-core"]
        }

    }
)
