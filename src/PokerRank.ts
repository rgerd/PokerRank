/* Public types & data structures */

export enum CardSuit
{
    Clubs = "c",
    Diamonds = "d",
    Hearts = "h",
    Spades = "s",
}

export interface CardDefinition
{
    value: number;
    suit: CardSuit;
}

export type TexasHoldEmHand = [CardDefinition, CardDefinition];
export type TexasHoldEmBoard = [CardDefinition, CardDefinition, CardDefinition, CardDefinition, CardDefinition];

/* Helper functions */

// Compares two arrays over the element indices they share,
// prioritizing earlier elements.
// [ 1, 2, 3, 4 ], [ 1, 2, 3, 7 ] == -1
// [ 0, 0, 1, 2 ], [ 0, 0, 1, 2, 3 ] == 0
// [ 1, 2, 3, 4 ], [ 0, 2, 3, 7 ] == 1
function _CompareArrays(arr1: number[], arr2: number[]): number
{
    const minLength = Math.min(arr1.length, arr2.length);
    for (let i = 0; i < minLength; i++)
    {
        if (arr1[i] !== arr2[i])
        { return arr1[i] < arr2[i] ? -1 : 1; }
    }
    return 0;
}

// Groups a sorted array of cards by value.
// [
//     { value: 8, suit: 'd' },
//     { value: 8, suit: 'c' }
//     { value: 11, suit: 's' },
//     { value: 11, suit: 'd' },
//     { value: 12, suit: 'h' },
// ]
// Becomes
// [
//     [ { value: 8, suit: 'd' }, { value: 8, suit: 'c' } ]
//     [ { value: 11, suit: 's' }, { value: 11, suit: 'd' } ]
//     [ { value: 12, suit: 'h' } ],
// ]
function _GetCardGroups(hand: CardDefinition[]): CardDefinition[][]
{
    const groups: CardDefinition[][] = [];

    let currentGroup: CardDefinition[] = [hand[0]];
    for (let i = 1; i < hand.length; i++)
    {
        const currentCard = hand[i];
        if (currentCard.value === currentGroup[0].value)
        {
            currentGroup.push(currentCard);
        }
        else
        {
            groups.push(currentGroup);
            currentGroup = [currentCard];
        }
    }
    groups.push(currentGroup);

    return groups;
}

// Groups a sorted array by value, and then sorts
// those groups by size and then by value.
// [
//     { value: 8, suit: 'd' },
//     { value: 8, suit: 'c' }
//     { value: 11, suit: 's' },
//     { value: 11, suit: 'd' },
//     { value: 12, suit: 'h' },
// ]
// Becomes
// [
//     [ { value: 12, suit: 'h' } ],
//     [ { value: 8, suit: 'd' }, { value: 8, suit: 'c' } ]
//     [ { value: 11, suit: 's' }, { value: 11, suit: 'd' } ]
// ]
function _GetSortedCardGroups(hand: CardDefinition[]): CardDefinition[][]
{
    return _GetCardGroups(hand)
        .sort((groupA, groupB) =>
            ((groupA.length !== groupB.length)
                ? (groupA.length - groupB.length)
                : (groupA[0].value - groupB[0].value)));
}

// Checks to see if a sorted card group (see above) conforms
// to the provided group sizes. If it does, the reverse of 
// the hand's score is returned (see below). 
// If it does not, then an array of 0's of length 
// matching the groupSize parameter's length is returned.
// For example, consider the following sorted groups:
// [
//     [ { value: 12, suit: 'h' } ],
//     [ { value: 8, suit: 'd' }, { value: 8, suit: 'c' } ]
//     [ { value: 11, suit: 's' }, { value: 11, suit: 'd' } ]
// ]
// With groupSizes [1, 2, 2] (two-pair), we get:
// [12, 8, 11]
// With groupSizes [2, 3] (full house), we get:
// [0, 0]
function _CheckSortedCardGroups(sortedGroups: CardDefinition[][], groupSizes: number[]): number[]
{
    if (groupSizes.length === sortedGroups.length)
    {
        let groupSizesMatch = true;
        const values: number[] = [];
        for (let i = 0; i < groupSizes.length && groupSizesMatch; i++)
        {
            groupSizesMatch = groupSizesMatch && groupSizes[i] === sortedGroups[i].length;
            values.push(sortedGroups[i][0].value);
        }

        if (groupSizesMatch)
        {
            return values;
        }
    }

    return groupSizes.map(() => 0);
}

// Takes an array of "full" (5-card) hands and returns
// the maxmimum score received among the provided hands
// given a scoring function (i.e. four-of-a-kind, two pair, etc.).
// A score is defined by the values of the cards which are used
// to compare hands for a given scoring function.
// For example, four-of-a-kind hands are compared first by the
// value of the card in the group of 4, and then by the "kicker,"
// or the one distinct card.
// For example, if one were to compare these two hands:
// 7, 7, 7, 7, 2 | 7, 7, 7, 7, 3
// They would first compare the 7's to the 7's, see that they
// are the same, and then compare the 2 to the 3 and determine
// the second hand to be the winner. Therefore, for these 
// 4-of-a-kind hands, we would assign their scores as
// [ 7, 2 ], [ 7, 3 ].
// See https://en.wikipedia.org/wiki/List_of_poker_hands for more info.
function _GetScore(
    fullHands: CardDefinition[][],
    scoreFunction: (sortedGroups: CardDefinition[][]) => number[]): number[]
{
    return fullHands
        // Run the score function on each full hand
        .map((fullHand) => scoreFunction(_GetSortedCardGroups(fullHand)))
        // Get the best returned score
        .reduce((previousValue, currentValue) =>
        {
            return !previousValue
                ? currentValue
                : (_CompareArrays(previousValue, currentValue) < 0 ? currentValue : previousValue);
        }, undefined)
        // Reverse from [smallest to largest] to [largest to smallest]
        .reverse();
}

