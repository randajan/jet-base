import qs from "query-string";

import jet from "@randajan/jet-core";
import Base from "../../dist/index.js";

const parseQuery = (query, startChar="?")=>{
    if (Object.jet.is(query)) { return query; }
    query = String.jet.to(query, "&");
    query.startsWith(startChar) ? query.slice(1) : query;
    return {...qs.parse(query, {parseNumbers: true, parseBooleans: true})};
}

const buildQuery = query=>{
    if (Object.jet.is(query)) { return qs.stringify(query); }
    return String.jet.to(query);
}

class Page extends Base {
    constructor() {
        super();

        const loc = window.location;
        const his = window.history;

        let setFrom = true, setTo;

        this.fit("search", (next, v)=>next(setFrom ? loc.search : v));
        this.fit("hash", (next, v)=>next(setFrom ? loc.hash : v));

        this.fit((next, v)=>{
            v = Object.jet.tap(v);
            v.protocol = loc.protocol;
            v.hostname = loc.hostname;
            v.port = loc.port;
            v.origin = loc.origin;

            if (setFrom) { v.pathname = loc.pathname; }
            
            v.search = parseQuery(v.search, "?");
            v.hash = parseQuery(v.hash, "#");
            
            const search = buildQuery(v.search);
            const hash = buildQuery(v.hash);

            v.title = String.jet.to(v.title);
            v.pathname = String.jet.to(v.pathname, "/");
            v.path = v.pathname + (search ? "?"+search : "") + (hash ? "#"+hash : "");
            v.href = v.origin + v.path;

            return v;
        });

        this.watch("title", get=>document.title = get())

        this.watch("path", get=>{
            if (!setTo) {
                setTo = true;
                his[setFrom ? "replaceState" : "pushState"]({}, "", get());
                setTo = false;
            }
        });

        const onHistoryChanged = window.onpopstate = _=>{
            if (!this.is("href", loc.href) && !setTo && !setFrom) {
                setFrom = true;
                this.set();
                setFrom = false;
            }
        }

        for (const h of Object.keys(History.prototype)) {
            const orig = his[h];
            if (jet.isRunnable(orig)) {
                his[h] = function(...a) {
                    const r = orig.call(this, ...a);
                    onHistoryChanged();
                    return r;
                }
            }
        }

        setFrom = false;
    }

}

export default new Page();