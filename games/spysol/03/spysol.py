import collections
import random
import time

import pyscript

FACES = ("A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K")
MAX_CARDS = 104   # Number of cards in a full deck. Card IDs 1-104.

Card = collections.namedtuple("Card", "rank red")

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


class DOM:
    def __init__(self):
        self.ctr_tableau        = pyscript.document.getElementById("ctr-tableau")
        self.stock              = pyscript.document.getElementById("stock")
        self.foundation         = pyscript.document.getElementById("foundation")
        self.progress           = pyscript.document.getElementById("progress")
        self.draw               = pyscript.document.getElementById("draw")
        self.won_template       = pyscript.document.getElementById("won-template")


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
dom = DOM()
model = Model()

def render_tableau():
    ht_tableau = create("div", "tableau", "columns", id="tableau")
    for c, col in enumerate(model.tableau):
        ht_column = create("div", "column")
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
            ht_column.append(ht_card)
        ht_tableau.append(ht_column)
    dom.ctr_tableau.replaceChildren(ht_tableau)


def init():
    output = pyscript.document.querySelector("#output")
    output.remove()
    model.set_random_seed()
    model.new_game()
    render_tableau()

init()
