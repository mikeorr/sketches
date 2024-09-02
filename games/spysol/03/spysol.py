import collections
import functools
import random
import time
import types

import pyodide
import pyscript

FACES = ("A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K")
MAX_CARDS = 104   # Number of cards in a full deck. Card IDs 1-104.

Card = collections.namedtuple("Card", "rank red")

DOM = types.SimpleNamespace()
DOM.ctr_tableau  = pyscript.document.getElementById("ctr-tableau")
DOM.stock        = pyscript.document.getElementById("stock")
DOM.foundation   = pyscript.document.getElementById("foundation")
DOM.progress     = pyscript.document.getElementById("progress")
DOM.draw         = pyscript.document.getElementById("draw")
DOM.won_template = pyscript.document.getElementById("won-template")

def create(tag, *classes, html=None, text=None, **attrs):
    el = pyscript.document.createElement(tag)
    if classes:
        el.classList.add(*classes)
    for attr, value in attrs.items():
        el.setAttribute(attr, value)
    if html is not None:
        el.innerHTML = html
    if text is not None:
        el.innerText = text
    return el

def listen_once(target, event_name, func, *args, **kw):
    if args or kw:
        callback = functools.partial(func, *args, **kw)
    else:
        callback = func
    callback = pyodide.ffi.create_once_callable(callback)
    return target.addEventListener(event_name, callback)


class Selection:
    def __init__(self):
        self.clear()

    def clear(self):
        self.active = False
        self.col = None
        self.row = None

    def select(self, col, row):
        self.col = col
        self.row = row
        self.active = True

    def contains(self, col, row):
        return self.active and col == self.col and row >= self.row


class Model:
    """Spysol model.
    Call `.set_random_seed` and `.new_game` before first game.
    """
    def set_random_seed(self, seed=None):
        if seed is None:
            seed = time.time_ns()
        self.seed = time.time_ns()

    def new_game(self):
        self.tableau = [ [], [], [], [], [], [], [], [], [], [] ]   # `[Card]`
        self.stock = []         # `[Card]`
        self.foundation = []    # `[Card]`
        self.won = False        # True if user has won the game.
        self.selection = Selection()
        self.promotion = Selection()
        cards = self.get_shuffled_cards()
        for row in range(1, 6):
            for col in range(10):
                if col < 4 or row < 5:
                    self.tableau[col].append(cards[0])
                    del cards[0]
        self.stock = cards

    def get_shuffled_cards(self):
        cards = []
        for it in range(4):
            for red in (False, True):
                for rank in range(1, 13+1):
                    card = Card(rank, red)
                    cards.append(card)
        rnd = random.Random(self.seed)
        rnd.shuffle(cards)
        return cards


# State globals.
model = Model()

def render_tableau(listen_cards, listen_columns):
    ht_tableau = create("div", "tableau", "columns", id="tableau")
    for c, col in enumerate(model.tableau):
        ht_column = create("div", "column")
        if listen_columns:
            callback = functools.partial(on_click_column, c)
            callback = pyodide.ffi.create_once_callable(callback)
            ht_column.addEventListener("click", callback)
            if len(col) == 0:
                ht_dummy_card = create("div", "card", "empty-row")
                ht_column.append(ht_dummy_card)
        for r, card in enumerate(col):
            face = FACES[card.rank - 1]
            classes = ["card"]
            if card.red:
                classes.append("red")
            if model.promotion.contains(c, r):
                classes.add("promoting")
            if model.selection.contains(c, r):
                classes.add("selected")
            ht_card = create("div", *classes, text=face)
            if listen_cards:
                callback = functools.partial(on_click_card, c, r)
                callback = pyodide.ffi.create_once_callable(callback)
                ht_card.addEventListener("click", callback)
            ht_column.append(ht_card)
        ht_tableau.append(ht_column)
    DOM.ctr_tableau.replaceChildren(ht_tableau)


def on_click_card(c, r, event):
    print("on_click_card:", c, r)

def on_click_column(c, event):
    print("on_click_row:", r)

def on_click_draw(event):
    print("on_click_column")

def on_click_new_game(event):
    print("on_click_new_game")


def init():
    output = pyscript.document.querySelector("#output")
    output.remove()
    model.set_random_seed()
    model.new_game()
    render_tableau(True, False)

init()
