// TODO:
/* 
-> ZurückButton
-> HomeButton

durch Abfrage prüfen, welche Themen es gibt. (Anzeige auf den entsprechenden Buttons)
Diese sollten dann angezeigt werden. (Indizes zu den jeweiligen Aufgaben in seperatem Array abspeichern damit darauf dann später die Aufgaben angezeigt werden können.)
 */

// Initializig Functionality
window.addEventListener("load", start, false);

// Global variables
const url = "https://irene.informatik.htw-dresden.de:8888/api/quizzes/";
const username = "newtest@email.com";
const password = "secret";
var prevPage = "";
var wait = true;

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
      createButtonsFromArray(topics, main, loadOfflineQuestions);
      break;
    case "Online":
      break;
  }
}

function loadOfflineQuestions(event, position = 0, questSet) {
  // prevPage = "loadTopicPage(Offline)"; //Muss noch angepasst werden (event)
  clearMain();
  const targetElement = event.target || event.srcElement;
  const key = targetElement.name;
  // console.log(sourceData[key]);
  const data = sourceData[key];
    // console.log(data[i]);
    // Aufgabenstellung erstellen
    const quest = document.createElement("div");
    quest.setAttribute("id", "question");
    quest.setAttribute("system_identifier", "0");
    quest.innerHTML = data[position].a;
    main.appendChild(quest);

    // Mögliche Lösungen erstellen
    const solution = document.createElement("div");
    solution.setAttribute("class", "solution");
    const mixedSolutions = randomizeArray(data[position].l);
    createButtonsFromArray(mixedSolutions, solution, submitAnswer);
    main.appendChild(solution);
}

function submitAnswer(event) {
  const targetElement = event.target || event.srcElement;
  const buttonName = targetElement.name;
  const questSet = document.getElementById("question");
  const questSetId = questSet.getAttribute("system_identifier");

// Hier muss gegen die originalen Daten geprüft werden, welchen Index der Button hat. Wenn 0 dann richtig.
  let index = data.findIndex(function(item, i){
    return item.name === val
  });
  // get system_identifier from id question

}

/* 
Support Functions
 */

// Used for switching Elements in random order
function randomizeArray(array) {
  console.log(array)
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  console.log(array);  
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
    el.innerHTML = input[i];
    el.addEventListener("click", listenerFunction, false);
    where.appendChild(el);
  }
}