// TODO:
/* 
-> ZurückButton
-> HomeButton

- Darstellung der MatheAufgaben soll durch Katex erfolgen
- Reihenfolge der Aufgaben soll auch zufällig sein
- Statistik am Ende jedes Durchlaufs
- Responsive Design mittels mediaquerys
 */

// Initializig Functionality
window.addEventListener("load", start, false);

// Global variables
const url = "https://irene.informatik.htw-dresden.de:8888/api/quizzes/";
const username = "newtest@email.com";
const password = "secret";
var prevPage = "";
let topic;
let statsOffline = {};

/* Start
startet die Funktionalität
*/
function start() {
  const main = document.getElementById("main");
  loadStartPage(main);
}

/* StartSeite
Hier kann man zwischen dem Offline und Online Modus wählen kann.
*/
function loadStartPage(div) {
  // prevPage = "loadStartPage";
  let options = ["Offline", "Online"];
  const inner = document.createElement("div");
  inner.setAttribute("id", "options");
  createButtonsFromArray(options, inner, loadTopicPage);
  div.appendChild(inner);
}
/* TopicPage
Hier werden die verschiedenen Themen der gewählten Option angezeigt
*/
function loadTopicPage(event) {
  // prevPage = "loadStartPage";
  clearMain();
  const targetElement = event.target || event.srcElement;
  switch (targetElement.name) {
    case "Offline":
      const topics = Object.keys(sourceData);
      createButtonsFromArray(topics, main, prepOfflineQuestions);
      break;
    case "Online":
      break;
  }
}

function prepOfflineQuestions(event) {
  // prevPage = "loadTopicPage(Offline)"; //Muss noch angepasst werden (event)
  clearMain();
  try {
    const targetElement = event.target || event.srcElement;
    topic = targetElement.name;
  } catch (error) {
    console.log("Funktion wurde ohne Event ausgelöst.")
    console.log(error)
  }
  loadOfflineQuestions(topic, 0);
}

function loadOfflineQuestions(topic, position){
  clearMain();
  const data = sourceData[topic];

  if(position > data.length - 1){
    console.log("Kategorie abgeschlossen");
    loadStats();
    return;
  }

  // Aufgabenstellung erstellen
  const quest = document.createElement("div");
  quest.setAttribute("id", "question");
  quest.setAttribute("system_identifier", position);
  quest.setAttribute("name", data[position].a);
  quest.innerHTML = data[position].a;
  main.appendChild(quest);

  // Mögliche Lösungen erstellen
  const solution = document.createElement("div");
  solution.setAttribute("class", "solution");

  const mixedSolutions = randomizeArray(data[position].l);
  createButtonsFromArray(mixedSolutions, solution, submitOfflineAnswer);
  main.appendChild(solution);

  // console.log(Object.keys(statsOffline));
  // console.log(Object.keys(statsOffline).indexOf(topic))
  if(Object.keys(statsOffline).indexOf(topic) == -1){ //Key noch nicht vorhanden
    // console.log("Key noch nicht vorhanden");
    statsOffline[topic] = {"Richtig": 0, "Falsch":0};
    // console.log(statsOffline);
  }
}

function loadStats(){
  clearMain();
  const statsDiv = document.createElement("div");
  statsDiv.setAttribute("class", "stats");

  const keys = Object.keys(statsOffline);
  for(let i in keys){
    let topic = document.createElement("p");
    topic.setAttribute("class", "topic");
    topic.innerHTML = keys[i];

    const ul = document.createElement("ul");
    const subKeys = Object.keys(statsOffline[keys[i]]);
    for(let j in subKeys){
      const li = document.createElement("li");
      li.innerHTML = subKeys[j] + ": " + statsOffline[keys[i]][subKeys[j]];
      // console.log(subKeys[j]);
      // console.log(statsOffline[keys[i]][subKeys[j]]);
      ul.appendChild(li);
    }
    statsDiv.appendChild(topic);
    statsDiv.appendChild(ul);
  }

  main.appendChild(statsDiv);
}

// Prüfen, ob die gewählte Antwort richtig war
function submitOfflineAnswer(event) {
  const targetElement = event.target || event.srcElement;
  const buttonName = targetElement.name;
  const question = document.getElementById("question");
  const questionName = question.getAttribute("name");
  const questionId = question.getAttribute("system_identifier");
  
  // const sourceQuestion = sourceData[topic].findIndex(element => element["a"] = questionName);
  const index = 0; //sourceData[topic][sourceQuestion]["l"].indexOf(buttonName);
  
  if(index == 0){
    // Bei richtiger Antwort
    userFeedback(true, parseInt(questionId)+1, sourceData[topic].length);
    statsOffline[topic]["Richtig"] = statsOffline[topic]["Richtig"] + 1;
    // console.log(statsOffline);
  }else{
    // bei falscher Antwort
    userFeedback(false, parseInt(questionId)+1, sourceData[topic].length);
    statsOffline[topic]["Richtig"] = statsOffline[topic]["Falsch"] + 1;
  }
  setTimeout(loadOfflineQuestions,500,topic, parseInt(questionId)+1);
}

// Gibt ein visuelles Feedback, ob die Frage richtig oder falsch beantwortet wurde.
function userFeedback(state, current, total){
  let color, text;
  if(state){
    color = "green";
    text= "Korrekt";
  }else{
    color = "red";
    text = "Falsch";
  }

  const userFeedback = document.createElement("div");
  userFeedback.setAttribute("id", "userFeedback");
  userFeedback.innerHTML = text;
  userFeedback.style.setProperty('background-color', color);
  main.appendChild(userFeedback);

  const progressbar = document.getElementById("bar");
  progressbar.style.setProperty('width', current/total*100 + '%')
}

/* 
Support Functions
 */

// Used for switching Elements in random order
function randomizeArray([...array]) {
  // dadurch wird sichergestellt, dass der originale Array nicht verändert wird.
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

// Function to clear the main Div
function clearMain() {
  document.getElementById("main").innerHTML = "";
}
/* Creates Buttons in specified div with EventListener on each button */
function createButtonsFromArray(input, where, listenerFunction) {
  for (let i in input) {
    let el = document.createElement("button");
    el.setAttribute("name", input[i]);
    el.setAttribute("system_identifier", i);
    el.setAttribute("type", i);
    el.innerHTML = input[i];
    el.addEventListener("click", listenerFunction, false);
    where.appendChild(el);
  }
}

// Lösung des Array Problems, alle Aufgaben inkl. Lösungen in ein Stringarry davon dann die Reihenfolge tauschen und dann wie gewohnt weitermachen
