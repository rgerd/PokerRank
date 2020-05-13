# PokerRank

Literally just ranks poker hands. 
Given an array of two-card (Texas Hold'em) hands, and a fully-dealt board, this algorithm gives you the rankings for each hand. 

Fun for the whole family!

## Example:

Input:
```
// Hands
[
  [ { value: 11, suit: 'h' }, { value:  2, suit: 's' } ],
  [ { value: 13, suit: 's' }, { value:  5, suit: 'h' } ],
  [ { value:  5, suit: 'h' }, { value:  4, suit: 'd' } ],
  [ { value:  3, suit: 'd' }, { value: 11, suit: 's' } ],
  [ { value: 10, suit: 'c' }, { value:  3, suit: 's' } ]
]
// Board
[
  { value:  3, suit: 'c' },
  { value: 10, suit: 'c' },
  { value: 13, suit: 'h' },
  { value: 12, suit: 'd' },
  { value:  7, suit: 'h' }
]
```

Output:
```
[ 3, 1, 4, 2, 0 ]
```

Because:
1. The last hand has two pairs (2 10's & 2 3's).
2. The second hand has a high pair of 13's (either ace or king depending on how you play).
3. The fourth hand has a low pair of 3's.
4. The first and third have nothing of note, and share the high card of 13 from the board, so they're equivalent.

## TODO:

* Give equivalent hands equal rank.
* Write unit tests.
