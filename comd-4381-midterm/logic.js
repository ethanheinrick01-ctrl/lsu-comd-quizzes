/* Reused COMD Diagnostics Lab utility/view/grading functions. */
(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.DXE=api;})(typeof self!=="undefined"?self:this,function(){"use strict";
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, r) {
    const a = arr.slice(); r = r || Math.random;
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function range(n) { return Array.from({ length: n }, (_, i) => i); }
  function parseNum(s) {
    if (typeof s === "number") return s;
    if (typeof s !== "string") return NaN;
    const t = s.trim().replace(/[−–]/g, "-").replace(/,/g, ".").replace(/%$/, "").trim();
    if (!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(t)) return NaN;
    return parseFloat(t);
  }

  /* ---------- views: runtime shuffles, stored so a resumed session is identical ---------- */
  function makeView(item, r) {
    r = r || Math.random;
    switch (item.type) {
      case "mc": case "multi": return { opt: shuffle(range(item.options.length), r) };
      case "order": {
        let o = shuffle(range(item.steps.length), r), guard = 0;
        while (o.every((v, i) => v === i) && guard++ < 10) o = shuffle(range(item.steps.length), r);
        return { opt: o };
      }
      case "match": return { right: shuffle(range(item.pairs.length), r) };
      case "sort": return { opt: shuffle(range(item.items.length), r) };
      case "hotspot": return item.visual === "occlusion" ? { panels: shuffle(["c1", "c2", "c3"], r) } : {};
      default: return {};
    }
  }

  /* ---------- grading ---------- */
  function isAnswered(item, resp) {
    if (!resp) return false;
    switch (item.type) {
      case "mc": return Number.isInteger(resp.choice);
      case "tf": return resp.choice === true || resp.choice === false;
      case "multi": return Array.isArray(resp.choices) && resp.choices.length > 0;
      case "order": return Array.isArray(resp.seq) && resp.seq.length === item.steps.length;
      case "match": return !!resp.map && item.pairs.every((_, i) => Number.isInteger(resp.map[i]));
      case "sort": return !!resp.map && item.items.every((_, i) => typeof resp.map[i] === "string" && resp.map[i]);
      case "num": return Array.isArray(resp.vals) && item.fields.every((_, i) => String(resp.vals[i] ?? "").trim() !== "");
      case "hotspot": return typeof resp.zone === "string" && !!resp.zone;
      case "teach": return !!resp.self;
      default: return false;
    }
  }
  function grade(item, resp) {
    const out = { ok: false, answered: isAnswered(item, resp), parts: null };
    if (!out.answered) return out;
    switch (item.type) {
      case "mc": out.ok = resp.choice === item.answer; break;
      case "tf": out.ok = resp.choice === item.answer; break;
      case "multi": {
        const a = [...new Set(resp.choices)].sort((x, y) => x - y);
        out.ok = a.length === item.answer.length && a.every((v, i) => v === item.answer[i]);
        out.parts = item.options.map((_, i) => ({ chosen: a.includes(i), key: item.answer.includes(i) }));
        break;
      }
      case "order": out.parts = resp.seq.map((v, i) => v === i); out.ok = out.parts.every(Boolean); break;
      case "match": out.parts = item.pairs.map((_, i) => resp.map[i] === i); out.ok = out.parts.every(Boolean); break;
      case "sort": out.parts = item.items.map((x, i) => resp.map[i] === x[1]); out.ok = out.parts.every(Boolean); break;
      case "num": out.parts = item.fields.map((f, i) => {
        const v = parseNum(resp.vals[i]); return isFinite(v) && Math.abs(v - f.answer) <= (f.tol || 0) + 1e-9;
      }); out.ok = out.parts.every(Boolean); break;
      case "hotspot": out.ok = resp.zone === item.answer; break;
      case "teach": out.ok = resp.self === "got"; out.ungraded = true; break;
    }
    return out;
  }


return {rng,shuffle,makeView,isAnswered,grade};
});
