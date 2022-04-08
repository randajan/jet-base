import CryptoJS from 'crypto-js';
import jet from "@randajan/jet-core";

const PRIVATE = new Map();

class Crypt {

    static en(key, str) {
        return key ? CryptoJS.AES.encrypt(String.jet.to(str), String.jet.to(key)).toString() : str;
    }

    static de(key, hash) {
        try { return key ? CryptoJS.AES.decrypt(String.jet.to(hash), String.jet.to(key)).toString(CryptoJS.enc.Utf8) : hash; } catch(e) {};
    }

    static enObj(key, obj) { return Crypt.en(String.jet.to(key), jet.json.to(obj)); }

    static deObj(key, hash) { return jet.json.from(Crypt.de(String.jet.to(key), String.jet.to(hash)), false); }

    constructor(key) {
        PRIVATE.set(this, String(key));
    }

    en(str) { return Crypt.en(PRIVATE.get(this), str); }
    de(hash) { return Crypt.de(PRIVATE.get(this), hash); }
    enObj(obj) { return Crypt.enObj(PRIVATE.get(this), obj); }
    deObj(hash) { return Crypt.deObj(PRIVATE.get(this), hash); }
    
}

export default Crypt;