import slib from "@randajan/simple-lib";

slib(
    process.env.NODE_ENV !== "dev",
    {
        lib:{
            entries:["./index.js", "./async.js", "./sync.js"],
            external:["@randajan/jet-core"]
        }

    }
)
