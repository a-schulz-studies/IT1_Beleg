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
  let options = ["Offline", "Online"];
  const inner = document.createElement("div");
  inner.setAttribute("id", "options");
  for (let i in options) {
    let el = document.createElement("button");
    el.setAttribute("name", options[i]);
    el.innerHTML = options[i];
    el.addEventListener("click", loadTopicPage, false);
    inner.appendChild(el);
  }
  div.appendChild(inner);
}
/* TopicPage
Hier werden die verschiedenen Themen der gewählten Option angezeigt
*/
function loadTopicPage() {

}