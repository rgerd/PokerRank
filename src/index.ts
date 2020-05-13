import { TexasHoldEmHand, TexasHoldEmBoard } from "./PokerRankTypes";
import { getBestHand } from "./PokerRankEval";
import * as PokerRank from "./PokerRank";
import * as Debug from "./PokerRankDebug";

function main()
{
    const hands: TexasHoldEmHand[] = [
        Debug.GenerateTexasHoldEmHand(),
        Debug.GenerateTexasHoldEmHand(),
        Debug.GenerateTexasHoldEmHand(),
        Debug.GenerateTexasHoldEmHand(),
        Debug.GenerateTexasHoldEmHand()
    ];

    const board: TexasHoldEmBoard = Debug.GenerateTexasHoldEmBoard();

    console.log(hands);
    console.log(board);
    
    const rawScores = PokerRank.scoreHands(hands, board);
    const ranked = PokerRank.rankScores(rawScores);
    
    console.log(rawScores.map((rawScore) => getBestHand(rawScore)));
    console.log(ranked);
}

main();
