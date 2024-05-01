import slib, { argv } from "@randajan/simple-lib";

slib(
    argv.isBuild,
    {
        port:4005,
        lib:{
            entries:["./index.js", "./async.js", "./sync.js"],
            external:["@randajan/jet-core"]
        }

    }
)
