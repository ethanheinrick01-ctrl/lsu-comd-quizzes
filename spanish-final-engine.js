(function () {
  const letters = ["a", "b", "c", "d"];

  function getQuizId() {
    const params = new URLSearchParams(window.location.search);
    return document.body.dataset.quizId || params.get("quiz") || "";
  }

  function optionMarkup(question, questionIndex) {
    return question.options.map((option, optionIndex) => `
      <label class="option" data-option="${optionIndex}">
        <input type="radio" name="q${questionIndex}" value="${optionIndex}">
        <span class="option-letter">${letters[optionIndex]}.</span>
        <span class="option-answer">${option}</span>
      </label>
    `).join("");
  }

  function renderQuiz(quiz) {
    document.title = `${quiz.title} | SPAN 2102`;
    document.getElementById("quizTitle").textContent = quiz.title;
    document.getElementById("quizSubtitle").textContent = quiz.subtitle;
    document.getElementById("quizCount").textContent = quiz.questions.length;
    document.getElementById("quizMeta").innerHTML = `
      <span class="pill">${quiz.kind}</span>
      <span class="pill green">${quiz.questions.length} questions</span>
      <span class="pill purple">all multiple choice</span>
    `;

    const panel = document.getElementById("quizPanel");
    panel.innerHTML = quiz.questions.map((question, questionIndex) => {
      const tags = [
        question.anchor ? '<span class="pill red">anchor</span>' : "",
        question.nosotros ? '<span class="pill purple">nosotros</span>' : "",
        question.trap ? '<span class="pill">trap</span>' : ""
      ].join("");

      return `
        <section class="question" data-section="${question.section}">
          <div class="q-head">
            <div class="q-num">${questionIndex + 1}</div>
            <div class="q-title">
              <p class="q-section">${question.section}${tags ? ` ${tags}` : ""}</p>
              <p class="q-prompt">${question.prompt}</p>
            </div>
          </div>
          <div class="q-body">
            <div class="options">${optionMarkup(question, questionIndex)}</div>
            <div class="feedback" id="fb${questionIndex}"></div>
          </div>
        </section>
      `;
    }).join("");

    document.getElementById("answeredCount").textContent = "0";
    document.getElementById("totalCount").textContent = quiz.questions.length;
    document.getElementById("progressBar").style.width = "0%";

    panel.addEventListener("change", updateProgress);
    document.getElementById("submitBtn").addEventListener("click", () => submitQuiz(quiz));
    document.getElementById("resetBtn").addEventListener("click", () => resetQuiz(quiz));
  }

  function updateProgress() {
    const total = document.querySelectorAll(".question").length;
    const answered = new Set([...document.querySelectorAll("input[type='radio']:checked")].map(input => input.name)).size;
    document.getElementById("answeredCount").textContent = answered;
    document.getElementById("progressBar").style.width = `${Math.round((answered / total) * 100)}%`;
  }

  function submitQuiz(quiz) {
    let correct = 0;
    const sectionStats = new Map();

    quiz.questions.forEach((question, questionIndex) => {
      const selected = document.querySelector(`input[name="q${questionIndex}"]:checked`);
      const selectedValue = selected ? Number(selected.value) : -1;
      const isCorrect = selectedValue === question.answer;
      const stat = sectionStats.get(question.section) || { correct: 0, total: 0 };
      stat.total += 1;
      if (isCorrect) {
        correct += 1;
        stat.correct += 1;
      }
      sectionStats.set(question.section, stat);

      document.querySelectorAll(`input[name="q${questionIndex}"]`).forEach(input => {
        input.disabled = true;
        const option = input.closest(".option");
        option.classList.remove("correct", "wrong");
        if (Number(input.value) === question.answer) option.classList.add("correct");
        if (selected && input === selected && !isCorrect) option.classList.add("wrong");
      });

      const feedback = document.getElementById(`fb${questionIndex}`);
      const answerText = question.options[question.answer];
      feedback.innerHTML = isCorrect
        ? `<strong>Correct.</strong> ${question.explain || ""}`
        : `<strong>Correct answer:</strong> ${answerText}. ${question.explain || ""}`;
      feedback.classList.add("show");
    });

    const scorePanel = document.getElementById("scorePanel");
    const pct = Math.round((correct / quiz.questions.length) * 100);
    document.getElementById("scoreNumber").textContent = `${correct}/${quiz.questions.length}`;
    document.getElementById("scoreSub").textContent = `${pct}%`;
    document.getElementById("scoreBreakdown").innerHTML = [...sectionStats.entries()].map(([section, stat]) => `
      <tr><td>${section}</td><td>${stat.correct}/${stat.total}</td></tr>
    `).join("");
    scorePanel.classList.add("show");
    scorePanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetQuiz() {
    document.querySelectorAll("input[type='radio']").forEach(input => {
      input.checked = false;
      input.disabled = false;
    });
    document.querySelectorAll(".option").forEach(option => option.classList.remove("correct", "wrong"));
    document.querySelectorAll(".feedback").forEach(feedback => {
      feedback.classList.remove("show");
      feedback.textContent = "";
    });
    document.getElementById("scorePanel").classList.remove("show");
    updateProgress();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function boot() {
    const quizId = getQuizId();
    const quiz = window.SPANISH_FINAL_QUIZZES && window.SPANISH_FINAL_QUIZZES[quizId];
    if (!quiz) {
      document.getElementById("quizTitle").textContent = "Quiz not found";
      document.getElementById("quizSubtitle").textContent = "Return to the Spanish final hub and choose a quiz.";
      return;
    }
    renderQuiz(quiz);
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
