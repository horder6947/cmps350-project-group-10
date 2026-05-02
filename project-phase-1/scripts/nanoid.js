/**
 * Bundled by jsDelivr using Rollup v2.79.2 and Terser v5.39.0.
 * Original file: /npm/nanoid@5.1.7/index.browser.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
let t = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", e = t => crypto.getRandomValues(new Uint8Array(t)), r = (t, e, r) => { let l = (2 << Math.log2(t.length - 1)) - 1, n = -~(1.6 * l * e / t.length); return (o = e) => { let a = ""; for (; ;) { let e = r(n), u = 0 | n; for (; u--;)if (a += t[e[u] & l] || "", a.length >= o) return a } } }, l = (t, l = 21) => r(t, 0 | l, e), n = (e = 21) => { let r = "", l = crypto.getRandomValues(new Uint8Array(e |= 0)); for (; e--;)r += t[63 & l[e]]; return r }; export { l as customAlphabet, r as customRandom, n as nanoid, e as random, t as urlAlphabet }; export default null;
//# sourceMappingURL=/sm/c2ea3278721874819308885f30e66ccefa8571aa0bd133144676b80d33ea28b6.map