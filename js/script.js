// TODO:
/* durch Abfrage prüfen, welche Themen es gibt. (Anzeige auf den entsprechenden Buttons)
Diese sollten dann angezeigt werden. (Indizes zu den jeweiligen Aufgaben in seperatem Array abspeichern damit darauf dann später die Aufgaben angezeigt werden können.)
 */

// Initializig Functionality
window.addEventListener("load", start, false);

// Global variables
const url = "https://irene.informatik.htw-dresden.de:8888/api/quizzes/";
const username = "newtest@email.com";
const password = "secret";
const main = document.getElementById("main");

/* Start
startet die Funktionalität
 */
function start() {
  loadStartPage(main);
}

/* StartSeite
Hier kann man zwischen dem Offline und Online Modus wählen kann.
*/
function loadStartPage(div) {
  let options = ["Offline", "Online"];
  const inner = document.createElement("div");
  inner.setAttribute("id", "options");
  createButtonsFromArray(options, inner, loadTopicPage)
  div.appendChild(inner);
}
/* TopicPage
Hier werden die verschiedenen Themen der gewählten Option angezeigt
*/
function loadTopicPage(event) {
  clearMain();
  const targetElement = event.target || event.srcElement;
  switch(targetElement.name){
    case "Offline":
      const topics = Object.keys(sourceData);
    	createButtonsFromArray(topics, main, loadQuestions)
      break;
    case "Online":
      break;
  }
}

function loadQuestions(event){
  console.log("loadQuestions");
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