/* COMD 4756 Diagnostics Lab v2 - pure logic (no DOM).
   Loaded in the browser as window.DXE and in Node tests via require(). */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.DXE = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* ---------- Her bell-curve bands (Week 2 slide 18 image) ----------
     Average 85-115 inclusive (slide 17 + textbook). Below 70-84, significantly
     below <70, above 116-129, significantly above >130. The slide image does not
     assign the exact endpoints 70 and 130, so they are reported as "edge" and
     never keyed by an item. */
  function band(ss) {
    if (typeof ss !== "number" || !isFinite(ss)) return null;
    if (ss < 70) return "sigbelow";
    if (ss === 70) return "edge-2";
    if (ss < 85) return "below";
    if (ss <= 115) return "average";
    if (ss < 130) return "above";
    if (ss === 130) return "edge+2";
    return "sigabove";
  }
  const BAND_LABEL = {
    sigbelow: "Significantly below average", below: "Below average", average: "Average",
    above: "Above average", sigabove: "Significantly above average",
    "edge-2": "Exactly 70: the line between below and significantly below (her slide does not assign it)",
    "edge+2": "Exactly 130: the line between above and significantly above (her slide does not assign it)"
  };
  // Standard normal CDF (Abramowitz-Stegun 7.1.26) for percentile readouts.
  function normCdf(z) {
    const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z / 2);
    return z >= 0 ? (1 + y) / 2 : (1 - y) / 2;
  }
  const SCALES = {
    standard: { mean: 100, sd: 15, label: "Standard score" },
    scaled: { mean: 10, sd: 3, label: "Scaled score" },
    z: { mean: 0, sd: 1, label: "z score" },
    stanine: { mean: 5, sd: 2, label: "Stanine" }
  };
  function convert(value, from, to) {
    const z = (value - SCALES[from].mean) / SCALES[from].sd;
    return SCALES[to].mean + z * SCALES[to].sd;
  }

  /* ---------- Chronological age ----------
     borrow = 30 (her COMD 4382 key convention) or "calendar" (days in the month
     before the test month, the textbook's 30-or-31 wording). */
  function daysInMonth(y, m) { return new Date(Date.UTC(y, m, 0)).getUTCDate(); }
  function chronAge(dob, doe, borrow) {
    let [by, bm, bd] = dob, [y, m, d] = doe;
    const steps = [];
    if (d < bd) {
      let py = y, pm = m - 1; if (pm === 0) { pm = 12; py -= 1; }
      const add = borrow === "calendar" ? daysInMonth(py, pm) : 30;
      d += add; m -= 1; steps.push("borrow a month: +" + add + " days, month -1");
    }
    if (m < bm) { m += 12; y -= 1; steps.push("borrow a year: +12 months, year -1"); }
    return { y: y - by, m: m - bm, d: d - bd, steps };
  }
  function fmtAge(a) { return a.y + ";" + a.m + "." + a.d + " (" + a.y + " y " + a.m + " m " + a.d + " d)"; }

  /* ---------- small utils ---------- */
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

  /* ---------- mastery (skill rule) ----------
     Mastered = two consecutive correct answers on distinct items (roots) with the
     latest answer at medium or high confidence. Wrong resets the streak; a wrong
     answer at high confidence flags a misconception. A concept carried over from
     v1 as mastered is "provisional": one correct medium/high answer confirms it. */
  function emptyConcept() {
    return { attempts: 0, correct: 0, streak: 0, roots: [], lastConf: null, mastered: false,
             misconception: false, needsReview: false, v1: false, masteredAt: null, last: null };
  }
  function applyAttempt(cs, itemId, ok, conf, when) {
    cs = Object.assign(emptyConcept(), cs || {});
    cs.roots = Array.isArray(cs.roots) ? cs.roots.slice() : [];
    conf = conf || "medium";
    cs.attempts += 1; cs.lastConf = conf; cs.last = when || null;
    const wasMastered = cs.mastered;
    if (ok) {
      cs.correct += 1; cs.streak += 1;
      if (!cs.roots.includes(itemId)) cs.roots.push(itemId);
      const earned = cs.streak >= 2 && cs.roots.length >= 2 && conf !== "low";
      const confirmed = cs.v1 && conf !== "low";
      cs.mastered = earned || confirmed;
      if (confirmed) cs.v1 = false;
    } else {
      cs.streak = 0; cs.roots = []; cs.mastered = false; cs.v1 = false;
      if (conf === "high") cs.misconception = true;
    }
    cs.needsReview = !ok || conf === "low";
    if (cs.mastered) { cs.misconception = false; if (!wasMastered) cs.masteredAt = when || null; }
    return cs;
  }
  function conceptStatus(cs) {
    if (!cs || !cs.attempts) return cs && cs.v1 ? "provisional" : "new";
    if (cs.misconception) return "misconception";
    if (cs.mastered) return "mastered";
    if (cs.v1) return "provisional";
    if (cs.needsReview) return "review";
    return "learning";
  }

  /* ---------- practice queue ----------
     Wrong: the same item returns after 2 other items. Correct at low confidence:
     after 4. Each item can repeat at most twice per session. */
  const REQUEUE = { wrong: 2, lowConf: 4, maxRepeats: 2 };
  function requeue(queue, pos, entry, ok, conf) {
    const reps = entry.rep || 0;
    let gap = null;
    if (!ok) gap = REQUEUE.wrong; else if (conf === "low") gap = REQUEUE.lowConf;
    if (gap === null || reps >= REQUEUE.maxRepeats) return { queue, inserted: -1 };
    const q = queue.slice();
    const at = Math.min(pos + 1 + gap, q.length);
    q.splice(at, 0, { id: entry.id, rep: reps + 1 });
    return { queue: q, inserted: at };
  }
  // Interleave concepts; within a concept, items not yet answered correctly first.
  function planSession(items, opts) {
    opts = opts || {};
    const r = opts.rng || Math.random, size = opts.size || 20, hist = opts.history || {};
    const byC = {};
    for (const it of items) (byC[it.concept] = byC[it.concept] || []).push(it);
    const score = it => { const h = hist[it.id]; if (!h) return 0; return h.lastOk ? 2 : 1; };
    const lists = Object.values(byC).map(l => shuffle(l, r).sort((a, b) => score(a) - score(b)));
    const order = shuffle(lists, r), out = [];
    while (out.length < size && order.some(l => l.length)) for (const l of order) { if (l.length && out.length < size) out.push(l.shift()); }
    return out.map(it => ({ id: it.id, rep: 0 }));
  }

  /* ---------- exam scoring ---------- */
  function scoreExam(exam, itemsById, answers) {
    const per = [], byConcept = {};
    let points = 0, max = 0, correct = 0;
    for (const id of exam.items) {
      const it = itemsById[id];
      const w = exam.weights ? (exam.weights[it.type] || 1) : 1;
      const g = grade(it, answers[id]);
      const ok = g.answered && g.ok;
      max += w; if (ok) { points += w; correct += 1; }
      per.push({ id, ok, answered: g.answered, pts: ok ? w : 0, max: w });
      const c = byConcept[it.concept] = byConcept[it.concept] || { n: 0, ok: 0, missed: [] };
      c.n += 1; if (ok) c.ok += 1; else c.missed.push(id);
    }
    return { points, max, correct, total: exam.items.length, pct: max ? Math.round(1000 * points / max) / 10 : 0, per, byConcept };
  }

  /* ---------- v1 migration map (old concept id -> new concept ids) ---------- */
  const V1_MAP = {
    "reasoning": ["m1-reasoning"], "assessment-process": ["m1-process"], "good-assessment": ["m2-integrity"],
    "ebp": ["m2-ebp"], "cultural-context": ["m2-culture"], "confidentiality": ["m2-hipaa"], "manual": ["m5-manual"],
    "accommodation": ["m5-accmod"], "modification": ["m5-accmod"], "age": ["m6-ca", "m6-adjusted"],
    "basal-ceiling": ["m6-basal"], "raw-score": ["m6-raw"], "norms": ["m7-norms"], "score-scales": ["m7-scales"],
    "percentiles": ["m7-percentile"], "age-equivalents": ["m7-ae"], "validity-reliability": ["m8-six", "m8-types"],
    "sensitivity-specificity": ["m8-sensspec"], "confidence-interval": ["m7-ci"], "case-history": ["m9-history"],
    "interview-phases": ["m9-interview"], "internal-external": ["m9-influences"], "functional-impact": ["m9-formalinformal"],
    "synthesis-plan": ["m10-outcomes"], "report-sections": ["m10-report"], "results-conference": ["m10-share"],
    "language-history": ["m4-cld"], "difference-disorder": ["m4-diff"], "dynamic-cld": ["m4-da-std"], "asked": ["m4-asked"],
    "interpreter-translator": ["m4-interp"], "bid": ["m4-interp"], "precautions": ["m12-precautions"],
    "structure-function": ["m12-findings", "m14-document"], "stability-mobility": ["m13-four"],
    "dissociation-grading": ["m13-four"], "observe-before-cue": ["m13-rest"], "resonance": ["m13-airway"],
    "submucous-cleft": ["m14-smc"], "amr-smr": ["m14-ddk"], "ddk-measurement": ["m15-ddkadmin"],
    "representative-sample": ["m15-sample"], "speech-rate": ["m15-rate"], "intelligibility": ["m15-intel"],
    "clinical-observation": ["m16-observe"], "informal-assessment": ["m16-informal"], "test-teach-retest": ["m16-dynamic"],
    "informal-evidence-quality": ["m16-informal"], "semantic-skills": ["m17-semantic"], "narrative-comprehension": ["m17-narcomp"],
    "macro-micro": ["m17-levels"], "higher-language": ["m17-levels"], "ca-procedure": ["m18-ca"], "score-position-procedure": ["m18-transfer"]
  };
  const V1_KEYS = { quizzes: "comd4756-study-lab-progress-v1", guided: "comd4756-guided-progress-v1" };
  function safeObj(s) { try { const v = typeof s === "string" ? JSON.parse(s) : s; return v && typeof v === "object" && !Array.isArray(v) ? v : null; } catch (e) { return null; } }
  // raw: {key: string|null} of the two v1 localStorage keys. Returns a legacy summary.
  function readV1(raw) {
    const guided = safeObj(raw && raw[V1_KEYS.guided]) || {};
    const quizzes = safeObj(raw && raw[V1_KEYS.quizzes]) || {};
    const concepts = guided.concepts && typeof guided.concepts === "object" ? guided.concepts : {};
    const modules = guided.modules && typeof guided.modules === "object" ? guided.modules : {};
    const mastered = Object.keys(concepts).filter(k => concepts[k] && concepts[k].mastered === true);
    const misconceptions = Object.keys(concepts).filter(k => concepts[k] && concepts[k].misconception === true);
    const quizBest = {};
    for (const [k, v] of Object.entries(quizzes)) {
      if (!v || typeof v !== "object") continue;
      const e = {};
      if (Number.isFinite(v.score) && Number.isFinite(v.total)) Object.assign(e, { score: v.score, total: v.total, at: v.completedAt || null });
      if (v.weightedBest && Number.isFinite(v.weightedBest.points)) e.weighted = { points: v.weightedBest.points, max: v.weightedBest.totalPoints };
      if (Object.keys(e).length) quizBest[k] = e;
    }
    const completedModules = Object.keys(modules).filter(k => modules[k] && modules[k].completed);
    const found = !!(Object.keys(concepts).length || Object.keys(quizBest).length || completedModules.length);
    return { found, mastered, misconceptions, quizBest, completedModules, conceptCount: Object.keys(concepts).length };
  }
  // Apply a v1 summary to v2 concept state: mastered -> provisional; never overrides v2 evidence.
  function migrateV1(summary, v2concepts, knownConcepts) {
    const out = Object.assign({}, v2concepts), provisional = [];
    for (const old of summary.mastered) for (const nid of (V1_MAP[old] || [])) {
      if (knownConcepts && !knownConcepts[nid]) continue;
      const cur = out[nid];
      if (cur && cur.attempts) continue;
      out[nid] = Object.assign(emptyConcept(), cur || {}, { v1: true });
      if (!provisional.includes(nid)) provisional.push(nid);
    }
    return { concepts: out, provisional };
  }

  return { band, BAND_LABEL, normCdf, SCALES, convert, chronAge, daysInMonth, fmtAge, rng, shuffle, range, parseNum,
           makeView, isAnswered, grade, emptyConcept, applyAttempt, conceptStatus, REQUEUE, requeue, planSession,
           scoreExam, V1_MAP, V1_KEYS, readV1, migrateV1 };
});
