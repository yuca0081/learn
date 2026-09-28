/* quiz.js — 可复用的检索练习（quiz）组件，依赖 assets/course.css 中的样式
   用法：
     <div id="quiz"></div>
     <script src="../assets/quiz.js"></script>
     <script>
       renderQuiz("#quiz", [
         { q: "题干（HTML）", options: ["选项A（HTML）", "选项B"], answer: 1, explain: "解析（HTML）" },
         ...
       ]);
     </script>
   answer 为正确选项下标（从 0 开始）。作答即时反馈，全部答完显示得分，可重做。 */
(function () {
  "use strict";
  var LETTERS = ["A", "B", "C", "D", "E", "F"];

  window.renderQuiz = function (mount, questions) {
    var root = typeof mount === "string" ? document.querySelector(mount) : mount;
    if (!root) return;
    var scoreEl = null, score = 0, answered = 0;

    function updateScore() {
      scoreEl.textContent = "得分 " + score + " / " + questions.length +
        (answered < questions.length
          ? "（已作答 " + answered + " 题）"
          : " —— 完成！答错的回看解析，然后重做一遍巩固记忆");
    }

    function buildQuestion(item, qi) {
      var card = document.createElement("div");
      card.className = "quiz-q";

      var no = document.createElement("div");
      no.className = "q-no";
      no.textContent = "Q" + (qi + 1);
      card.appendChild(no);

      var text = document.createElement("div");
      text.className = "q-text";
      text.innerHTML = item.q;
      card.appendChild(text);

      var buttons = [];
      item.options.forEach(function (optHtml, oi) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "opt";
        var letter = document.createElement("span");
        letter.className = "opt-letter";
        letter.textContent = LETTERS[oi] + ".";
        var body = document.createElement("span");
        body.innerHTML = optHtml;
        btn.appendChild(letter);
        btn.appendChild(body);
        btn.addEventListener("click", function () {
          if (card.classList.contains("done")) return;
          card.classList.add("done");
          answered += 1;
          if (oi === item.answer) score += 1;
          buttons[oi].classList.add(oi === item.answer ? "correct" : "wrong");
          buttons[item.answer].classList.add("correct");
          buttons.forEach(function (b) { b.disabled = true; });
          var ex = document.createElement("div");
          ex.className = "quiz-explain";
          ex.innerHTML = item.explain;
          card.appendChild(ex);
          updateScore();
        });
        buttons.push(btn);
        card.appendChild(btn);
      });

      root.appendChild(card);
    }

    function render() {
      score = 0;
      answered = 0;
      root.innerHTML = "";
      questions.forEach(buildQuestion);
      var footer = document.createElement("div");
      footer.className = "quiz-footer";
      scoreEl = document.createElement("div");
      scoreEl.className = "quiz-score";
      var redo = document.createElement("button");
      redo.type = "button";
      redo.className = "quiz-redo";
      redo.textContent = "重做本测验";
      redo.addEventListener("click", render);
      footer.appendChild(scoreEl);
      footer.appendChild(redo);
      root.appendChild(footer);
      updateScore();
    }

    render();
  };
})();
