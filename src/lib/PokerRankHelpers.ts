import { CardDefinition } from "./PokerRankTypes";

// Compares two arrays over the element indices they share,
// prioritizing earlier elements.
// [ 1, 2, 3, 4 ], [ 1, 2, 3, 7 ] == -1
// [ 0, 0, 1, 2 ], [ 0, 0, 1, 2, 3 ] == 0
// [ 1, 2, 3, 4 ], [ 0, 2, 3, 7 ] == 1
export function compareArrays(arr1: number[], arr2: number[]): number
{
    const minLength = Math.min(arr1.length, arr2.length);
    for (let i = 0; i < minLength; i++)
    {
        if (arr1[i] !== arr2[i])
        {
            return arr1[i] < arr2[i] ? -1 : 1; 
        } 
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
function _getCardGroups(hand: CardDefinition[]): CardDefinition[][]
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
export function getSortedCardGroups(hand: CardDefinition[]): CardDefinition[][]
{
    return _getCardGroups(hand)
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
export function checkSortedCardGroups(sortedGroups: CardDefinition[][], groupSizes: number[]): number[]
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
