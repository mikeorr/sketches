// Add methods to all Array's.

Array.prototype.clear = function clear() {
    this.splice();
}

Array.prototype.clearChanged = function clearChanged() {
    for (let elm of this) {
        elm.changed = true;
    }
}

Array.prototype.popTo = function popTo(dst) {
    dst.push(this.pop());
}

Array.prototype.shuffle = function shuffle() {
    throw new Error("Not implemented.");
}
