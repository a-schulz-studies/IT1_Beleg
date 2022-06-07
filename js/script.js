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
  switch(targetElement.name){
    case "Offline":
      const topics = Object.keys(sourceData);
    	createButtonsFromArray(topics, main, loadOfflineQuestions)
      break;
      case "Online":
        break;
      }
    }
    

function loadOfflineQuestions(event){
  // prevPage = "loadTopicPage(Offline)"; //Muss noch angepasst werden (event)
  clearMain();
  const targetElement = event.target || event.srcElement;
  const key = targetElement.name
  // console.log(sourceData[key]);
  const data = sourceData[key];
  for(let i in data){
    console.log(data[i]);
    // Aufgabenstellung erstellen
    const quest = document.createElement("div");
    quest.setAttribute("id", "question");
    quest.innerHTML = data[i].a;
    main.appendChild(quest);
    
    // Mögliche Lösungen erstellen
    const solution = document.createElement("div");
    solution.setAttribute("id", "solution");
    createButtonsFromArray(data[i].l, solution, submitAnswer);
    main.appendChild(solution);

    waitForAnswer();
  }
}

function waitForAnswer(){
  
}

function submitAnswer(){


}

// Function to clear the main Div
function clearMain(){
  document.getElementById("main").innerHTML = "";
}
/* Creates Buttons in specified div with EventListener on each button */
function createButtonsFromArray(input, where, listenerFunction){
  for (let i in input) {
    let el = document.createElement("button");
    el.setAttribute("name", input[i]);
    el.innerHTML = input[i];
    el.addEventListener("click", listenerFunction, false);
    where.appendChild(el);
  }
}