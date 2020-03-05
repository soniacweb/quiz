const username = document.getElementById('username')
const saveScoreBtn = document.getElementById('saveScoreBtn')
const mostRecentScore = localStorage.getItem('mostRecentScore')
const finalScore = document.getElementById('finalScore')

//json stringify converts array into a string for localstorage
//, JSON.stringify([])
const highScores = JSON.parse(localStorage.getItem('highScores')) || []

console.log(highScores)

const MAX_HIGH_SCORES = 5

//json parse converts back into an array
// console.log(JSON.parse(localStorage.getItem('highScores')))

finalScore.innerText = mostRecentScore

username.addEventListener('keyup', () => {
  console.log(username.value)
  saveScoreBtn.disabled = !username.value
})

saveHighScore = (e) => {
  console.log('clicked save button')
  e.preventDefault()

  const score = {
    score: Math.floor(Math.random() * 100),
    name: username.value
  }
  //add the score
  highScores.push(score)
  //sorting out the highscores- highest to lowest
  highScores.sort( (a,b) => b.score - a.score)
  //remove any scores after thr 5th highest
  highScores.splice(5)
  console.log(highScores)

  //updating the local storage 
  localStorage.setItem('highScores', JSON.stringify(highScores))
  window.location.assign('./index.html')
}

