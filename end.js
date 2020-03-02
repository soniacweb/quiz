const username = document.getElementById('username')
const saveScoreBtn = document.getElementById('saveScoreBtn')
const mostRecentSore = localStorage.getItem('mostRecentScore')
const finalScore = document.getElementById('finalScore')

finalScore.innerText = mostRecentSore


username.addEventListener('keyup', () => {
  console.log(username.value)
  saveScoreBtn.disabled = !username.value
})

saveHighScore = (e) => {
  console.log('clicked save button')
  e.preventDefault()
}