/* Evaluation functions */

// Rank: 9
function _GetHighCard(sortedGroups: CardDefinition[][]): number[]
{
    return _CheckSortedCardGroups(sortedGroups, [1, 1, 1, 1, 1]);
}

// Rank: 8
function _GetOnePair(sortedGroups: CardDefinition[][]): number[]
{
    return _CheckSortedCardGroups(sortedGroups, [1, 1, 1, 2]);
}

// Rank: 7
function _GetTwoPair(sortedGroups: CardDefinition[][]): number[]
{
    return _CheckSortedCardGroups(sortedGroups, [1, 2, 2]);
}

// Rank: 6
function _GetThreeOfAKind(sortedGroups: CardDefinition[][]): number[]
{
    return _CheckSortedCardGroups(sortedGroups, [1, 1, 3]);
}

// Rank: 5
function _GetStraight(sortedGroups: CardDefinition[][]): number[]
{
    const isStraight = sortedGroups.length === 5
        && sortedGroups.map((group) => group[0].value)
            .reduce((stillStraight, currentValue, currentIndex, values) =>
                stillStraight && (currentIndex === 0 || (currentValue === values[currentIndex - 1] + 1)), true);

    return [isStraight ? sortedGroups[sortedGroups.length - 1][0].value : 0];
}

// Rank: 4
function _GetFlush(sortedGroups: CardDefinition[][]): number[]
{
    const isFlush = sortedGroups.length === 5
        && sortedGroups.map((group) => group[0].suit)
            .reduce((sharedSuit, currentSuit) =>
                sharedSuit === currentSuit ? sharedSuit : undefined,
            sortedGroups[0][0].suit) !== undefined;

    return isFlush
        ? sortedGroups.map((group) => group[0].value)
        : [0, 0, 0, 0, 0];
}

// Rank: 3
function _GetFullHouse(sortedGroups: CardDefinition[][]): number[]
{
    return _CheckSortedCardGroups(sortedGroups, [2, 3]);
}

// Rank: 2
function _GetFourOfAKind(sortedGroups: CardDefinition[][]): number[]
{
    return _CheckSortedCardGroups(sortedGroups, [1, 4]);
}

// Rank: 1
function _GetStraightFlush(sortedGroups: CardDefinition[][]): number[]
{
    return _GetFlush(sortedGroups)[0] === 0 ? [0] : _GetStraight(sortedGroups);
}

/* Public API */

// Ranks an array of Texas Hold'em hands given a fully dealt board.
// [
//     [ { value: 7, suit: 'h' }, { value: 10, suit: 'c' } ],
//     [ { value: 10, suit: 'c' }, { value: 7, suit: 'c' } ],
//     [ { value: 6, suit: 's' }, { value: 12, suit: 'd' } ],
//     [ { value: 2, suit: 'd' }, { value: 5, suit: 'd' } ],
//     [ { value: 5, suit: 'h' }, { value: 11, suit: 'c' } ]
// ]
// [
//     { value: 5, suit: 's' },
//     { value: 2, suit: 's' },
//     { value: 4, suit: 's' },
//     { value: 7, suit: 'c' },
//     { value: 8, suit: 'd' }
// ]
// [ 3, 2, 0, 1, 4 ]
// TODO: Communicate ties
export function Rank(
    hands: TexasHoldEmHand[],
    board: TexasHoldEmBoard,
    logSortedScores = false): number[]
{
    const rawScores: number[][] = [];

    hands.forEach((hand, handIndex) => 
    {
        const fullHands = board.concat(hand)
            .sort((a, b) => a.value - b.value)      // Sort the cards by value
            .map((_, cardIndex, array) =>           // Create 5-card slices
                array.slice(cardIndex, Math.min(cardIndex + 5, array.length)))
            .filter((slice) => slice.length === 5); // Filter out non-5-card slices

        let rawScore: number[] = [];

        rawScore = rawScore.concat(_GetScore(fullHands, _GetStraightFlush)); // 0
        rawScore = rawScore.concat(_GetScore(fullHands, _GetFourOfAKind));   // 1, 2
        rawScore = rawScore.concat(_GetScore(fullHands, _GetFullHouse));     // 3, 4
        rawScore = rawScore.concat(_GetScore(fullHands, _GetFlush));         // 5, 6, 7, 8, 9
        rawScore = rawScore.concat(_GetScore(fullHands, _GetStraight));      // 10
        rawScore = rawScore.concat(_GetScore(fullHands, _GetThreeOfAKind));  // 11, 12, 13
        rawScore = rawScore.concat(_GetScore(fullHands, _GetTwoPair));       // 14, 15, 16
        rawScore = rawScore.concat(_GetScore(fullHands, _GetOnePair));       // 17, 18, 19, 20
        rawScore = rawScore.concat(_GetScore(fullHands, _GetHighCard));      // 21, 22, 23, 24, 25

        rawScores[handIndex] = rawScore;
    });

    const sortedScores: number[][] = rawScores.slice().sort((scoresA, scoresB) =>
        _CompareArrays(scoresA, scoresB)).reverse();

    if (logSortedScores)
    { console.log(sortedScores); }

    return rawScores.map((rawScore) => sortedScores.indexOf(rawScore));
}
