<p align= center>
<img src="https://i.imgur.com/aFdBicc.jpg" width=400px>
<p>

# How Now Are You?

A fun app built using the Open Trivia DB API, where the user can answer questions on a variety of very 'current' topics.

Link can be found <a href="https://soniacweb.github.io/quiz/.">here </a>

# Technologies:
- JavaScript/ ES6
- HTML
- CSS/FLEXBOX
- AOS
- Sketch
- Open Trivia DB API

# Objectives:

- Save high scores in Local Storage

- Create a progress bar

- Create a spinning loader icon

- Dynamically generate HTML in JavaScript

- Fetch trivia questions from Open Trivia DB API

# Exploration of the following: 

- ES6 JavaScript features like arrow functions, the spread operator, const and let, and template literal string
- How to use the Fetch API to load trivia questions from an API
- How to store high scores in Local Storage
- How to use Flexbox, Animations, and REM units in CSS
- How to create a progress bar from scratch
- How to create a spinning loader icon from scratch

## Mockup using Sketch


## Initial Landing Page, Question Page

<p align=center>
<img src="https://i.imgur.com/O5Wme1K.png" width="500px;"/>
<img src="https://i.imgur.com/j5ppE17.png" width="500px;"/>
</p>

## Basic Structure for Each Quis

###### game.html

I first scafolded out what the game page would look like:

```
<div class="container">
  <div id="loader"></div>
<div id="game" class="justify-center flex-column hidden">
  <div id="hud">
    <div id="hud-item">
      <p id="progressText" class="hud-prefix">
Question
      </p>
      <div id="progressBar">
        <div id="progressBarFull">
        </div>
      </div>
    </div>

    <div id="hud-item">
      <p class="hud-prefix">
Score
      </p>
      <h1 class="hud-main-text" id="score">

      </h1>
    </div>

  </div>

  <h2 id="question"></h2>
     <div class="choice-container">
        <p class="choice-prefix">A</p>
        <p class="choice-text" data-number="1"></p>
        </div>

        <div class="choice-container">
          <p class="choice-prefix">B</p>
          <p class="choice-text" data-number="2"></p>
          </div>

          <div class="choice-container">
            <p class="choice-prefix">C</p>
            <p class="choice-text" data-number="3"></p>
          </div>

            <div class="choice-container">
              <p class="choice-prefix">D</p>
              <p class="choice-text" data-number="4"></p>
          </div>

          <a class="btn" href="../index.html">Return To Home</a>
    </div>
  </div>

  <script src="./game.js"></script>

  
</body>

```
To dynamically update the fields above- creating for example unique quesrions to ask the user, I used javascript by identifying ids and classes and manipulating them in the DOM.

Below is an excerpt of this: 

```
//refernces to dom objects
const question = document.getElementById('question')
const progressText = document.getElementById('progressText')
const scoreText = document.getElementById('score')
const progressBarFull = document.getElementById('progressBarFull')
const loader = document.getElementById('loader')
const game = document.getElementById('game')

const choices = Array.from(document.getElementsByClassName('choice-text'))
// console.log(choices)

//object
let currentQuestion = {}

//creating a delay after user answers
let acceptingAnswers = false

//score to start at zero
let score = 0

let questionCounter = 0

let availableQuestions = []

// initial empty array which is going to be a copy of our full question set from the api 
let questions = []

fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple').then(res => {
  console.log(res)
  return res.json()
}).then(loadedQuestions => {
  console.log(loadedQuestions.results)
  questions = loadedQuestions.results.map( loadedQuestion => {
    const formattedQuestion = { 
      question: loadedQuestion.question
    }
    // iterates through each of the answer choices and puts the answers 1-4 via formatted question
    const answerChoices = [...loadedQuestion.incorrect_answers]
    formattedQuestion.answer = Math.floor(Math.random() * 3) + 1
    answerChoices.splice(
      formattedQuestion.answer - 1,
      0,
      loadedQuestion.correct_answer
    )
    answerChoices.forEach((choice, index) => {
      formattedQuestion['choice' + (index + 1)] = choice
    })
    return formattedQuestion
  })
  startGame()
})
  .catch( err =>{
    console.error(err)
  })

//CONSTANTS
const CORRECT_BONUS = 10
const MAX_QUESTIONS = 10 

startGame = () => {
  questionCounter = 0
  score = 0
  availableQuestions = [...questions]
  console.log(availableQuestions) 
  getNewQuestion()
  game.classList.remove('hidden')
  loader.classList.add('hidden')
}

getNewQuestion = () =>{

  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem('mostRecentScore', score)
    //go to the end page 
    return window.location.assign('../end.html')
  }
  questionCounter++
  progressText.innerHTML = `Question ${questionCounter}/${MAX_QUESTIONS}`
  //everytime we increment our question, we want to update the progress bar, I accessed CSS through DOM manipulation
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`

  const questionIndex = Math.floor(Math.random() * availableQuestions.length)
  currentQuestion = availableQuestions[questionIndex]
  question.innerHTML = currentQuestion.question
  
  choices.forEach(choice => {
    const number = choice.dataset['number']
    choice.innerHTML = currentQuestion['choice' + number]
  })

  availableQuestions.splice(questionIndex, 1)
  console.log(availableQuestions)
  acceptingAnswers = true 
} 


choices.forEach(choice => {
  choice.addEventListener('click', e => {
    // console.log(e.target)
    if (!acceptingAnswers) return

    acceptingAnswers = false
    const selectedChoice = e.target
    const selectedAnswer = selectedChoice.dataset['number']
    // console.log(selectedAnswer)

    const classToApply = 
     selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

    if (classToApply === 'correct') {
      incrementScore(CORRECT_BONUS)
    }

    // console.log(classToApply)

    selectedChoice.parentElement.classList.add(classToApply)
    
    setTimeout( () => {
      selectedChoice.parentElement.classList.remove(classToApply)
      getNewQuestion()
    }, 1000)
  })
})

incrementScore = num => {
  score += num
  scoreText.innerText = score
}


```


## High Scores and Local Storage 

```
// I wanted to get the highscores out of local storage and displaying on the highscores page

const highScoresList = document.getElementById('highScoresList')
const highScores = JSON.parse(localStorage.getItem('highScores')) || []

console.log(highScores)

//iterate through each score - I want to add an li for each score
//map - taking an array of items and creating it into something else- returning outputted strings 

highScoresList.innerHTML = 
highScores.map( score => {
  return `<li class="high-score">${score.name} - ${score.score}`
}).join('')

```

## Key Learnings and Wins

- Adding levels, high scores to local storage, and adding progress bar.

## Future Features

Making the app mobile friendly and refactoring this in React.
