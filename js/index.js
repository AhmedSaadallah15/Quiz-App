categoryMenu = document.getElementById("categoryMenu");
difficultyOptions = document.getElementById("difficultyOptions");
questionsNumber = document.getElementById("questionsNumber");
startQuiz = document.getElementById("startQuiz");
let form = document.getElementById("quizOptions");
let myAllQuestions;
let quiz;
startQuiz.addEventListener("click", async function () {
  let category = categoryMenu.value;
  let difficulty = difficultyOptions.value;
  let questionNumber = questionsNumber.value;

  quiz = new Quiz(category, difficulty, questionNumber);
  myAllQuestions = await quiz.getAllQuestions();
  // console.log(myAllQuestions);
  let myQuestion = new Question(0);
  // console.log(myQuestion);
  myQuestion.display();
  form.classList.replace("d-block", "d-none");
});

class Quiz {
  constructor(category, difficulty, questionNumber) {
    this.category = category;
    this.difficulty = difficulty;
    this.num_qu = questionNumber;
    this.score = 0;
  }

  getApi() {
    return ` https://opentdb.com/api.php?amount=${this.num_qu}&category=${this.category}&difficulty=${this.difficulty}`;
  }

  async getAllQuestions() {
    let data = await fetch(this.getApi());
    let res = await data.json();
    let result = res.results;
    return result;
  }

  displayScore() {
    let cartona = `
        <h2 class="mb-0">${
          this.score == myAllQuestions.length
            ? "Congratulations 🤩🥳 "
            : "Opss 😞 "
        }your score is ${this.score} of ${myAllQuestions.length}
    </h2>
    <button class="again btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
        
        `;
    document.getElementById("finish").innerHTML = cartona;

    document.getElementById("myData").classList.replace("d-block", "d-none");
    document.getElementById("finish").classList.replace("d-none", "d-block");
  }
}

class Question {
  constructor(index) {
    this.index = index;
    this.category = myAllQuestions[index].category;
    this.difficulty = myAllQuestions[index].difficulty;
    this.question = myAllQuestions[index].question;
    this.correct_answer = myAllQuestions[index].correct_answer;
    this.incorrect_answers = myAllQuestions[index].incorrect_answers;
    this.allAnswers = this.getAllAnswers();
    this.checked = false;
  }
  getAllAnswers() {
    let arr = [...this.incorrect_answers, this.correct_answer];
    arr.sort();
    return arr;
  }

  display() {
    let cartona = `
                <div class="w-100 d-flex justify-content-between">
                <span class=" h5 btn-category ">${this.category}</span>
                <span class=" h5 btn-questions "> ${this.index + 1} of ${
      myAllQuestions.length
    }</span>
                </div>
                <h2 class="text-capitalize h4 text-center">${
                  this.question
                }</h2>  
                <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
                ${this.allAnswers
                  .map((ele) => {
                    return `<li>${ele}</li>`;
                  })
                  .join("")}
                </ul>
                <h2 class="text-capitalize text-center score-color w-100 fw-bold "><i class="bi bi-emoji-laughing"></i> Score : ${
                  quiz.score
                }</h2> 
                `;
    document.getElementById("myData").classList.replace("d-none", "d-block");
    document.getElementById("myData").innerHTML = cartona;
    let choices = document.querySelectorAll(".choices li");
    choices.forEach((ele) => {
      ele.addEventListener("click", () => {
        this.checkAnswer(ele);
      });
    });
  }

  checkAnswer(li) {
    if (!this.checked) {
      this.checked = true;
      if (li.innerHTML == this.correct_answer) {
        li.classList.add("correct");
        quiz.score++;
      } else {
        li.classList.add("wrong");
      }
    }
    this.nextQuestion();
  }

  nextQuestion() {
    this.index++;
    if (this.index < myAllQuestions.length) {
      setTimeout(() => {
        let nextQuestion = new Question(this.index);
        nextQuestion.display();
      }, 1500);
    } else {
      quiz.displayScore();
      document.querySelector(".again").addEventListener("click", function () {
        window.location.reload();
      });
    }
  }
}
