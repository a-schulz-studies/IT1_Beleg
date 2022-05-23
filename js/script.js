window.addEventListener("load", start, false);
var xhr = getXhr();

// TODO:
/* durch Abfrage prüfen, welche Themen es gibt. (Anzeige auf den entsprechenden Buttons)
Diese sollten dann angezeigt werden. (Indizes zu den jeweiligen Aufgaben in seperatem Array abspeichern damit darauf dann später die Aufgaben angezeigt werden können.)
 */

const url = "https://irene.informatik.htw-dresden.de:8888/api/quizzes/";

function getXhr() {
  // API für asynchrone Aufrufe
  if (window.XMLHttpRequest) {
    var xhr = new XMLHttpRequest();
    return xhr;
  } else return false;
}

// soweit abgeschlossen TODO Kommentare entfernen!
function sendXhr(method, urlExt, data = null) {
  /*
   *  method: GET/POST
   *  url_ext: Suffix der Quell-URL
   *  leer für alle Quizzes
   *  id für spezielles quiz
   *  id/solve zum lösen eines Quizzes
   */
  let urlDest = url + urlExt;
  xhr.onreadystatechange = xhrHandler;
  xhr.open(method, urlDest);
  xhr.setRequestHeader("Content-Type", "application/json");
  // hier evtl noch variable und Funktion, dass man pwd im Klartext eingeben kann und dann convertiert
  xhr.setRequestHeader("Authorization", "Basic dGVzdEBnbWFpbC5jb206c2VjcmV0");
  xhr.send(data);
  console.debug("Request send");
}
function xhrHandler() {
  // console.log("im xhrHandler");
  // console.log("Status: " + xhr.readyState);
  // if (xhr.readyState != 4) {
  //   return;
  // }
  // console.log("Status: " + xhr.readyState + " " + xhr.status);
  if (xhr.status == 200) {
    text = xhr.responseText;
    console.log(text);
    // return text;

    // p = JSON.parse(text);
    // console.log(p.note);
    // console.log(p.note[1]);
    // console.log(p.note[1].a);
    // document.getElementById("ziel").innerHTML = text;
  }
}

// //https://www.w3schools.com/js/js_json_parse.asp

function start() {
  // window.alert("Es hat funktioniert");
  var main = document.getElementById("main");
  console.log(main);
  // getchoices fehlt noch
  var choices = ["Mathe", "Akorde"];
  console.log(choices);
  for (let i in choices) {
    console.log(i);
    var el = document.createElement("button");
    el.setAttribute("name", choices[i]);
    el.innerHTML = choices[i];
    el.addEventListener("click", chooseTopic, false);
    main.appendChild(el);
  }
}

// choosetopc kann final entfallen, da das anzeigen jeweils immer das gleiche ist.
function chooseTopic(event) {
  var targetElement = event.target || event.srcElement;
  // console.log(targetElement.name);
  switch (targetElement.name) {
    case "Mathe":
      console.log("Erfolgreich auf Mathe geklickt");
      loadTopicPage();
      break;
    case "Akorde":
      console.log("Erfolgreich auf Akorder geklickt");
      break;
  }
}

function loadTopicPage() {
  console.log("vor dem Ajax Aufruf");
  sendXhr("GET", "12");
}
// Wenn eine Antwort falsch ist, dann soll der Button dementsprechend rot (richtig -> grün) aufleuchten
