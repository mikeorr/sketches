import Spysol from "./Spysol.svelte";
import * as models from "./models.js";

export let els = {
    spysol: document.getElementById("spysol"),
};

export let spysol = new Spysol({
  target: els.spysol,
});

const deck = new models.Deck()
let cards = deck.sorted();

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    spysol.$destroy();
  });
}
