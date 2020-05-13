import { TexasHoldEmHand, TexasHoldEmBoard } from './PokerRankTypes';
import { compareArrays } from './PokerRankHelpers';
import { getFullScore } from './PokerRankEval';

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
export function scoreHands(hands: TexasHoldEmHand[], board: TexasHoldEmBoard): number[][]
{
    const rawScores: number[][] = [];

    hands.forEach((hand, handIndex) => 
    {
        const fullHands = board.concat(hand)
            .sort((a, b) => a.value - b.value)      // Sort the cards by value
            .map((_, cardIndex, array) =>           // Create 5-card slices
                array.slice(cardIndex, Math.min(cardIndex + 5, array.length)))
            .filter((slice) => slice.length === 5); // Filter out non-5-card slices

        rawScores[handIndex] = getFullScore(fullHands);
    });

    return rawScores;
}

export function rankScores(rawScores: number[][]): number[]
{
    const sortedScores: number[][] = rawScores.slice().sort((scoresA, scoresB) =>
        compareArrays(scoresA, scoresB)).reverse();

    return rawScores.map((rawScore) => sortedScores.indexOf(rawScore));
}

export function rankHands(hands: TexasHoldEmHand[], board: TexasHoldEmBoard): number[]
{
    return rankScores(scoreHands(hands, board));
}
