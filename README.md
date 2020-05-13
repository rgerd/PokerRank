# PokerRank

Just scores and ranks poker hands. 
Given an array of two-card (Texas Hold'em) hands, and a fully-dealt board, this algorithm gives you the rankings for each hand. 
See `index.ts` for an example.

Fun for the whole family!

## Example 1:

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
4. The first and third have nothing of note, and share the high card of 13 from the board. However,
the first has an 11 and the third only has a 5, and so the first outranks the third.

## Example 2:

Input:
```
// Hands
[
  [ { value: 10, suit: 'd' }, { value: 12, suit: 'c' } ],
  [ { value: 3, suit: 'h' }, { value: 13, suit: 'd' } ],
  [ { value: 12, suit: 'h' }, { value: 7, suit: 's' } ],
  [ { value: 13, suit: 'd' }, { value: 5, suit: 's' } ],
  [ { value: 7, suit: 'h' }, { value: 9, suit: 'c' } ]
]
// Board
[
  { value: 6, suit: 's' },
  { value: 13, suit: 's' },
  { value: 12, suit: 'd' },
  { value: 7, suit: 'h' },
  { value: 10, suit: 's' }
]
```

Output:
```
[ 0, 2, 1, 2, 4 ]
```

Because:
1. The first hand has two pairs (10 & 12)
2. The thid hand has two pairs (12 & 7)
3. The second and fourth hands both have single pairs (13), and since their cards 
do not improve the cards they inherit from the board beyond the pair of 13's (7, 10, 12), 
the hands are equivalent, and so they receive equal rank.
4. The fifth hand has a single pair, but the pair it makes has less value than the second 
and fourth hands' pairs (9 < 13), and so it is ranked last.


## TODO:

- [X] Give equivalent hands equal rank.
- [ ] Write unit tests.
