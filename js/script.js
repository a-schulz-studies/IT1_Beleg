// TODO:


// Initializig Functionality
window.addEventListener("load", start, false);

// Service Worker registrieren für PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('serviceWorker.js')
    .then(reg => console.log(reg))
    .catch(err => console.log(err));
}

// Global variables
const url = "https://irene.informatik.htw-dresden.de:8888/api/quizzes/";
const username = "newtest@email.com";
const password = "secret";
var prevPage = "";
let topic;
let stats = {};
let questionIds;
let serverData;

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
  prevPage = function () {
    loadStartPage(main);
  };
  let options = ["Offline", "Online"];
  const inner = document.createElement("div");
  inner.setAttribute("id", "options");
  createButtonsFromArray(options, inner, loadTopicPage, options);
  div.appendChild(inner);
}

//TopicPage - Hier werden die verschiedenen Themen der gewählten Option angezeigt
function loadTopicPage(buttonName) {
  prevPage = function () {
    loadStartPage(main);
  };
  clearMain();
  adjustProgressbar("0%");
  topic = "";

  switch (buttonName) {
    case "Offline":
      const topics = Object.keys(sourceData);
      createButtonsFromArray(topics, main, prepOfflineQuestions, topics);
      break;
    case "Online":
      prepOnlineQuestions();
      break;
  }
}

// Funktion zur Kommunikation mit den Server
function sendRequest(url, method, body = "") {
  const options = {
    method: method,
    headers: new Headers({
      "content-type": "application/json",
      Authorization: "Basic " + window.btoa(username + ":" + password),
    }),
  };

  if (method == "POST") {
    options.body = body;
  }

  return fetch(url, options);
}

// Läd die OnlineFragen
function prepOnlineQuestions() {
  adjustProgressbar("0%");
  const wait = document.createElement("div");
  wait.setAttribute("name", "wait");
  wait.innerHTML = "Bitte warten";
  main.appendChild(wait);
  sendRequest(url, "GET")
    .then((response) => response.json())
    .then((data) => (serverData = data.content))
    .then(
      () =>
        (questionIds = randomizeArray(createNumberedArray(serverData.length)))
    )
    .then(loadOnlineQuestions);
}

function loadOnlineQuestions() {
  topic = "Online";
  prevPage = function () {
    loadStartPage(main);
  };
  clearMain();

  const position = questionIds.shift();

  if (position == undefined) {
    loadStats(false);
    return;
  }

  // Titel erstellen
  const title = document.createElement("div");
  title.setAttribute("id", "title");
  title.setAttribute("system_identifier", position);
  title.setAttribute("name", serverData[position]["title"]);
  title.innerHTML = "Titel: " + serverData[position]["title"];
  main.appendChild(title);

  // Aufgabenstellung erstellen
  const quest = document.createElement("div");
  quest.setAttribute("id", "question");
  quest.setAttribute("system_identifier", position);
  quest.setAttribute("name", serverData[position]["text"]);
  quest.innerHTML = serverData[position]["text"];
  main.appendChild(quest);

  // Mögliche Lösungen erstellen
  const solution = document.createElement("div");
  solution.setAttribute("class", "solution");

  const mixedSolutions = randomizeArray(serverData[position]["options"]);
  createCheckboxFromArray(mixedSolutions, solution);

  const submit = document.createElement("button");
  submit.setAttribute("name", "submit");
  submit.innerHTML = "Weiter";

  submit.addEventListener("click", submitOnlineAnswer, false);

  main.appendChild(solution);
  main.appendChild(submit);

  if (Object.keys(stats).indexOf(topic) == -1) {
    //Key noch nicht vorhanden -> neu erstellen
    stats[topic] = { Richtig: 0, Falsch: 0 };
  }
}

// Überprüfen der Angewählten Antworten - Online
function submitOnlineAnswer() {
  const question = document
    .getElementById("question")
    .getAttribute("system_identifier");

  // Hier stehen die Namen der angewählten Boxen
  const answer = getCheckedBoxes();
  let solutions = [];
  for (let i in answer) {
    const index = serverData[question]["options"].indexOf(answer[i]);
    solutions.push(index);
  }

  if (solutions.length == 0) {
    solutions = "";
  } else {
    solutions = solutions.toString();
  }
  const id = serverData[question]["id"];

  // Anfrage beim Server, ob das Ergebnis richtig ist.
  sendRequest(url + id + "/solve", "POST", "[" + solutions + "]")
    .then((response) => response.json())
    .then((data) => afterSubmit(data["success"]));
  // Anzeige, dass das Ergebnis geprüft wird.
  const userFeedback = document.createElement("div");
  userFeedback.setAttribute("id", "userFeedback");
  userFeedback.innerHTML = "Ergebnis wird geprüft.";
  userFeedback.style.setProperty("background-color", "white");
  main.appendChild(userFeedback);
}

function afterSubmit(state) {
  if (state) {
    userFeedback(
      true,
      serverData.length - questionIds.length,
      serverData.length
    );
    stats["Online"]["Richtig"] = stats[topic]["Richtig"] + 1;
  } else {
    userFeedback(
      false,
      serverData.length - questionIds.length,
      serverData.length
    );
    stats["Online"]["Falsch"] = stats[topic]["Falsch"] + 1;
  }
  setTimeout(loadOnlineQuestions, 500);
}

