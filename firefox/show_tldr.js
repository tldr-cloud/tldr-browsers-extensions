function setUserVisibleError() {
    let hostElement = document.getElementById("bullets");
    addElements(hostElement, ["something is wrong with TL;DR service, please consider filing a bug with the link"]);
}

function requestTlDr(url, onSummary) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log(`response is: ${xhr.response}`);
            parsedRsponse = JSON.parse(xhr.response);
            onSummary(parsedRsponse["summary"]);
        }
    }
    xhr.onerror = setUserVisibleError;

    xhr.open("POST", "https://us-central1-tldr-278619.cloudfunctions.net/extract-summary", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        url: url,
        bert_summary: true
    }));
    console.log("request is out");
}

function onSummary(summary) {
    console.log(`Summary: ${summary}`);
    let hostElement = document.getElementById("bullets");
    let bullets = summary.split(". ");
    addElements(hostElement, bullets);
}

function addElements(element, bullets) {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }

    for (let i=0; i < bullets.length; i++) {
        const listItem = document.createElement("li");
        listItem.textContent = bullets[i];
        element.appendChild(listItem);
    }
}

function requestCurrentTab(requestTlDr) {
    function onError(error) {
        console.log(`Error: ${error}`);
        setUserVisibleError();
    }

    gettingCurrent = browser.tabs.query({active: true, currentWindow: true});
    gettingCurrent.then((tabs) => {
        const url = tabs[0].url;
        console.log(`Current tab url is: ${url}`);
        requestTlDr(url, onSummary);
    }, onError);
}

requestCurrentTab(requestTlDr);
