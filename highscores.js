// I want to get the highscores out of local storage and displaying on the highscores page

const highScoresList = document.getElementById('highScoresList')
const highScores = JSON.parse(localStorage.getItem('highScores')) || []

console.log(highScores)

//iterate through each score - i want to add an li for each score
//map - taking an array of items nd creating it into something else- returning outputted strings 

highScoresList.innerHTML = 
highScores.map( score => {
  return `<li class="high-score">${score.name} - ${score.score}`
}).join('')