// Helper Function für die loadOfflineQuestions
function prepOfflineQuestions(buttonName) {
  topic = buttonName;
  questionIds = randomizeArray(createNumberedArray(sourceData[topic].length));
  loadOfflineQuestions(topic);
}

// Rendert die Fragestellungen und die Lösungsmöglichkeiten
function loadOfflineQuestions(topic) {
  prevPage = function () {
    loadTopicPage("Offline");
  };
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
  createButtonsFromArray(
    mixedSolutions,
    solution,
    submitOfflineAnswer,
    mixedSolutions
  );
  main.appendChild(solution);

  if (Object.keys(stats).indexOf(topic) == -1) {
    //Key noch nicht vorhanden -> neu erstellen
    stats[topic] = { Richtig: 0, Falsch: 0 };
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
  adjustProgressbar("100%");
  // Dadurch wird die Statistik gelöscht
  if (clearStats) {
    stats = {};
  }
  clearMain();
  topic = "";

  const statsDiv = document.createElement("div");
  statsDiv.setAttribute("class", "stats");

  const keys = Object.keys(stats);
  for (let i in keys) {
    let topic = document.createElement("p");
    topic.setAttribute("class", "topic");
    topic.innerHTML = keys[i];

    const ul = document.createElement("ul");
    const subKeys = Object.keys(stats[keys[i]]);
    for (let j in subKeys) {
      const li = document.createElement("li");
      li.innerHTML = subKeys[j] + ": " + stats[keys[i]][subKeys[j]];
      ul.appendChild(li);
    }
    statsDiv.appendChild(topic);
    statsDiv.appendChild(ul);
  }
  main.appendChild(statsDiv);

  const additionalOptions = [
    "Offline Themen",
    "Online Teil",
    "Statistik löschen",
  ];
  const additionalEventListeners = [
    loadTopicPage,
    prepOnlineQuestions,
    loadStats,
  ];
  const additionalListenerParams = ["Offline", main, true];

  createButtonsFromArray(
    additionalOptions,
    main,
    additionalEventListeners,
    additionalListenerParams
  );
}

// Prüfen, ob die gewählte Antwort richtig war
function submitOfflineAnswer(buttonName) {
  const question = document.getElementById("question").getAttribute("name");
  const currentData = sourceData[topic].filter(
    (element) => element["a"] == question
  );

  const index = currentData[0]["l"].indexOf(buttonName);
  if (index == 0) {
    // Bei richtiger Antwort
    userFeedback(
      true,
      sourceData[topic].length - questionIds.length,
      sourceData[topic].length
    );
    stats[topic]["Richtig"] = stats[topic]["Richtig"] + 1;
  } else {
    // bei falscher Antwort
    userFeedback(
      false,
      sourceData[topic].length - questionIds.length,
      sourceData[topic].length
    );
    stats[topic]["Falsch"] = stats[topic]["Falsch"] + 1;
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
      } else {
        //Mehrere Funktionen + jeweiliger Parameter ist nicht vorhanden
        el.addEventListener("click", listenerFunction[i], false);
      }
    } else {
      // Nur eine Funktion
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
function loadPrevPage() {
  prevPage();
}

// Erzeugt ein durchnummeriertes Array mit der vorgegebenen Länge
function createNumberedArray(length) {
  let array = [];
  for (let i = 0; i < length; i++) {
    array[i] = i;
  }
  return array;
}

// Erstellt Radiobuttons und zeigt sie in entsprechendem Element an
function createCheckboxFromArray(input, where) {
  for (let i in input) {
    const label = document.createElement("label");
    label.innerHTML = input[i];
    const el = document.createElement("input");
    el.setAttribute("type", "checkbox");
    el.setAttribute("name", input[i]);
    el.setAttribute("class", "choices");
    el.setAttribute("system_identifier", i);

    el.addEventListener("click", (event) => {
      var label = el.parentNode;
      if (el.checked) {
        label.style.fontWeight = "bold";
        label.style.backgroundColor = "grey";
      } else {
        label.style.fontWeight = "normal";
        label.style.backgroundColor = "transparent";
      }
    });
    label.appendChild(el);
    where.appendChild(label);
  }
}

function getCheckedBoxes() {
  const checkboxes = document.querySelectorAll("input[type=checkbox]");
  var checkboxesChecked = [];
  // loop over them all
  for (var i = 0; i < checkboxes.length; i++) {
    // And stick the checked ones onto an array...
    if (checkboxes[i].checked) {
      checkboxesChecked.push(checkboxes[i].getAttribute("name"));
    }
  }
  // Return the array if it is non-empty, or null
  return checkboxesChecked.length > 0 ? checkboxesChecked : null;
}

function hamburgerMenu(){
  const button = document.querySelectorAll("#control > button");
  if(button[0].style.display == "inline-block"){
    for(let i = 0; i < button.length; i++){
      button[i].style.display = "none";
    }
  }else{
    for(let i = 0; i < button.length; i++){
      button[i].style.display = "inline-block";
    }
  }
}