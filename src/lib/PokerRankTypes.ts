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
