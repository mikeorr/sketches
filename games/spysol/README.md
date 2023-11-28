# Spysol - a Spider card game

The name comes from "Spider + Python + Solitaire", with a spurious
spy connotation. The concept was originally Python although it's now
Javascript.

## Implementations

### 01

A vanilla Javascript implementation.
Finished: ready to run.
It displays rows horizontally in an HTML table, with numeric ranks (1-13)
that you build up ascendingly.
It has a static copy of the `random-seedable` library.
It doesn't have a toolchain or framework.

### 02

Derived from 01.
It displays columns vertically, using flexbox div's.
Ranks are playing-card ranks (A, 2-10, J, Q, K).
Put ranks in descnding order in the columns, so put 2 below 3.
Deleted reserve code and "deal by column" code, which was disabled.


### svelte1

A Svelte implementation.
This shuffles and displays the cards and lets you click to move.
It doesn't do any other validation or game logic yet.
