import { CardDefinition } from "./PokerRankTypes";
import { compareArrays, getSortedCardGroups, checkSortedCardGroups } from "./PokerRankHelpers";

// Rank: 9
export function getHighCard(sortedGroups: CardDefinition[][]): number[]
{
    return checkSortedCardGroups(sortedGroups, [1, 1, 1, 1, 1]);
}

// Rank: 8
export function getOnePair(sortedGroups: CardDefinition[][]): number[]
{
    return checkSortedCardGroups(sortedGroups, [1, 1, 1, 2]);
}

// Rank: 7
export function getTwoPair(sortedGroups: CardDefinition[][]): number[]
{
    return checkSortedCardGroups(sortedGroups, [1, 2, 2]);
}

// Rank: 6
export function getThreeOfAKind(sortedGroups: CardDefinition[][]): number[]
{
    return checkSortedCardGroups(sortedGroups, [1, 1, 3]);
}

// Rank: 5
export function getStraight(sortedGroups: CardDefinition[][]): number[]
{
    const isStraight = sortedGroups.length === 5
        && sortedGroups.map((group) => group[0].value)
            .reduce((stillStraight, currentValue, currentIndex, values) =>
                stillStraight && (currentIndex === 0 || (currentValue === values[currentIndex - 1] + 1)), true);

    return [isStraight ? sortedGroups[sortedGroups.length - 1][0].value : 0];
}

// Rank: 4
export function getFlush(sortedGroups: CardDefinition[][]): number[]
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
export function getFullHouse(sortedGroups: CardDefinition[][]): number[]
{
    return checkSortedCardGroups(sortedGroups, [2, 3]);
}

// Rank: 2
export function getFourOfAKind(sortedGroups: CardDefinition[][]): number[]
{
    return checkSortedCardGroups(sortedGroups, [1, 4]);
}

// Rank: 1
export function getStraightFlush(sortedGroups: CardDefinition[][]): number[]
{
    return getFlush(sortedGroups)[0] === 0 ? [0] : getStraight(sortedGroups);
}

// Takes an array of "full" (5-card) hands in which the cards
// are pre-sorted in ascending order by value, and returns
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
export function getScore(
    fullHands: CardDefinition[][],
    scoreFunction: (sortedGroups: CardDefinition[][]) => number[]): number[]
{
    return fullHands
        // Run the score function on each full hand
        .map((fullHand) => scoreFunction(getSortedCardGroups(fullHand)))
        // Get the best returned score
        .reduce((previousValue, currentValue) =>
        {
            return !previousValue
                ? currentValue
                : (compareArrays(previousValue, currentValue) < 0 ? currentValue : previousValue);
        }, undefined)
        // Reverse from [smallest to largest] to [largest to smallest]
        .reverse();
}

export const orderedScoreFunctions =
    [
        getStraightFlush, // 0
        getFourOfAKind,   // 1, 2
        getFullHouse,     // 3, 4
        getFlush,         // 5, 6, 7, 8, 9
        getStraight,      // 10
        getThreeOfAKind,  // 11, 12, 13
        getTwoPair,       // 14, 15, 16
        getOnePair,       // 17, 18, 19, 20
        getHighCard       // 21, 22, 23, 24, 25
    ];

// Applies the hand scoring functions in order of precedence (see above).
// Note that the fullHands parameter expects full (5-card) hands in which
// the cards are sorted in ascending order by value.
export function getFullScore(fullHands: CardDefinition[][]): number[]
{
    return orderedScoreFunctions
        .map((scoreFunction) => getScore(fullHands, scoreFunction))
        .reduce((fullScore, handScore) => fullScore.concat(handScore), []);
}

const _scoreFunctionIndices = {
    "Straight Flush": [0],
    "Four of a Kind": [1, 2],
    "Full House": [3, 4],
    "Flush": [5, 6, 7, 8, 9],
    "Straight": [10],
    "Three of a Kind": [11, 12, 13],
    "Two Pair": [14, 15, 16],
    "One Pair": [17, 18, 19, 20],
    "High Card": [21, 22, 23, 24, 25]
};

// Returns the name of the best hand indicated by
// the provided full score (see getFullScore).
export function getBestHand(fullScore: number[]): string
{
    for (const [key, value] of Object.entries(_scoreFunctionIndices))
    {
        for (let valueIdx = 0; valueIdx < value.length; valueIdx++)
        {
            const scoreIdx = value[valueIdx];
            if (fullScore[scoreIdx] !== 0)
            {
                return key;
            }
        }
    }
}
