// TODO:
/* 
- Problem random Fragen beheben
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
let questionIds;

/* Start
startet die Funktionalität
*/
function start() {
  const main = document.getElementById("main");
  loadStartPage(main);
}

// StartSeite - Hier kann man zwischen dem Offline und Online Modus wählen
function loadStartPage(div) {
  clearMain();
  adjustProgressbar("0%");
  topic = "";
  prevPage = function(){loadStartPage(main)};
  let options = ["Offline", "Online"];
  const inner = document.createElement("div");
  inner.setAttribute("id", "options");
  createButtonsFromArray(options, inner, loadTopicPage, options);
  div.appendChild(inner);
}

//TopicPage - Hier werden die verschiedenen Themen der gewählten Option angezeigt
function loadTopicPage(buttonName) {
  prevPage = function(){loadStartPage(main)};
  clearMain();
  adjustProgressbar("0%");
  topic = "";

  switch (buttonName) {
    case "Offline":
      const topics = Object.keys(sourceData);
      createButtonsFromArray(topics, main, prepOfflineQuestions, topics);
      break;
    case "Online":
      break;
  }
}

// Helper Function für die loadOfflineQuestions
function prepOfflineQuestions(buttonName) {
  topic = buttonName;
  questionIds = randomizeArray(createNumberedArray(sourceData[topic].length));
  loadOfflineQuestions(topic);
}

function loadOfflineQuestions(topic) {
  prevPage = function(){loadTopicPage("Offline")};
  clearMain();
  const data = sourceData[topic];
  const position = questionIds.shift();

  if (position == undefined) {
    loadStats(false);
    return;
  }

  // Aufgabenstellung erstellen
  const quest = document.createElement("div");
  quest.setAttribute("id", "question");
  quest.setAttribute("system_identifier", position);
  quest.setAttribute("name", data[position].a);
  if (topic == "teil-mathe") {
    quest.innerHTML = `$${data[position].a}$`;
  } else {
    quest.innerHTML = data[position].a;
  }
  main.appendChild(quest);

  // Mögliche Lösungen erstellen
  const solution = document.createElement("div");
  solution.setAttribute("class", "solution");

  const mixedSolutions = randomizeArray(data[position].l);
  createButtonsFromArray(mixedSolutions, solution, submitOfflineAnswer, mixedSolutions);
  main.appendChild(solution);

  if (Object.keys(statsOffline).indexOf(topic) == -1) {
    //Key noch nicht vorhanden -> neu erstellen
    statsOffline[topic] = { Richtig: 0, Falsch: 0 };
  }
  window.renderMathInElement(main, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
    ],
  });
}

// Zeigt die Statistikseite an, clearStats = true löscht die Statistik
function loadStats(clearStats) {
  if(clearStats){statsOffline = {}}
  clearMain();
  topic = "";

  const statsDiv = document.createElement("div");
  statsDiv.setAttribute("class", "stats");

  const keys = Object.keys(statsOffline);
  for (let i in keys) {
    let topic = document.createElement("p");
    topic.setAttribute("class", "topic");
    topic.innerHTML = keys[i];

    const ul = document.createElement("ul");
    const subKeys = Object.keys(statsOffline[keys[i]]);
    for (let j in subKeys) {
      const li = document.createElement("li");
      li.innerHTML = subKeys[j] + ": " + statsOffline[keys[i]][subKeys[j]];
      ul.appendChild(li);
    }
    statsDiv.appendChild(topic);
    statsDiv.appendChild(ul);
  }
  main.appendChild(statsDiv);

  const additionalOptions = ["Anderes Thema wählen", "Offline oder Online?", "Statistik löschen"];
  const additionalEventListeners = [loadTopicPage, loadStartPage, loadStats];
  const additionalListenerParams = ["Offline", main, true];

  createButtonsFromArray(additionalOptions, main, additionalEventListeners, additionalListenerParams);
}

// Prüfen, ob die gewählte Antwort richtig war
function submitOfflineAnswer(buttonName) {
  const question = document.getElementById("question").getAttribute("name");
  const currentData = sourceData[topic].filter(element => element["a"] == question);

  const index = currentData[0]["l"].indexOf(buttonName);
  if (index == 0) {
    // Bei richtiger Antwort
    userFeedback(true, sourceData[topic].length - questionIds.length, sourceData[topic].length);
    statsOffline[topic]["Richtig"] = statsOffline[topic]["Richtig"] + 1;
  } else {
    // bei falscher Antwort
    userFeedback(false, sourceData[topic].length - questionIds.length, sourceData[topic].length);
    statsOffline[topic]["Falsch"] = statsOffline[topic]["Falsch"] + 1;
  }
  setTimeout(loadOfflineQuestions, 500, topic);
}

// Gibt ein visuelles Feedback, ob die Frage richtig oder falsch beantwortet wurde.
function userFeedback(state, current, total) {
  let color, text;
  if (state) {
    color = "green";
    text = "Korrekt";
  } else {
    color = "red";
    text = "Falsch";
  }

  const userFeedback = document.createElement("div");
  userFeedback.setAttribute("id", "userFeedback");
  userFeedback.innerHTML = text;
  userFeedback.style.setProperty("background-color", color);
  main.appendChild(userFeedback);

  adjustProgressbar((current / total) * 100 + "%");
}

/* 
// Support Functions
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

// Creates Buttons in specified div with EventListener on each button
function createButtonsFromArray(
  input,
  where,
  listenerFunction,
  functionParam = []
) {
  for (let i in input) {
    let el = document.createElement("button");
    el.setAttribute("name", input[i]);
    el.setAttribute("system_identifier", i);
    if (topic == "teil-mathe") {
      el.innerHTML = `$${input[i]}$`;
    } else {
      el.innerHTML = input[i];
    }
    // Mehrere Funktionen
    if (listenerFunction.length == input.length) {
      // Mehrere Funktionen + jeweiliger Paramerter
      if (functionParam != [] && functionParam[i] != "") {
        el.addEventListener(
          "click",
          function () {
            listenerFunction[i](functionParam[i]);
          },
          false
        );
      }else { //Mehrere Funktionen + jeweiliger Parameter ist nicht vorhanden
        el.addEventListener("click", listenerFunction[i], false);
      }
    } else { // Nur eine Funktion
      // Nur eine Funktion + jeweiliger Parameter ist vorhanden
      if (functionParam != [] && functionParam[i] != "") {
        el.addEventListener(
          "click",
          function () {
            listenerFunction(functionParam[i]);
          },
          false
        );
        // Nur eine Funktion + keine Parameter vorhanden
      } else {
        el.addEventListener("click", listenerFunction, false);
      }
    }

    where.appendChild(el);
  }
}

// Anpassen der Progressbar mit bestimmter Prozentzahl + "%"" Zeichen
function adjustProgressbar(percent) {
  const progressbar = document.getElementById("bar");
  progressbar.style.setProperty("width", percent);
}

// Läd die vorherige Seite
function loadPrevPage(){
  prevPage();
}

// Erzeugt ein durchnummeriertes Array mit der vorgegebenen Länge
function createNumberedArray(length){
      let array = [];
      for(let i = 0; i < length; i++){
        array[i] = i;
      }
      return array;
}