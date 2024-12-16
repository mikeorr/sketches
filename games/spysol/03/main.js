import * as rs from "./random-seedable/index.js";

function range(start, stop) {
    let ret = [];
    for (let i = start; i <= stop; i++) {
        ret.push(i);
    }
    return ret;
}

function makeElement(name, ...classes) {
    let el = document.createElement(name);
    if (classes) {
        el.classList.add(...classes);
    }
    return el;
}

const FACES = [
    "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

// Animation frame throttles in milliseconds.
const T1 = 50;    // Fastest.
const T2 = 250;
const T3 = 500;
const T4 = 1000;   // Slowest.

let deck = [];
let DOM = {};
let initialized = false;
let model = null;
let playing = false;
let ready = false;


class Selection {
    constructor() {
        this.clear();
    }

    clear() {
        this.active = false;
        this.row = null;
        this.index = null;
    }

    set(r, i) {
        this.row = r;
        this.index = i;
        this.active = true;
    }

    contains(r, i) {
        return this.active && this.row === r && this.index <= i;
    }
}


class SpysolModel {
    constructor() {
        const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        const reds = [false, true, false, true, false, true, false, true];
        let card, face, rank, red;
        this.deck = [];
        for (red of reds) {
            for (rank of ranks) {
                card = {rank, red};
                this.deck.push(card);
            }
        }
        this.selection = new Selection();
        this.promotion = new Selection();
        this.ascending = false;  // True if ranks ascend to promote, false if descend.
        this.clear();
    }

    clear() {
        this.rows = [ [], [], [], [], [], [], [], [], [], [] ];
        this.stock = [];
        this.foundation = [];
        this.won = false;
        this.selection.clear();
    }

    newGame() {
        let cards = rs.random.shuffle(this.deck.slice());
        this.clear();
        let i, r;
        for (i = 0; i <= 3; i++) {
            for (r = 0; r <= 9; r++) {
                this.rows[r].push( cards.shift() );
            }
        }
        for (r of [0, 1, 2, 3]) {
            this.rows[r].push( cards.shift() );
        }
        this.stock = cards;

    }

    move(dst) {
        if (!this.selection.active) {
            console.error("Model .move() called with no selection active.");
            return false;
        }
        const src = this.selection.row;
        const i = this.selection.index;
        let cards;
        cards = this.rows[src].splice(i);
        this.rows[dst].push(...cards);
        this.selection.clear();
        if (this.canPromote(dst)) {
            this.promotion.set(dst, this.rows[dst].length - 13);
        } else {
            this.promotion.clear();
        }
        return true;
    }

    canPromote(r) {
        const row = this.rows[r];
        const start = row.length - 13;
        if (start < 0) {
            return false;
        }
        const hand = row.slice(start);
        const red = hand[0].red;
        let card, i, rank;
        if (this.ascend) {
            // Ranks must ascend 1-13 to promote.
            for (rank = 1; rank < 13; rank++) {
                card = hand[rank - 1];
                if (card.rank !== rank || card.red !== red) {
                    return false;
                }
            }
        } else {
            // Ranks must descend 13-1 to promote.
            for (i = 0; i <= 12; i++) {
                rank = 13 - i;
                card = hand[i];
                if (card.rank !== rank || card.red !== red) {
                    return false;
                }
            }
        }
        return true;
    }

    promote() {
        const prom = this.promotion;
        let cards;
        if (prom.active) {
            cards = this.rows[prom.row].splice(prom.index);
            this.foundation.push(...cards);
            this.promotion.clear();
            if (this.foundation.length >= 104) {
                this.won = true;
            }
         } else {
            log.error("SpysolModel.promote() called with no promotion active.");
         }
    }

    draw() {
        let card, row;
        for (row of this.rows) {
            card = this.stock.shift();
            if (!card) {
                break;
            }
            row.push(card);
        }
    }

    checkDealtCards() {
        let card, control, equal, tallies, row;
        control   = Array(26).fill(4, 0);
        tallies   = Array(26).fill(0, 0);
        function checkCard(card) {
            let index;
            if (card.red) {
                tallies[card.rank + 13 - 1]++;
            } else {
                tallies[card.rank - 1]++;
            }
        }
        for (row of this.rows) {
            row.forEach(checkCard);
        }
        this.stock.forEach(checkCard);
        this.foundation.forEach(checkCard);
        //console.log("Control =", control);
        //console.log("Tallies =", tallies);
        equal = tallies.every( (value, index) => value === control[index] );
        console.assert(equal, "Not all cards found in dealt cards, result:", tallies);
    }

    testPromotion() {
        const fill = (r, red) => {
            for (let rank = 1; rank <= 12; rank++) {
                this.rows[r].push({rank, red});
            }
            this.rows[r+1].push({rank:13, red: red});
        }
        fill(0, false);
        fill(2, true);
    }
}

function onClickCard(r, i, event) {
    event.stopImmediatePropagation();
    model.selection.set(r, i);
    renderTableau(false, true);
}

function onClickRow(r, event) {
    let moved, promoted;
    event.stopImmediatePropagation();
    if (!model.selection.active) {
        console.error("onClickRow called with no selection active.");
    } else if (r === model.selection.row) {
        model.selection.clear();
        renderTableau(true, false);
    } else {
        moved = model.move(r);
        renderTableau(true, false);
        //setTimeout(updateSelected, T2, r, i, false);
    }
}

function onClickDraw(event) {
    model.draw();
    if (model.stock.length < 1) {
        DOM.draw.disabled = true;
    }
    render(true, false);
}

function onClickNewGame(event) {
    const prompt = "Abandon current game?";
    if (window.confirm(prompt)) {
        setTimeout(newGame, T2);
    }
}

function render(listenCards, listenRows) {
    renderTableau(listenCards, listenRows);
    renderFoundation();
    renderStock();
}

function renderTableau(listenCards, listenRows) {
    // Model variables.
    let card;       // Card model.
    let r;          // Card row in tableau.
    let i;          // Card index in tableau row.

    // User interface variables.
    let callback;   // Listener callback.
    let classes;    // Array of CSS classes.
    let face;       // Card face.
    let rows;       // Array of HTML row elements.
    let tableau;    // HTML tableau element (<table>).
    let td;         // HTML card element (<td>).
    let tr;         // HTML row element (<tr>).
    let column;     // HTML tableau column.
    let cell;       // HTML tableau cell.

    //tableau = document.createElement("div");
    tableau = makeElement("div", "tableau", "columns");
    tableau.id = "tableau";
    //tableau.classList.add("tableau", "flex-columns");

    rows = [];
    for (r = 0; r < model.rows.length; r++) {
        column = makeElement("div", "column");
        tr = column;   // Backward compatibility.
        //tr = document.createElement("div")
        //tr.classList.add("column")
        tr.id = `row-${i}`;
        if (listenRows) {
            callback = onClickRow.bind(null, r);
            tr.addEventListener("click", callback);
            if (!model.rows[r].length) {
                cell = makeElement("div", "cell", "card", "empty-row");
                td = cell;
                //td = document.createElement("div");
                // td.classList.add("cell")
                td.innerText = "+";
                //td.classList.add("card", "empty-row");
                tr.append(td);
            }
        }
        for (i = 0; i < model.rows[r].length; i++) {
            card = model.rows[r][i];
            //face = card.rank.toString();
            face = FACES[card.rank - 1] || "?";
            classes = ["card"];
            if (card.red) {
                classes.push("red");
            }
            if (model.promotion.contains(r, i)) {
                classes.push("promote");
            }
            if (model.selection.contains(r, i)) {
                classes.push("selected");
            }
            cell = makeElement("div", "cell", ...classes);
            td = cell;   // Backward compatibility.
            //td = document.createElement("div");
            //td.classList.add("cell")
            td.innerText = face;
            //td.classList.add(...classes);
            if (listenCards) {
                callback = onClickCard.bind(null, r, i);
                td.addEventListener("click", callback);
            }
            tr.append(td);
        }
        tableau.append(tr);
    }
    DOM.ctr_tableau.replaceChildren(tableau);
    if (model.promotion.active) {
        setTimeout(promote, T4);
    }
}

function promote() {
    console.log("Promote row", model.promotion);
    model.promote();
    renderTableau(true, false);
    setTimeout(renderFoundation, T4);
}

function renderStock() {
    const size = model.stock.length;
    DOM.stock.innerText = size;
}

function renderFoundation() {
    const size = model.foundation.length;
    const goal = model.deck.length;
    const percent = Math.round(size / goal * 100);
    DOM.foundation.innerText = size;
    DOM.foundation_percent.innerText = percent;
    DOM.foundation_progress.value = size;
    if (model.won) {
        setTimeout(renderWon, T4);
    }
}

function renderWon() {
    let won;
    won = DOM.won_template.content.cloneNode(true);
    DOM.ctr_tableau.replaceChildren(won);
}

function newGame() {
    model.newGame();
    DOM.draw.disabled = false;
    render(true, false);
    model.checkDealtCards();
    function compactCard(c) {  return (c.red) ? -c.rank : c.rank; }
    for (let row of model.rows) {
        console.log( ...row.map(compactCard) );
    }
}

function init() {
    if (!initialized) {
        model = new SpysolModel();

        DOM.ctr_tableau = document.getElementById("ctr-tableau");
        DOM.stock = document.getElementById("stock");
        DOM.foundation = document.getElementById("foundation");
        DOM.foundation_percent = document.getElementById("foundation-percent");
        DOM.foundation_progress = document.getElementById("foundation-progress");
        DOM.draw = document.getElementById("draw");
        DOM.new_game = document.getElementById("new-game");
        DOM.test_promotion = document.getElementById("test-promotion");
        DOM.test_won = document.getElementById("test-won");
        DOM.won_template = document.getElementById("won-template");


        DOM.draw.addEventListener("click", onClickDraw);
        DOM.new_game.addEventListener("click", onClickNewGame);

        newGame();

        initialized = true;
        playing = true;
        ready = true;
    }
}

if (document.readyState === "complete") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}
