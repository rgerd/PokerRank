import * as PokerRank from "../index";
import * as Debug from "../lib/PokerRankDebug";

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
    
    const rawScores = PokerRank.scoreHands(hands, board);
    const ranked = PokerRank.rankScores(rawScores);
    
    console.log(rawScores.map((rawScore) => PokerRank.getBestHand(rawScore)));
    console.log(ranked);
}

main();
