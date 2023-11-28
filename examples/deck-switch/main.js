const decks = ["Traditional", "Numeric", "Compact", "Unicode", "Neaveill"];

let deck = decks[0];
let dom = {};
let initialized = false;

function makeRadio(name, value, checked, click) {
    let label = document.createElement("label");
    let input = document.createElement("input");
    input.setAttribute("type", "radio");
    input.setAttribute("name", "name");
    input.setAttribute("value", value);
    if (checked) {
        input.setAttribute("checked", "checked");
    }
    if (click) {
        input.addEventListener("click", click);
    }
    label.append(input);
    label.append(value);
    return label;
}

function makeDeckChoices() {
    let radios = [];
    let d;
    let radio;
    for (d of decks) {
        radio = makeRadio("deck", d, d == deck, onChangeDeck);
        radios.push(radio);
    }
    return radios;
}

function onChangeDeck(e) {
    deck = e.target.value;
    dom.demo.dataset.deck = deck;
}

function init() {
    if (!initialized) {
        dom.decks = document.getElementById("decks");
        dom.demo = document.getElementById("demo");

        const deckChoices = makeDeckChoices();

        dom.decks.append(...deckChoices);
        dom.demo.dataset.deck = deck;
        dom.demo.hidden = false;
        initialized = true;
    }
}

if (document.readyState === "complete") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}

if (document.readyState === "complete") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}

