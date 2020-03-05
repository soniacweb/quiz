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

//basically going to be a copy of our full question set from the api 
let questions = []

fetch('https://opentdb.com/api.php?amount=10&category=26&difficulty=hard&type=multiple').then(res => {
  console.log(res)
  
  return res.json()
}).then(loadedQuestions => {
  console.log(loadedQuestions.results)
  questions = loadedQuestions.results.map( loadedQuestion => {
    const formattedQuestion = { 
      question: loadedQuestion.question
    }
    // iterate through each of the answer choices and put them answers 1-4 via formatted question
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
  //everytime we increment our question, we want to update the progress bar
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



