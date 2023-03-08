let questions;
let currentQuestionIndex = 0;
let score = 0;

const startScreen = document.querySelector(".container-start");
const questionScreen = document.querySelector(".container-question");
const scoreScreen = document.querySelector(".container-score");
const loadingScreen = document.querySelector("#loading");

const questionText = document.querySelector(".question-text");
const questionOptions = document.querySelector(".question-options");
const scoreText = document.querySelector(".score");
const questionsDone = document.querySelector(".questions-done");
const progressDone = document.querySelector(".progress");
const timerProgress = document.querySelector(".timer");
const errorDialog = document.querySelector(".error");

hideScreen(questionScreen)
hideScreen(scoreScreen)

function onStartClicked() {
    hideScreen(startScreen)
    showScreen(loadingScreen);

    // fetching API 
    fetchQuestionsFromAPI()
}

async function fetchQuestionsFromAPI() {
    // const response = await fetch("https://opentdb.com/api.php?amount=10")
    // let questionsJson = await response.json()

    // questions = questionsJson.results

    try {
        const response = await axios.get("https://opentdb.com/api.php?amount=10")

        const questionsJson = await response.data;
        questions = questionsJson.results;

        hideScreen(loadingScreen);
        showScreen(questionScreen);
        renderQuestion();
    } catch (error) {
        // console.log(error);
        errorDialog.innerHTML = `${error.message}`;
        showScreen(errorDialog);
        setTimeout(() => {
            hideScreen(errorDialog);
        }, 2000);

        hideScreen(loadingScreen);
        showScreen(startScreen);
    }
}

function hideScreen(screen) {
    screen.classList.add("hide");
}

function showScreen(screen) {
    screen.classList.remove("hide");
}

let time = 10;
let interval;
function renderQuestion() {
    // timer
    resetTimer();
    timerProgress.innerHTML = `${time}s`
    interval = setInterval(startTimer, 1000);

    // question no ui
    questionsDone.innerHTML = `${currentQuestionIndex + 1} of ${questions.length} Question`
    // progess ui
    const progressWidth = 100 / questions.length * (currentQuestionIndex + 1);
    progressDone.style.width = `${progressWidth}%`;

    questionText.innerHTML = questions[currentQuestionIndex].question;

    let allOptions = new Array(...questions[currentQuestionIndex].incorrect_answers);
    allOptions.push(questions[currentQuestionIndex].correct_answer);
    allOptions = shuffleOptions(allOptions);

    let options = ""
    for (let option of allOptions) {
        options += `<button class="btn-option" value="${option}" onclick="onOptionClicked('${option}')">${option}</button>`
    }
    questionOptions.innerHTML = options
}

function startTimer() {
    time--;

    if (time == 0) {
        resetTimer();
        onNextClicked();
        return;
    }

    timerProgress.innerHTML = `${time}s`
}

function resetTimer() {
    clearInterval(interval);
    time = 10;
}

function shuffleOptions(allOptions) {
    return allOptions
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
}

function onOptionClicked(selectedOption) {
    // score
    if (selectedOption === questions[currentQuestionIndex].correct_answer) {
        score++;
    }

    for (let btn of questionOptions.children) {
        btn.setAttribute("disabled", "true");

        // ui
        if (btn.value === questions[currentQuestionIndex].correct_answer) {
            btn.classList.add("btn-option-correct")
        }

        if (btn.value == selectedOption && selectedOption != questions[currentQuestionIndex].correct_answer) {
            btn.classList.add("btn-option-incorrect")
        }
    }
}

function onNextClicked() {
    if (currentQuestionIndex == questions.length - 1) {
        hideScreen(questionScreen);
        showScreen(scoreScreen);
        scoreText.innerHTML = `<h3>Your Score is : ${score} / ${questions.length}</h3>`;
        return;
    }

    currentQuestionIndex++;
    renderQuestion()
}

function onRestartClicked() {
    currentQuestionIndex = 0;
    score = 0;

    hideScreen(scoreScreen);
    showScreen(startScreen);
}