import * as rs from "./random.js";


function initialize() {
}


if (document.readyState === "complete") {
    initialize();
} else {
    document.addEventListener("DOMContentLoaded", initialize, {once: true});
}
