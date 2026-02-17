// Black 3-5 minutes, green 1-2 minutes, white 2-3 minutes, herbal 5 minutes.

//const DEFAULT_MINUTES = 3;
const DEFAULT_MINUTES = 1;

const DOM = {};   // Certain DOM elements, initialized by 'init()'.

let counter;   // Elapsed time in seconds.
let goal;      // Goal time in seconds.
let initialized = false;  // Has 'initialized()' been called?
let interval_id;

function init() {
    if (!initialized) {
        DOM.state    = document.querySelector(".state");
        DOM.minutes  = document.querySelector("#minutes");
        DOM.time     = document.querySelector("time");
        DOM.progress = document.querySelector("progress");
        DOM.reset    = document.querySelector("#reset");
        DOM.start    = document.querySelector("#start");
        DOM.stop     = document.querySelector("#stop");

        reset();

        DOM.start.addEventListener("click", start);
        DOM.stop.addEventListener("click", stop);
        DOM.reset.addEventListener("click", reset);

        initialized = true;
    }
}

// Callback for 'Start' button.
function start() {
    if (DOM.minutes.value) {
        goal = DOM.minutes.value * 60;
        counter = 0;
        DOM.progress.value = counter;
        DOM.progress.max = goal;
        showTime(true);
        clearInterval(interval_id);
        interval_id = setInterval(tick, 1000);
    }
}

// Callback for 'Stop' button.
function stop() {
    clearInterval(interval_id);
    showTime(false);
}

// Callback for 'Reset' button.
function reset() {
    DOM.minutes.value = DEFAULT_MINUTES;
    showTime(false);
}

function tick() {
    counter++;
    console.log("tick", counter);
    if (counter <= goal) {
        const waiting = goal - counter;
        const minutes = Math.floor(waiting / 60);
        const seconds = Math.floor(waiting % 60).toString().padStart(2, "0");
        DOM.time.innerText = `${minutes}:${seconds}`;
        DOM.progress.value = counter;
    } else {
    }
}

function showTime(show) {
    DOM.state.style.visibility = show ? "visible" : "hidden";
}


if (document.readyState === "complete") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init, {once: true});
}
