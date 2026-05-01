(function () {
  "use strict";

  var page = window.LANG_DIS_PAGE;
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
        if (!q.points) q.points = q.type === "mc" ? 2 : 1;
        if ((q.type === "tf" || q.type === "match") && !q.options && q.type === "tf") q.options = ["True", "False"];
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
      '    <p class="kicker">' + escapeHTML(page.course || "COMD 4382") + '</p>',
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
      '  <div class="hub-grid" aria-label="Available Language Disorders final quizzes">',
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
    window.__LANG_DIS_QS = {};

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
        page.examHeader.trapNote ? '  <p class="trap-note"><strong>Professor Trap Mode:</strong> ' + escapeHTML(page.examHeader.trapNote) + '</p>' : '',
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
    var typeLabel = q.type === "multi" ? "Find All" : q.type === "match" ? "Match" : q.type === "tf" ? "T/F" : "MC";
    var prompt = [
      '<p class="q-prompt">' + escapeHTML(q.prompt) + ' <span class="pill paper">' + q.points + ' pt' + (q.points === 1 ? "" : "s") + '</span></p>',
      q.subprompt ? '<p class="q-subprompt">' + escapeHTML(q.subprompt) + '</p>' : ''
    ].join("");

    var response = "";
    if (q.type === "mc" || q.type === "tf" || q.type === "match") {
      response = '<div class="option-list">' + q.options.map(function (option, index) {
        return '<button type="button" class="choice-btn" data-action="choose" data-qid="' + id + '" data-index="' + index + '">' + escapeHTML(option) + '</button>';
      }).join("") + '</div>';
    } else if (q.type === "multi") {
      response = '<div class="option-list">' + q.options.map(function (option, index) {
        return '<label class="multi-row" data-index="' + index + '"><input type="checkbox" data-qid="' + id + '" data-index="' + index + '"> <span>' + escapeHTML(option) + '</span></label>';
      }).join("") + '</div><button type="button" class="check-btn" data-action="check-multi" data-qid="' + id + '">Check Answer</button>';
    }

    window.__LANG_DIS_QS[id] = q;

    return [
      '<article class="question-card" id="' + id + '">',
      '  <div class="question-top">',
      '    <span class="q-num">Question ' + number + ' - ' + typeLabel + '</span>',
      '    <span class="q-topic">' + escapeHTML(q.topic || "") + '</span>',
      '  </div>',
      '  <div class="q-body">',
      prompt,
      response,
      '    <div class="feedback" data-feedback="' + id + '"></div>',
      modelHTML(q),
      '  </div>',
      '</article>'
    ].join("");
  }

  function modelHTML(q) {
    if (!q.explanation) return "";
    return '<div class="model">' + escapeHTML(q.explanation) + '</div>';
  }

  function attachEvents() {
    document.addEventListener("click", function (event) {
      var target = event.target.closest("[data-action]");
      if (!target) return;
      var action = target.getAttribute("data-action");
      if (action === "choose") choose(target);
      if (action === "check-multi") checkMulti(target);
      if (action === "reveal-all") revealAll();
      if (action === "reset") window.location.reload();
      if (action === "print") window.print();
    });
  }

  function choose(button) {
    var qid = button.getAttribute("data-qid");
    if (state.graded[qid]) return;
    var q = window.__LANG_DIS_QS[qid];
    var selected = Number(button.getAttribute("data-index"));
    var correct = selected === q.answer;
    var card = document.getElementById(qid);
    card.querySelectorAll(".choice-btn").forEach(function (btn) {
      var index = Number(btn.getAttribute("data-index"));
      btn.disabled = true;
      if (index === q.answer) btn.classList.add("correct");
      if (index === selected && index !== q.answer) btn.classList.add("wrong");
    });
    mark(qid, correct ? q.points : 0);
    showFeedback(qid, correct, q.explanation);
  }

  function checkMulti(button) {
    var qid = button.getAttribute("data-qid");
    if (state.graded[qid]) return;
    var q = window.__LANG_DIS_QS[qid];
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
    mark(qid, correct ? q.points : 0);
    showFeedback(qid, correct, q.explanation);
  }

  function mark(qid, points) {
    state.graded[qid] = true;
    state.earned += points;
    state.answered += 1;
    updateScore();
  }

  function showFeedback(qid, correct, text) {
    var feedback = document.querySelector('[data-feedback="' + qid + '"]');
    if (!feedback) return;
    feedback.className = "feedback show " + (correct ? "good" : "bad");
    feedback.innerHTML = '<strong>' + (correct ? "Correct." : "Review this.") + '</strong> ' + escapeHTML(text || "");
    var model = document.getElementById(qid).querySelector(".model");
    if (model) model.classList.add("show");
  }

  function revealAll() {
    Object.keys(window.__LANG_DIS_QS || {}).forEach(function (qid) {
      var q = window.__LANG_DIS_QS[qid];
      var card = document.getElementById(qid);
      if (!card) return;
      var model = card.querySelector(".model");
      if (model) model.classList.add("show");
      if (q.type === "mc" || q.type === "tf" || q.type === "match") {
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

  if (page.type === "hub") renderHub();
  else renderQuiz();
})();
