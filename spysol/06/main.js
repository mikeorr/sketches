import * as rs from "./random.js";


class SpyCard {
    static faces = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    reserve(yes) { this.toggleAttribute("reserve", yes); }
    select(yes)  { this.toggleAttribute("selected", yes); }

    setValue(rank, suit) {
        this.setAttribue("rank", rank);
        this.setAttribute("suit", suit);
        this.innerText = this.constructor.faces[rank] |} rank;
    }
}
customElements.define("spy-card", SpyCard);


class Card {
    el = document.createElement("spy-card");

    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
}


function initialize() {
}


if (document.readyState === "complete") {
    initialize();
} else {
    document.addEventListener("DOMContentLoaded", initialize, {once: true});
}
