/* eslint-disable no-unused-expressions */
var keyStr = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=";

function encodeString(e) {
    var t,
        i,
        r,
        n,
        o,
        a,
        s,
        l = "",
        d = 0;
    for (e = unicodeEncode(e); d < e.length;)
        (n = (t = e.charCodeAt(d++)) >> 2),
            (o = ((3 & t) << 4) | ((i = e.charCodeAt(d++)) >> 4)),
            (a = ((15 & i) << 2) | ((r = e.charCodeAt(d++)) >> 6)),
            (s = 63 & r),
            isNaN(i) ? (a = s = 64) : isNaN(r) && (s = 64),
            (l =
                l +
                keyStr.charAt(n) +
                keyStr.charAt(o) +
                keyStr.charAt(a) +
                keyStr.charAt(s));
    return l;
}

function unicodeEncode(e) {
    for (var t = e.replace(/\r\n/g, "\n"), i = "", r = 0; r < t.length; r++) {
        var n = t.charCodeAt(r);
        n < 128
            ? (i += String.fromCharCode(n))
            : n > 127 && n < 2048
                ? ((i += String.fromCharCode((n >> 6) | 192)),
                    (i += String.fromCharCode((63 & n) | 128)))
                : ((i += String.fromCharCode((n >> 12) | 224)),
                    (i += String.fromCharCode(((n >> 6) & 63) | 128)),
                    (i += String.fromCharCode((63 & n) | 128)));
    }
    return i;
}

function encodeToUtf8Array(e) {
    var t,
        i,
        r,
        n,
        o,
        a,
        s = 0,
        l = 0,
        d = (3 * (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "")).length) / 4;
    if (
        (e.charAt(e.length - 1) === keyStr.charAt(64) && d--,
            e.charAt(e.length - 2) === keyStr.charAt(64) && d--,
            d % 1 != 0)
    )
        throw new Error("Invalid base64 input, bad content length.");
    for (var h = new Uint8Array(0 | d); s < e.length;)
        (t =
            (keyStr.indexOf(e.charAt(s++)) << 2) |
            ((n = keyStr.indexOf(e.charAt(s++))) >> 4)),
            (i = ((15 & n) << 4) | ((o = keyStr.indexOf(e.charAt(s++))) >> 2)),
            (r = ((3 & o) << 6) | (a = keyStr.indexOf(e.charAt(s++)))),
            (h[l++] = t),
            64 !== o && (h[l++] = i),
            64 !== a && (h[l++] = r);
    return h;
}

function utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
            case 12:
            case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(
                    ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
                );
                break;
        }
    }

    return out;
}

function decodeString(e) {
    let a = encodeToUtf8Array(e);
    let out = utf8ArrayToStr(a);
    return out;
}


//LOCAL
function setLocalObject(key, value) {
    let en = encodeString(JSON.stringify(value));
    localStorage.setItem(key, en);
    return true;
}

function getLocalObject(key) {
    let a = localStorage.getItem(key);
    const de = JSON.parse(decodeString(a));
    return de;
}

function setLocalString(key, value) {
    let en = encodeString(value);
    localStorage.setItem(key, en);
    return true;
}

function getLocalString(key) {
    let a = localStorage.getItem(key);
    const de = decodeString(a);
    return de;
}

//SESSION
function setSessionObject(key, value) {
    let en = encodeString(JSON.stringify(value));
    sessionStorage.setItem(key, en);
    return true;
}

function getSessionObject(key) {
    let a = sessionStorage.getItem(key);
    const de = JSON.parse(decodeString(a));
    return de;
}

function setSessionString(key, value) {
    let en = encodeString(value);
    sessionStorage.setItem(key, en);
    return true;
}

function getSessionString(key) {
    let a = sessionStorage.getItem(key);
    const de = decodeString(a);
    return de;
}


module.exports = {
    setLocalObject,
    getLocalObject,
    setLocalString,
    getLocalString,
    setSessionObject,
    getSessionObject,
    setSessionString,
    getSessionString,
};
