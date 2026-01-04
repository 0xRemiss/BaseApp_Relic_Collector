export type RelicLevel = 0 | 1 | 2 | 3;

export interface Relic {
    id: string;
    level: RelicLevel;
    obtainedAt: number; // Timestamp
}

export interface GameState {
    relics: Relic[];
    lastClaimTime: number; // Timestamp of last successful claim
    streak: number; // Current streak count
    lastStreakDate: string | null; // YYYY-MM-DD of the last claim that counted towards streak
    puzzleCompletedToday: boolean;
    lastPuzzleDate: string | null; // YYYY-MM-DD
    referralCount: number;
    socialBonusClaimed: boolean;
    genesisPass: boolean;
}

export const INITIAL_STATE: GameState = {
    relics: [],
    lastClaimTime: 0,
    streak: 0,
    lastStreakDate: null,
    puzzleCompletedToday: false,
    lastPuzzleDate: null,
    referralCount: 0,
    socialBonusClaimed: false,
    genesisPass: false,
};
