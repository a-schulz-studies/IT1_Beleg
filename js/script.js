// TODO:
/* durch Abfrage prüfen, welche Themen es gibt. (Anzeige auf den entsprechenden Buttons)
Diese sollten dann angezeigt werden. (Indizes zu den jeweiligen Aufgaben in seperatem Array abspeichern damit darauf dann später die Aufgaben angezeigt werden können.)
 */

// Global variables
window.addEventListener("load", start, false);
var xhr = getXhr();
const url = "https://irene.informatik.htw-dresden.de:8888/api/quizzes/";
const username = "newtest@email.com";
const password = "secret";

function getXhr() {
  // API für asynchrone Aufrufe
  if (window.XMLHttpRequest) {
    var xhr = new XMLHttpRequest();
    return xhr;
  } else return false;
}

function sendXhr(method, urlExt, data = null) {
  /*
   *  method: GET/POST
   *  url_ext: Suffix der Quell-URL
   *  leer für alle Quizzes
   *  "id" für spezielles quiz
   *  "id"/solve zum lösen eines Quizzes
   */
  let urlDest = url + urlExt;
  xhr.onreadystatechange = xhrHandler;
  xhr.open(method, urlDest);
  xhr.setRequestHeader("Content-Type", "application/json");
  // nice to have: hier evtl noch variable und Funktion, dass man pwd im Klartext eingeben kann und dann convertiert
  xhr.setRequestHeader("Authorization", "Basic " + window.btoa(username + ":" + password));
  xhr.send(data);
  // https://reqbin.com/req/javascript/c-wyuctivp/convert-curl-to-javascript
}

function xhrHandler() {
  new Promise((resolve) => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      data = JSON.parse(xhr.responseText);
      console.log(data);
      resolve(data);
    }
  });
}

function start() {
  var main = document.getElementById("main");
  // getchoices fehlt noch
  /* 
Wie ich brauche alle unterschiedlichen titel
und dann pro titel ein 
array title = ["Mathe", "Akorde"];
array AufgabetoTitel [[1, 2, 3], [4,5,6]]
// Mathe ist mit Index 0 -> ziehe die Werte aus AufgabetoTitel mit Index 0 analog die anderen
   */
  // let choices2 = getChoices();
  var choices = ["Mathe", "Akorde"];
  // console.log(choices);
  for (let i in choices) {
    // console.log(i);
    var el = document.createElement("button");
    el.setAttribute("name", choices[i]);
    el.innerHTML = choices[i];
    el.addEventListener("click", loadTopicPage, false);
    main.appendChild(el);
  }
}

function getChoices() {
  let data;

  console.log("vor dem senden");
  sendXhr("GET", "").then((result) => {
    console.log(result);
  });
  console.log("nach dem senden");
  console.log(data);
  // console.log(data.title);

  // let result = Array.from(new Set(data.title));
  return;
}

function loadTopicPage() {
  // console.log("vor dem Ajax Aufruf");
  let data = sendXhr("GET", "12");
  console.log(data);
}