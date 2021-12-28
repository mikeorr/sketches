    toJSON() {
        const cardMapper = card => card.id;
        return {
            game: "Spysol",
            version: 1,
            reserve0: this.tableau[0].reserve.map(cardMapper),
            reserve1: this.tableau[1].reserve.map(cardMapper),
            reserve2: this.tableau[2].reserve.map(cardMapper),
            reserve3: this.tableau[3].reserve.map(cardMapper),
            reserve4: this.tableau[4].reserve.map(cardMapper),
            reserve5: this.tableau[5].reserve.map(cardMapper),
            reserve6: this.tableau[6].reserve.map(cardMapper),
            reserve7: this.tableau[7].reserve.map(cardMapper),
            reserve8: this.tableau[8].reserve.map(cardMapper),
            reserve9: this.tableau[9].reserve.map(cardMapper),
            cards0: this.tableau[0].cards.map(cardMapper),
            cards1: this.tableau[1].cards.map(cardMapper),
            cards2: this.tableau[2].cards.map(cardMapper),
            cards3: this.tableau[3].cards.map(cardMapper),
            cards4: this.tableau[4].cards.map(cardMapper),
            cards5: this.tableau[5].cards.map(cardMapper),
            cards6: this.tableau[6].cards.map(cardMapper),
            cards7: this.tableau[7].cards.map(cardMapper),
            cards8: this.tableau[8].cards.map(cardMapper),
            cards9: this.tableau[9].cards.map(cardMapper),
            foundations: this.foundations,
            stock: this.stock,
        }
    }
