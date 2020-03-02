
const question = document.getElementById('question')
const progressText = document.getElementById('progressText')
const scoreText = document.getElementById('score')
const progressBarFull = document.getElementById('progressBarFull')

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

//basically going to be a copy of our full question set from the api 
const questions = [
  {
    question: 'Inside which HTML element do we put the JavaScript??',
    choice1: '<script>',
    choice2: '<javascript>',
    choice3: '<js>',
    choice4: '<scripting>',
    answer: 1
  },
  {
    question:
      'What is the correct syntax for referring to an external script called \'xxx.js\'?',
    choice1: '<script href=\'xxx.js\'>',
    choice2: '<script name=\'xxx.js\'>',
    choice3: '<script src=\'xxx.js\'>',
    choice4: '<script file=\'xxx.js\'>',
    answer: 3
  },
  {
    question: ' How do you write \'Hello World\' in an alert box?',
    choice1: 'msgBox(\'Hello World\');',
    choice2: 'alertBox(\'Hello World\');',
    choice3: 'msg(\'Hello World\');',
    choice4: 'alert(\'Hello World\');',
    answer: 4
  }
] 

//CONSTANTS
const CORRECT_BONUS = 10
const MAX_QUESTIONS = 3 

startGame = () => {
  questionCounter = 0
  score = 0
  availableQuestions = [...questions]
  console.log(availableQuestions) 
  getNewQuestion()
}

getNewQuestion = () =>{

  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem('mostRecentScore', score)
    //go to the end page
    return window.location.assign('/end.html')
  }
  questionCounter++
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`
  //everytime we increment our question, we want to update the progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`

  const questionIndex = Math.floor(Math.random() * availableQuestions.length)
  currentQuestion = availableQuestions[questionIndex]
  question.innerText = currentQuestion.question
  
  choices.forEach(choice => {
    const number = choice.dataset['number']
    choice.innerText = currentQuestion['choice' + number]
  })

  availableQuestions.splice(questionIndex, 1)
  console.log(availableQuestions)
  acceptingAnswers = true 
} 


choices.forEach(choice => {
  choice.addEventListener('click', e => {
    // console.log(e.target)
    if (!acceptingAnswers) return;

    acceptingAnswers = false
    const selectedChoice = e.target
    const selectedAnswer = selectedChoice.dataset['number']
    // console.log(selectedAnswer)

    const classToApply = 
     selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

    if(classToApply === 'correct') {
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
  score +=num
  scoreText.innerText = score
}

startGame()

