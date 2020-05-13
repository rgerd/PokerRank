import { CardSuit, CardDefinition, TexasHoldEmHand, TexasHoldEmBoard } from "./PokerRankTypes";

export function GenerateCardDefinition(): CardDefinition
{
    return {
        value: Math.floor(Math.random() * 13) + 1,
        suit: [
            CardSuit.Clubs,
            CardSuit.Diamonds,
            CardSuit.Hearts,
            CardSuit.Spades][Math.floor(Math.random() * 4)]
    }
}

export function GenerateTexasHoldEmHand(): TexasHoldEmHand
{
    return [GenerateCardDefinition(), GenerateCardDefinition()];
}

export function GenerateTexasHoldEmBoard(): TexasHoldEmBoard
{
    return [
        GenerateCardDefinition(),
        GenerateCardDefinition(),
        GenerateCardDefinition(),
        GenerateCardDefinition(),
        GenerateCardDefinition()
    ];
}
