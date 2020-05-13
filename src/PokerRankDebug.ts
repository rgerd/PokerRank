import * as PokerRank from "./PokerRank"

export function GenerateCardDefinition(): PokerRank.CardDefinition
{
    return {
        value: Math.floor(Math.random() * 13) + 1,
        suit: [
            PokerRank.CardSuit.Clubs,
            PokerRank.CardSuit.Diamonds,
            PokerRank.CardSuit.Hearts,
            PokerRank.CardSuit.Spades][Math.floor(Math.random() * 4)]
    }
}

export function GenerateTexasHoldEmHand(): PokerRank.TexasHoldEmHand
{
    return [ GenerateCardDefinition(), GenerateCardDefinition() ];
}

export function GenerateTexasHoldEmBoard(): PokerRank.TexasHoldEmBoard
{
    return [ 
        GenerateCardDefinition(),
        GenerateCardDefinition(),
        GenerateCardDefinition(),
        GenerateCardDefinition(), 
        GenerateCardDefinition() 
    ];
}
