p = JSON.parse(text);
    console.log(p.note);
    console.log(p.note[1]);
    console.log(p.note[1].a);
    document.getElementById("ziel").innerHTML = text;

    (async () => {
        let response = await new Promise(resolve => {
           var xhr = new XMLHttpRequest();
           xhr.open("GET", url, true);
           xhr.onload = function(e) {
             resolve(xhr.response);
           };
           xhr.onerror = function () {
             resolve(undefined);
             console.error("** An error occurred during the XMLHttpRequest");
           };
           xhr.send();
        }) 
        doTheThing(response)
     })()
// für versenden des Passwords im klartext
     xhr.setRequestHeader("Authorization", "Basic " + window.btoa("name:pw"));

    {
        "content": [
            {
                "id": 1,
                "title": "The Java Logo",
                "text": "What is depicted on the Java logo?",
                "options": [
                    "Robot",
                    "Tea leaf",
                    "Cup of coffee",
                    "Bug"
                ]
            },
            {
                "id": 2,
                "title": "REST",
                "text": "What is REST",
                "options": [
                    "a",
                    "b",
                    "c",
                    "d"
                ]
            },
            {
                "id": 3,
                "title": "The Java Logo",
                "text": "What is depicted on the Java logo?",
                "options": [
                    "Robot",
                    "Tea leaf",
                    "Cup of coffee",
                    "Bug"
                ]
            },
            {
                "id": 4,
                "title": "Bananarama",
                "text": "Which form of measurement is the best?",
                "options": [
                    "Metric",
                    "Imperial",
                    "Banana for Scale",
                    "all of the above"
                ]
            },
            {
                "id": 5,
                "title": "The Java Logo",
                "text": "What is depicted on the Java logo?",
                "options": [
                    "Robot",
                    "Tea leaf",
                    "Cup of coffee",
                    "Bug"
                ]
            },
            {
                "id": 9,
                "title": "Aladdin",
                "text": "In welcher Stadt lebt Aladdin?",
                "options": [
                    "Agrabah",
                    "Baserdi",
                    "Djelly",
                    "Costella"
                ]
            },
            {
                "id": 10,
                "title": "Simpsons",
                "text": "Was ist der Vorname von Chief Wiggum",
                "options": [
                    "Boris",
                    "Clancy",
                    "Arthur",
                    "David"
                ]
            },
            {
                "id": 11,
                "title": "Universum",
                "text": "Was ist die Antwort auf die Frage nach dem Leben, dem Universum und Allem?",
                "options": [
                    "2000",
                    "73",
                    "42",
                    "8"
                ]
            },
            {
                "id": 12,
                "title": "The Java Logo",
                "text": "What is depicted on the Java logo?",
                "options": [
                    "Robot",
                    "Tea leaf",
                    "Cup of coffee",
                    "Bug"
                ]
            },
            {
                "id": 13,
                "title": "The Java Logo",
                "text": "What is depicted on the Java logo?",
                "options": [
                    "Robot",
                    "Tea leaf",
                    "Cup of coffee",
                    "Bug"
                ]
            }
        ],
        "pageable": {
            "sort": {
                "sorted": false,
                "unsorted": true,
                "empty": true
            },
            "offset": 0,
            "pageNumber": 0,
            "pageSize": 10,
            "unpaged": false,
            "paged": true
        },
        "last": false,
        "totalPages": 5,
        "totalElements": 42,
        "number": 0,
        "sort": {
            "sorted": false,
            "unsorted": true,
            "empty": true
        },
        "size": 10,
        "first": true,
        "numberOfElements": 10,
        "empty": false
    }