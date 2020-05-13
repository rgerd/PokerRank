import { TexasHoldEmHand, TexasHoldEmBoard } from "../lib/PokerRankTypes";
import { getBestHand } from "../lib/PokerRankEval";
import * as PokerRank from "../lib/PokerRank";
import * as Debug from "../lib/PokerRankDebug";

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
