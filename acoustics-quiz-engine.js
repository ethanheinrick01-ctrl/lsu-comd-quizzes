(function () {
  "use strict";

  var page = window.ACOUSTICS_PAGE;
  if (!page) return;

  var state = {
    earned: 0,
    possible: 0,
    answered: 0,
    total: 0,
    graded: {}
  };

  function escapeHTML(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[ch];
    });
  }

  function normalizeQuestions() {
    if (!page.sections) page.sections = [{ title: page.title, questions: page.questions || [] }];
    page.sections.forEach(function (section) {
      section.questions.forEach(function (q) {
        if (!q.points) q.points = q.type === "short" || q.type === "visual" ? 3 : 1;
        if (q.type === "tf" && !q.options) q.options = ["True", "False"];
      });
    });
  }

  function allQuestions() {
    var list = [];
    page.sections.forEach(function (section) {
      section.questions.forEach(function (q) {
        list.push(q);
      });
    });
    return list;
  }

  function sumPossible() {
    return allQuestions().reduce(function (sum, q) { return sum + q.points; }, 0);
  }

  function headerHTML() {
    return [
      '<header class="site-header">',
      '  <div class="wrap top">',
      '    <p class="kicker">' + escapeHTML(page.course || "COMD 4153") + '</p>',
      '    <h1>' + escapeHTML(page.title) + '</h1>',
      page.subtitle ? '    <p class="lede">' + escapeHTML(page.subtitle) + '</p>' : '',
      page.sourceNote ? '    <p class="source-note">' + escapeHTML(page.sourceNote) + '</p>' : '',
      '  </div>',
      '</header>'
    ].join("");
  }

  function renderHub() {
    var cards = page.cards.map(function (card) {
      var pills = (card.pills || []).map(function (pill, index) {
        return '<span class="pill ' + (index === 1 ? "gold" : "") + '">' + escapeHTML(pill) + '</span>';
      }).join("");
      return [
        '<a class="hub-card" href="' + escapeHTML(card.href) + '">',
        '  <div>',
        '    <div class="meta">' + pills + '</div>',
        '    <h2>' + escapeHTML(card.title) + '</h2>',
        '    <p class="desc">' + escapeHTML(card.desc) + '</p>',
        '  </div>',
        '  <span class="cta">' + escapeHTML(card.cta || "Start") + '</span>',
        '</a>'
      ].join("");
    }).join("");

    document.body.innerHTML = headerHTML() + [
      '<main class="wrap">',
      '  <div class="hub-grid" aria-label="Available Acoustics final quizzes">',
      cards,
      '  </div>',
      page.note ? '<p class="note">' + escapeHTML(page.note) + '</p>' : '',
      '</main>'
    ].join("");
  }

  function renderQuiz() {
    normalizeQuestions();
    state.possible = sumPossible();
    state.total = allQuestions().length;

    var sectionsHTML = page.sections.map(function (section, sectionIndex) {
      var questions = section.questions.map(function (q, qIndex) {
        var number = q.number || questionNumber(sectionIndex, qIndex);
        return questionHTML(q, number);
      }).join("");
      return [
        '<section class="section-card">',
        '  <h2>' + escapeHTML(section.title) + '</h2>',
        section.desc ? '  <p>' + escapeHTML(section.desc) + '</p>' : '',
        '</section>',
        questions
      ].join("");
    }).join("");

    var examHeader = "";
    if (page.examHeader) {
      examHeader = [
        '<section class="exam-header">',
        '  <h2>' + escapeHTML(page.examHeader.title) + '</h2>',
        '  <p>' + escapeHTML(page.examHeader.instructions) + '</p>',
        '  <div class="exam-lines">',
        '    <span>Name:</span><span>Date:</span><span>Score:</span>',
        '  </div>',
        '</section>'
      ].join("");
    }

    document.body.innerHTML = headerHTML() + [
      '<main class="wrap">',
      '  <div class="quiz-shell">',
      '    <aside class="score-panel" aria-label="Quiz controls">',
      '      <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>',
      '      <div class="score-inner">',
      '        <p class="score-title">Score</p>',
      '        <p class="score-number"><span id="earned">0</span>/<span id="possible">' + state.possible + '</span></p>',
      '        <p class="score-sub"><span id="answered">0</span> of <span id="total">' + state.total + '</span> answered</p>',
      '        <div class="action-list">',
      '          <button type="button" class="action-btn" data-action="print">Print / Save PDF</button>',
      '          <button type="button" class="action-btn secondary" data-action="reveal-all">Reveal All</button>',
      '          <button type="button" class="action-btn secondary" data-action="reset">Reset</button>',
      '        </div>',
      '      </div>',
      '    </aside>',
      '    <div>',
      examHeader,
      sectionsHTML,
      '    </div>',
      '  </div>',
      '</main>'
    ].join("");

    drawAllVisuals();
    attachEvents();
    updateScore();
  }

  function questionNumber(sectionIndex, qIndex) {
    var offset = 0;
    for (var i = 0; i < sectionIndex; i++) offset += page.sections[i].questions.length;
    return offset + qIndex + 1;
  }

  function questionHTML(q, number) {
    var id = "q" + number;
    var typeLabel = q.type === "multi" ? "Find All" : q.type === "short" || q.type === "visual" ? "Written" : q.type === "tf" ? "T/F" : "MC";
    var visual = q.visual ? visualHTML(q.visual, q.visualCaption) : "";
    var prompt = [
      '<p class="q-prompt">' + escapeHTML(q.prompt) + ' <span class="pill paper">' + q.points + ' pt' + (q.points === 1 ? "" : "s") + '</span></p>',
      q.subprompt ? '<p class="q-subprompt">' + escapeHTML(q.subprompt) + '</p>' : ''
    ].join("");

    var response = "";
    if (q.type === "mc" || q.type === "tf") {
      response = '<div class="option-list">' + q.options.map(function (option, index) {
        return '<button type="button" class="choice-btn" data-action="choose" data-qid="' + id + '" data-index="' + index + '">' + escapeHTML(option) + '</button>';
      }).join("") + '</div>';
    } else if (q.type === "multi") {
      response = '<div class="option-list">' + q.options.map(function (option, index) {
        return '<label class="multi-row" data-index="' + index + '"><input type="checkbox" data-qid="' + id + '" data-index="' + index + '"> <span>' + escapeHTML(option) + '</span></label>';
      }).join("") + '</div><button type="button" class="check-btn" data-action="check-multi" data-qid="' + id + '">Check Answer</button>';
    } else {
      response = [
        '<textarea class="answer-box" data-qid="' + id + '" placeholder="Write the answer in professor-style principle -> cause -> acoustic consequence form."></textarea>',
        '<div class="short-actions">',
        '  <button type="button" class="reveal-btn" data-action="reveal" data-qid="' + id + '">Reveal Model Answer</button>',
        '</div>',
        '<div class="self-grade">',
        '  <button type="button" class="self-btn full" data-action="self-grade" data-qid="' + id + '" data-score="full">Full Credit</button>',
        '  <button type="button" class="self-btn partial" data-action="self-grade" data-qid="' + id + '" data-score="partial">Partial</button>',
        '  <button type="button" class="self-btn miss" data-action="self-grade" data-qid="' + id + '" data-score="miss">Needs Review</button>',
        '</div>'
      ].join("");
    }

    var model = modelHTML(q);
    window.__ACOUSTICS_QS = window.__ACOUSTICS_QS || {};
    window.__ACOUSTICS_QS[id] = q;

    return [
      '<article class="question-card" id="' + id + '">',
      '  <div class="question-top">',
      '    <span class="q-num">Question ' + number + ' - ' + typeLabel + '</span>',
      '    <span class="q-topic">' + escapeHTML(q.topic || "") + '</span>',
      '  </div>',
      '  <div class="q-body">',
      visual,
      prompt,
      response,
      '    <div class="feedback" data-feedback="' + id + '"></div>',
      model,
      '  </div>',
      '</article>'
    ].join("");
  }

  function visualHTML(type, caption) {
    return [
      '<figure class="visual-frame">',
      '  <canvas width="980" height="360" data-visual="' + escapeHTML(type) + '"></canvas>',
      caption ? '  <figcaption class="visual-caption">' + escapeHTML(caption) + '</figcaption>' : '',
      '</figure>'
    ].join("");
  }

  function modelHTML(q) {
    if (!q.model && !q.explanation) return "";
    var rubric = "";
    if (q.rubric && q.rubric.length) {
      rubric = '<div class="rubric"><strong>Rubric:</strong><ul>' + q.rubric.map(function (item) {
        return '<li>' + escapeHTML(item) + '</li>';
      }).join("") + '</ul></div>';
    }
    return '<div class="model" data-model="' + q._id + '">' + escapeHTML(q.model || q.explanation) + rubric + '</div>';
  }

  function attachEvents() {
    document.addEventListener("click", function (event) {
      var target = event.target.closest("[data-action]");
      if (!target) return;
      var action = target.getAttribute("data-action");
      if (action === "choose") choose(target);
      if (action === "check-multi") checkMulti(target);
      if (action === "reveal") revealModel(target.getAttribute("data-qid"));
      if (action === "self-grade") selfGrade(target);
      if (action === "reveal-all") revealAll();
      if (action === "reset") window.location.reload();
      if (action === "print") window.print();
    });
  }

  function choose(button) {
    var qid = button.getAttribute("data-qid");
    if (state.graded[qid]) return;
    var q = window.__ACOUSTICS_QS[qid];
    var selected = Number(button.getAttribute("data-index"));
    var correct = selected === q.answer;
    var card = document.getElementById(qid);
    card.querySelectorAll(".choice-btn").forEach(function (btn) {
      var index = Number(btn.getAttribute("data-index"));
      btn.disabled = true;
      if (index === q.answer) btn.classList.add("correct");
      if (index === selected && index !== q.answer) btn.classList.add("wrong");
    });
    mark(qid, correct ? q.points : 0, true);
    showFeedback(qid, correct, q.explanation);
  }

  function checkMulti(button) {
    var qid = button.getAttribute("data-qid");
    if (state.graded[qid]) return;
    var q = window.__ACOUSTICS_QS[qid];
    var card = document.getElementById(qid);
    var selected = [];
    card.querySelectorAll('input[type="checkbox"]').forEach(function (input) {
      if (input.checked) selected.push(Number(input.getAttribute("data-index")));
      input.disabled = true;
    });
    var answer = q.answer.slice().sort().join(",");
    var picked = selected.slice().sort().join(",");
    var correct = answer === picked;
    card.querySelectorAll(".multi-row").forEach(function (row) {
      var index = Number(row.getAttribute("data-index"));
      if (q.answer.indexOf(index) !== -1) row.classList.add("correct");
      else if (selected.indexOf(index) !== -1) row.classList.add("wrong");
    });
    button.disabled = true;
    mark(qid, correct ? q.points : 0, true);
    showFeedback(qid, correct, q.explanation);
  }

  function revealModel(qid) {
    var card = document.getElementById(qid);
    var model = card.querySelector(".model");
    if (model) model.classList.add("show");
  }

  function selfGrade(button) {
    var qid = button.getAttribute("data-qid");
    if (state.graded[qid]) return;
    var q = window.__ACOUSTICS_QS[qid];
    var scoreType = button.getAttribute("data-score");
    var value = scoreType === "full" ? q.points : scoreType === "partial" ? Math.ceil(q.points / 2) : 0;
    revealModel(qid);
    mark(qid, value, true);
    var card = document.getElementById(qid);
    card.querySelectorAll(".self-btn").forEach(function (btn) { btn.disabled = true; });
    showFeedback(qid, value === q.points, value === q.points ? "Self-graded full credit. Keep the answer compact and mechanism-based." : "Marked for review. Compare your wording to the model and tighten the mechanism.");
  }

  function mark(qid, points, answered) {
    state.graded[qid] = true;
    state.earned += points;
    if (answered) state.answered += 1;
    updateScore();
  }

  function showFeedback(qid, correct, text) {
    var feedback = document.querySelector('[data-feedback="' + qid + '"]');
    if (!feedback) return;
    feedback.className = "feedback show " + (correct ? "good" : "bad");
    feedback.innerHTML = '<strong>' + (correct ? "Correct." : "Review this.") + '</strong> ' + escapeHTML(text || "");
  }

  function revealAll() {
    Object.keys(window.__ACOUSTICS_QS || {}).forEach(function (qid) {
      revealModel(qid);
      var q = window.__ACOUSTICS_QS[qid];
      var card = document.getElementById(qid);
      if (!card) return;
      if (q.type === "mc" || q.type === "tf") {
        card.querySelectorAll(".choice-btn").forEach(function (btn) {
          if (Number(btn.getAttribute("data-index")) === q.answer) btn.classList.add("correct");
        });
      }
      if (q.type === "multi") {
        card.querySelectorAll(".multi-row").forEach(function (row) {
          if (q.answer.indexOf(Number(row.getAttribute("data-index"))) !== -1) row.classList.add("correct");
        });
      }
    });
  }

  function updateScore() {
    var earned = document.getElementById("earned");
    var answered = document.getElementById("answered");
    var progress = document.getElementById("progressFill");
    if (earned) earned.textContent = state.earned;
    if (answered) answered.textContent = state.answered;
    if (progress) progress.style.width = Math.round((state.answered / Math.max(1, state.total)) * 100) + "%";
  }

  function drawAllVisuals() {
    document.querySelectorAll("canvas[data-visual]").forEach(function (canvas) {
      drawVisual(canvas, canvas.getAttribute("data-visual"));
    });
  }

  function drawVisual(canvas, type) {
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#fbfcfe";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#c3cfda";
    ctx.lineWidth = 1;
    ctx.strokeRect(1, 1, w - 2, h - 2);

    if (type === "source-filter") drawSourceFilter(ctx, w, h);
    else if (type === "vowel-space") drawVowelSpace(ctx, w, h);
    else if (type === "nasal-order") drawNasalOrder(ctx, w, h);
    else if (type === "nasalization") drawNasalization(ctx, w, h);
    else if (type === "fricative-spectra") drawFricativeSpectra(ctx, w, h);
    else if (type === "stop-vot") drawStopVOT(ctx, w, h);
    else if (type === "affricate-compare") drawAffricateCompare(ctx, w, h);
    else if (type === "semivowels") drawSemivowels(ctx, w, h);
    else if (type === "prosody") drawProsody(ctx, w, h);
    else drawDisplays(ctx, w, h);
  }

  function label(ctx, text, x, y, size, color, align) {
    ctx.fillStyle = color || "#17212b";
    ctx.font = "700 " + (size || 14) + "px Arial";
    ctx.textAlign = align || "left";
    ctx.fillText(text, x, y);
  }

  function axis(ctx, x, y, w, h, xLabel, yLabel) {
    ctx.strokeStyle = "#5d6b7a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.stroke();
    label(ctx, xLabel, x + w / 2, y + h + 28, 13, "#596573", "center");
    label(ctx, yLabel, x - 12, y - 8, 13, "#596573");
  }

  function curve(ctx, points, color, width) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width || 3;
    ctx.beginPath();
    points.forEach(function (p, i) {
      if (i === 0) ctx.moveTo(p[0], p[1]);
      else ctx.lineTo(p[0], p[1]);
    });
    ctx.stroke();
  }

  function drawSourceFilter(ctx, w, h) {
    label(ctx, "Source-filter theory: source spectrum x vocal tract filter = output spectrum", 38, 34, 18, "#215f73");
    var boxes = [
      { x: 46, title: "Source", sub: "vocal folds\nF0 + harmonics" },
      { x: 360, title: "Filter", sub: "vocal tract\nformant peaks" },
      { x: 675, title: "Output", sub: "vowel spectrum\nshaped energy" }
    ];
    boxes.forEach(function (b) {
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#c3cfda";
      ctx.lineWidth = 2;
      ctx.roundRect(b.x, 72, 245, 210, 10);
      ctx.fill();
      ctx.stroke();
      label(ctx, b.title, b.x + 18, 105, 18, "#17212b");
      b.sub.split("\n").forEach(function (line, i) { label(ctx, line, b.x + 18, 130 + i * 22, 14, "#596573"); });
    });
    drawSpectrumBars(ctx, 74, 240, 190, 70, "#215f73");
    drawFilterCurve(ctx, 390, 242, 190, 90, "#8a4f16");
    drawOutputBars(ctx, 704, 240, 190, 75);
    arrow(ctx, 304, 174, 345, 174);
    arrow(ctx, 619, 174, 660, 174);
    label(ctx, "independent", 252, 308, 13, "#775500", "center");
    label(ctx, "shape changes formants", 486, 308, 13, "#775500", "center");
  }

  function drawSpectrumBars(ctx, x, y, w, h, color) {
    ctx.strokeStyle = "#596573";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.stroke();
    ctx.fillStyle = color;
    for (var i = 0; i < 12; i++) {
      var bx = x + 10 + i * 14;
      var bh = h * (1 - i / 16);
      ctx.fillRect(bx, y - bh, 6, bh);
    }
  }

  function drawFilterCurve(ctx, x, y, w, h, color) {
    axis(ctx, x, y - h, w, h, "frequency", "amp");
    curve(ctx, [[x, y - 12], [x + 35, y - 22], [x + 62, y - 70], [x + 94, y - 26], [x + 135, y - 78], [x + 174, y - 20], [x + w, y - 38]], color, 4);
    label(ctx, "F1", x + 62, y - 80, 12, color, "center");
    label(ctx, "F2", x + 135, y - 88, 12, color, "center");
  }

  function drawOutputBars(ctx, x, y, w, h) {
    ctx.strokeStyle = "#596573";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.stroke();
    ctx.fillStyle = "#215f73";
    for (var i = 0; i < 12; i++) {
      var boost = i === 3 ? 1.35 : i === 8 ? 1.1 : .55;
      var bh = Math.max(8, h * (1 - i / 16) * boost);
      ctx.fillRect(x + 10 + i * 14, y - bh, 7, bh);
    }
  }

  function drawVowelSpace(ctx, w, h) {
    label(ctx, "Vowel space: F1 tracks height; F2 tracks advancement", 38, 34, 18, "#215f73");
    var x = 115, y = 72, bw = 720, bh = 230;
    axis(ctx, x, y, bw, bh, "F2: high/front on left, low/back on right", "F1 low/high");
    label(ctx, "high vowels", x + bw + 10, y + 22, 13, "#596573");
    label(ctx, "low vowels", x + bw + 10, y + bh - 10, 13, "#596573");
    var pts = [
      ["i", x + 120, y + 45], ["u", x + 585, y + 55], ["ae", x + 230, y + 198],
      ["a", x + 480, y + 218], ["oi", x + 410, y + 135], ["ai", x + 300, y + 170]
    ];
    ctx.fillStyle = "#e9f2f5";
    ctx.strokeStyle = "#215f73";
    pts.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p[1], p[2], 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      label(ctx, "/" + p[0] + "/", p[1], p[2] + 5, 13, "#17212b", "center");
    });
    curve(ctx, [[x + 410, y + 135], [x + 355, y + 120], [x + 300, y + 170]], "#8a4f16", 3);
    label(ctx, "diphthong = trajectory, not one midpoint", x + 490, y + 150, 13, "#8a4f16");
  }

  function drawNasalOrder(ctx, w, h) {
    label(ctx, "Nasal antiresonance: larger trapped oral cavity -> lower antiresonance", 38, 34, 18, "#215f73");
    var items = [
      { name: "/m/", x: 110, ar: "lowest AR", cavity: 210 },
      { name: "/n/", x: 400, ar: "middle AR", cavity: 145 },
      { name: "/ng/", x: 690, ar: "highest AR", cavity: 82 }
    ];
    items.forEach(function (it) {
      ctx.strokeStyle = "#596573";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(it.x, 120, 210, 64, 28);
      ctx.stroke();
      ctx.fillStyle = "#dfe9ee";
      ctx.fillRect(it.x + 16, 142, it.cavity, 20);
      label(ctx, it.name, it.x + 105, 105, 22, "#17212b", "center");
      label(ctx, "trapped cavity", it.x + 105, 214, 13, "#596573", "center");
      label(ctx, it.ar, it.x + 105, 245, 15, "#8a4f16", "center");
    });
    label(ctx, "frequency order: /m/ < /n/ < /ng/", w / 2, 310, 18, "#215f73", "center");
  }

  function drawNasalization(ctx, w, h) {
    label(ctx, "Nasalized vowel: oral + nasal tracts open, added resonance and antiresonance", 38, 34, 18, "#215f73");
    axis(ctx, 90, 78, 360, 220, "frequency", "amplitude");
    curve(ctx, [[90, 250], [150, 120], [210, 228], [270, 150], [350, 235], [450, 210]], "#215f73", 4);
    label(ctx, "oral vowel", 266, 108, 14, "#215f73");
    axis(ctx, 540, 78, 360, 220, "frequency", "amplitude");
    curve(ctx, [[540, 255], [590, 198], [620, 242], [676, 130], [735, 256], [820, 162], [900, 230]], "#8a4f16", 4);
    label(ctx, "nasalized vowel", 718, 108, 14, "#8a4f16");
    label(ctx, "nasal peak", 588, 188, 12, "#775500", "center");
    label(ctx, "antiresonance notch", 735, 272, 12, "#775500", "center");
  }

  function drawFricativeSpectra(ctx, w, h) {
    label(ctx, "Fricative spectra: constriction farther back -> larger front cavity -> lower peak", 38, 34, 18, "#215f73");
    var panels = [
      { name: "/s/", x: 80, peak: 260, color: "#215f73", note: "small front cavity\nhigh peak" },
      { name: "/sh/", x: 365, peak: 175, color: "#8a4f16", note: "larger front cavity\nlower peak" },
      { name: "/f/", x: 650, peak: 120, color: "#596573", note: "weak/flat\nnonsibilant" }
    ];
    panels.forEach(function (p) {
      axis(ctx, p.x, 92, 220, 190, "frequency", "amp");
      var pts = [];
      for (var i = 0; i <= 220; i += 16) {
        var px = p.x + i;
        var center = p.peak;
        var dist = Math.abs(i - center);
        var y = 260 - Math.max(10, 125 * Math.exp(-(dist * dist) / 4000));
        if (p.name === "/f/") y = 235 - 15 * Math.sin(i / 18);
        pts.push([px, y]);
      }
      curve(ctx, pts, p.color, 4);
      label(ctx, p.name, p.x + 110, 72, 20, "#17212b", "center");
      p.note.split("\n").forEach(function (line, idx) { label(ctx, line, p.x + 110, 318 + idx * 18, 13, p.color, "center"); });
    });
  }

  function drawStopVOT(ctx, w, h) {
    label(ctx, "Voiceless stop: closure -> burst -> frication/aspiration -> vowel; VOT starts at burst", 38, 34, 18, "#215f73");
    var x = 70, y = 182;
    ctx.strokeStyle = "#596573";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(900, y);
    ctx.stroke();
    segment(ctx, x, y, 165, "closure", "#dfe7ef");
    burst(ctx, x + 165, y);
    segment(ctx, x + 184, y, 92, "frication", "#f8eadc");
    segment(ctx, x + 276, y, 115, "aspiration", "#fff5d4");
    wave(ctx, x + 391, y, 260, "#215f73");
    arrow(ctx, x + 168, y + 78, x + 391, y + 78);
    label(ctx, "VOT", x + 280, y + 105, 16, "#8a4f16", "center");
  }

  function segment(ctx, x, y, width, text, fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y - 72, width, 144);
    ctx.strokeStyle = "#bcc7d2";
    ctx.strokeRect(x, y - 72, width, 144);
    label(ctx, text, x + width / 2, y + 96, 13, "#17212b", "center");
  }

  function burst(ctx, x, y) {
    ctx.strokeStyle = "#8a4f16";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y - 70);
    ctx.lineTo(x, y + 70);
    ctx.stroke();
    label(ctx, "burst", x + 12, y - 82, 13, "#8a4f16");
  }

  function wave(ctx, x, y, width, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (var i = 0; i < width; i++) {
      var yy = y + Math.sin(i / 8) * 40 * (1 - i / (width * 1.8));
      if (i === 0) ctx.moveTo(x + i, yy);
      else ctx.lineTo(x + i, yy);
    }
    ctx.stroke();
    label(ctx, "periodic vowel", x + width / 2, y + 96, 13, color, "center");
  }

  function drawAffricateCompare(ctx, w, h) {
    label(ctx, "Stop vs fricative vs affricate: identify the timing of silence and noise", 38, 34, 18, "#215f73");
    var rows = [
      { y: 110, name: "stop", parts: [[90, 120, "closure"], [210, 12, "burst"], [222, 45, "asp"], [267, 220, "vowel"]] },
      { y: 205, name: "fricative", parts: [[90, 255, "sustained frication"], [345, 220, "vowel"]] },
      { y: 300, name: "affricate", parts: [[90, 100, "closure"], [190, 12, "burst"], [202, 150, "extended frication"], [352, 210, "vowel"]] }
    ];
    rows.forEach(function (row) {
      label(ctx, row.name, 38, row.y + 5, 16, "#17212b");
      row.parts.forEach(function (p) {
        ctx.fillStyle = p[2].indexOf("frication") !== -1 ? "#f8eadc" : p[2] === "vowel" ? "#e9f2f5" : "#dfe7ef";
        ctx.fillRect(p[0], row.y - 28, p[1], 48);
        ctx.strokeStyle = "#bcc7d2";
        ctx.strokeRect(p[0], row.y - 28, p[1], 48);
        label(ctx, p[2], p[0] + p[1] / 2, row.y + 4, 12, "#17212b", "center");
      });
    });
  }

  function drawSemivowels(ctx, w, h) {
    label(ctx, "Semivowels: place cues live in formant transitions", 38, 34, 18, "#215f73");
    axis(ctx, 88, 72, 810, 230, "time", "frequency");
    var tracks = [
      { name: "/r/: low F3", color: "#8a4f16", pts: [[130, 145], [250, 182], [370, 130]] },
      { name: "/w/: low F2/F3", color: "#215f73", pts: [[130, 245], [250, 210], [370, 180]] },
      { name: "/j/: high F2/F3", color: "#2f6a3f", pts: [[560, 120], [680, 80], [820, 130]] },
      { name: "/l/: AR between F2/F3", color: "#596573", pts: [[560, 205], [690, 188], [820, 170]] }
    ];
    tracks.forEach(function (t, idx) {
      curve(ctx, t.pts, t.color, 4);
      label(ctx, t.name, idx < 2 ? 130 : 560, idx < 2 ? 322 + idx * 18 : 322 + (idx - 2) * 18, 13, t.color);
    });
  }

  function drawProsody(ctx, w, h) {
    label(ctx, "Stress: higher F0, greater intensity, longer duration, more distinctive vowels", 38, 34, 18, "#215f73");
    var syllables = [
      { x: 110, w: 120, stress: true, text: "stressed" },
      { x: 250, w: 72, stress: false, text: "unstressed" },
      { x: 340, w: 84, stress: false, text: "unstressed" },
      { x: 455, w: 128, stress: true, text: "stressed" },
      { x: 604, w: 74, stress: false, text: "unstressed" }
    ];
    syllables.forEach(function (s) {
      ctx.fillStyle = s.stress ? "#215f73" : "#cfd9e2";
      ctx.fillRect(s.x, 130, s.w, s.stress ? 92 : 52);
      label(ctx, s.text, s.x + s.w / 2, s.stress ? 250 : 228, 12, s.stress ? "#215f73" : "#596573", "center");
    });
    label(ctx, "stress-timed languages vary unstressed syllable duration", 490, 305, 15, "#8a4f16", "center");
  }

  function drawDisplays(ctx, w, h) {
    label(ctx, "Three representations of speech", 38, 34, 18, "#215f73");
    var panels = [
      { title: "Waveform", x: 66, xlab: "time", ylab: "amplitude" },
      { title: "Spectrum", x: 373, xlab: "frequency", ylab: "amplitude" },
      { title: "Spectrogram", x: 680, xlab: "time", ylab: "frequency" }
    ];
    panels.forEach(function (p, idx) {
      label(ctx, p.title, p.x + 110, 72, 18, "#17212b", "center");
      axis(ctx, p.x, 98, 230, 170, p.xlab, p.ylab);
      if (idx === 0) {
        ctx.strokeStyle = "#215f73";
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (var i = 0; i < 220; i++) {
          var yy = 185 + Math.sin(i / 8) * 45 * Math.sin(i / 38);
          if (i === 0) ctx.moveTo(p.x + i, yy);
          else ctx.lineTo(p.x + i, yy);
        }
        ctx.stroke();
      } else if (idx === 1) {
        drawOutputBars(ctx, p.x + 18, 238, 190, 80);
      } else {
        for (var tx = 0; tx < 210; tx += 18) {
          for (var fy = 0; fy < 130; fy += 16) {
            var alpha = Math.max(.05, Math.sin(tx / 24) * Math.sin(fy / 18));
            ctx.fillStyle = "rgba(33,95,115," + Math.abs(alpha) + ")";
            ctx.fillRect(p.x + 12 + tx, 120 + fy, 15, 12);
          }
        }
        label(ctx, "darkness = amplitude/intensity", p.x + 115, 292, 12, "#596573", "center");
      }
    });
  }

  function arrow(ctx, x1, y1, x2, y2) {
    ctx.strokeStyle = "#8a4f16";
    ctx.fillStyle = "#8a4f16";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    var angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 12 * Math.cos(angle - .45), y2 - 12 * Math.sin(angle - .45));
    ctx.lineTo(x2 - 12 * Math.cos(angle + .45), y2 - 12 * Math.sin(angle + .45));
    ctx.closePath();
    ctx.fill();
  }

  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      this.beginPath();
      this.moveTo(x + r, y);
      this.lineTo(x + w - r, y);
      this.quadraticCurveTo(x + w, y, x + w, y + r);
      this.lineTo(x + w, y + h - r);
      this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      this.lineTo(x + r, y + h);
      this.quadraticCurveTo(x, y + h, x, y + h - r);
      this.lineTo(x, y + r);
      this.quadraticCurveTo(x, y, x + r, y);
      this.closePath();
    };
  }

  if (page.type === "hub") renderHub();
  else renderQuiz();
})();
