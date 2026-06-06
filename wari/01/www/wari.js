// Wari game.

// Delay between animation steps. 1000 = 1 second.
let delay = 250;

// Are we ready for user input?
let isReady = false;


class Player {
    name = "Player";
    pronouns = {nom: "player", acc: "player", gen: "player"};
    isInvertHouses = false;
    score = 0;
    houses = [0, 0, 0, 0, 0, 0];
    dom = {};

    constructor(el) {
        const name = this.name.toLowerCase();
        const d = this.dom
        d.score = el.querySelector(".score");
        d.progress = el.querySelector("progress");
        d.houses = el.querySelectorAll(".house");
        if (this.invertHouses) {
            d.houses.reverse();
        }
        console.assert(d.score, "%s has no score in DOM.", name);
        console.assert(d.progress, "%s has no progress bar in DOM.", name);
        console.assert(d.houses.length === 6,
            "%s has %d houses in DOM, expected 6.", name, d.houses.length);
    }

    canPlay() {
        this.houses.some(x => x > 0);
    }

    isWon() {
        return this.score >= 25;
    }

    renderHome() {
        this.dom.score.textContent = this.score.toString();
        this.dom.progress.value = this.score;
    }

    renderHouse(i) {
        this.dom.houses[i].innerText = this.houses[i].toString();
    }

    renderHouses() {
        this.renderHouse(0);
        this.renderHouse(1);
        this.renderHouse(2);
        this.renderHouse(3);
        this.renderHouse(4);
        this.renderHouse(5);
    }

    reset() {
        this.score = 0;
        this.houses.fill(4);
        this.dom.score.innerText = "";
        this.dom.progress.value = null;
        this.dom.houses[0].innerText = "";
        this.dom.houses[1].innerText = "";
        this.dom.houses[2].innerText = "";
        this.dom.houses[3].innerText = "";
        this.dom.houses[4].innerText = "";
        this.dom.houses[5].innerText = "";
    }

}


class Computer extends Player {
    name = "Computer";
    pronouns = {nom: "I", acc: "me", gen: "my"};
    isInvertHouses = true;
}


class Human extends Player {
    name = "Human";
    pronouns = {nom: "you", acc: "you", gen: "your"};
    isInvertHouses = false;
}

const computer = new Computer(document.querySelector(".computer"));
const human = new Computer(document.querySelector(".human"));

const messages = document.getElementById("wari-messages");

function ready() {
    isReady = true;
    messages.append("Ready. Click on a human house.");
}


function reset() {
    computer.reset();
    human.reset();
    setTimeout(computer.renderHouses.bind(computer), 1 * delay);
    setTimeout(human.renderHouses.bind(human),       2 * delay);
    setTimeout(computer.renderHome.bind(computer),   3 * delay);
    setTimeout(human.renderHome.bind(human),         4 * delay);
    setTimeout(ready,                                5 * delay);
}

function move(player, opponent, start) {
    console.log("Moving", player, opponent, start);
}


function click(houseNum, e) {
    e.preventDefault();
    console.log("You clicked on house %d.", houseNum);
    if (isReady) {
        if (human.houses[houseNum]) {
            move(human, computer, houseNum);
        } else {
            console.log("Can't move from an empty house.");
        }
    }
}


function initialize() {
    human.dom.houses[0].addEventListener("click", click.bind(null, 0) );
    human.dom.houses[1].addEventListener("click", click.bind(null, 1) );
    human.dom.houses[2].addEventListener("click", click.bind(null, 2) );
    human.dom.houses[3].addEventListener("click", click.bind(null, 3) );
    human.dom.houses[4].addEventListener("click", click.bind(null, 4) );
    human.dom.houses[5].addEventListener("click", click.bind(null, 5) );
    reset();
}

initialize();


// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    spysol.$destroy();
  });
}
