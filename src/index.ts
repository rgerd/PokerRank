import * as PokerRank from "./PokerRank";
import * as Debug from "./PokerRankDebug"

function main()
{
    const hands: PokerRank.TexasHoldEmHand[] = [
        Debug.GenerateTexasHoldEmHand(),
        Debug.GenerateTexasHoldEmHand(),
        Debug.GenerateTexasHoldEmHand(),
        Debug.GenerateTexasHoldEmHand(),
        Debug.GenerateTexasHoldEmHand()
    ];

    const board: PokerRank.TexasHoldEmBoard = Debug.GenerateTexasHoldEmBoard();

    console.log(hands);
    console.log(board);
    console.log(PokerRank.Rank(hands, board));
}

main();
