import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { GameState, INITIAL_STATE, Relic, RelicLevel } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface GameContextType {
    state: GameState;
    claimRelic: () => { success: boolean; message: string };
    completePuzzle: () => void;
    claimSocialBonus: () => void;
    upgradeRelics: (relicIds: string[]) => { success: boolean; message: string; newRelic?: Relic };
    canClaim: boolean;
    timeUntilClaim: number; // Milliseconds
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useLocalStorage<GameState>('base-mini-app-state', INITIAL_STATE);

    // Helper to get today's date YYYY-MM-DD
    const getTodayDate = () => new Date().toISOString().split('T')[0];

    // Helper: Time until next claim
    const CLAIM_COOLDOWN_MS = 12 * 60 * 60 * 1000; // 12 hours
    const now = Date.now();
    const timeSinceLastClaim = now - state.lastClaimTime;
    const timeUntilClaim = Math.max(0, CLAIM_COOLDOWN_MS - timeSinceLastClaim);
    const canClaim = timeUntilClaim === 0;

    // Sync puzzle state on new day
    useEffect(() => {
        const today = getTodayDate();
        if (state.lastPuzzleDate !== today && state.puzzleCompletedToday) {
            setState(prev => ({
                ...prev,
                puzzleCompletedToday: false,
                lastPuzzleDate: today
            }));
        }
    }, [state.lastPuzzleDate, state.puzzleCompletedToday, setState]);

    // Core Action: Claim Relic
    const claimRelic = (): { success: boolean; message: string } => {
        const currentNow = Date.now();

        // Validate Time
        if (currentNow - state.lastClaimTime < CLAIM_COOLDOWN_MS) {
            return { success: false, message: "Too early to claim." };
        }

        // Generate new Relic
        const newRelic: Relic = {
            id: crypto.randomUUID(),
            level: 0,
            obtainedAt: currentNow
        };

        // Handle Streak Logic
        const today = getTodayDate();
        let newStreak = state.streak;
        let newLastStreakDate = state.lastStreakDate;

        // Prepare rewards list (Base claim + Streak rewards)
        const newRelics = [newRelic];

        // Check if streak continues
        if (state.lastStreakDate) {
            const lastDate = new Date(state.lastStreakDate);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            lastDate.setHours(0, 0, 0, 0);

            const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Consecutive day
                newStreak += 1;
                newLastStreakDate = today;
            } else if (diffDays > 1) {
                // Streak broken
                newStreak = 1; // Reset to 1 because we just claimed today
                newLastStreakDate = today;
            } else {
                // Same day claim (e.g. 12h later in same day context? unlikely with calendar day logic but possible)
                // If claiming twice in same calendar day, streak shouldn't increment twice, 
                // BUT 12h cooldown usually forces next day or late same day.
                // Specification says: "Streak... when user completes AT LEAST one timed relic claim within a calendar day"
                // and "Missing a full calendar day resets".

                if (state.lastStreakDate !== today) {
                    newStreak += 1;
                    newLastStreakDate = today;
                }
            }
        } else {
            // First claim ever
            newStreak = 1;
            newLastStreakDate = today;
        }

        // Milestone Rewards (Only once per season - simplistic check for now)
        // NOTE: In a real app we'd track specific milestone claims in a separate map to avoid re-claiming if streak resets and rebuilds.
        // For this MVP version, we will assume simplified accumulation current session.
        // Spec: "Each earned only once per season".
        // We need state for `milestonesClaimed: number[]` but simpler is to just add if hitting it exactly.
        // Let's stick to base mechanics:

        if (newStreak === 3) newRelics.push({ id: crypto.randomUUID(), level: 0, obtainedAt: currentNow });
        if (newStreak === 7) {
            newRelics.push({ id: crypto.randomUUID(), level: 0, obtainedAt: currentNow });
            newRelics.push({ id: crypto.randomUUID(), level: 0, obtainedAt: currentNow });
        }
        // ... etc (Simplified for MVP start)

        setState(prev => ({
            ...prev,
            relics: [...prev.relics, ...newRelics],
            lastClaimTime: currentNow,
            streak: newStreak,
            lastStreakDate: newLastStreakDate
        }));

        return { success: true, message: `Claimed! Streak: ${newStreak}` };
    };

    const upgradeRelics = (relicIds: string[]): { success: boolean; message: string; newRelic?: Relic } => {
        // Basic validation
        if (relicIds.length < 2) return { success: false, message: "Select relics to upgrade." };

        // Find relics
        const selectedRelics = state.relics.filter(r => relicIds.includes(r.id));
        if (selectedRelics.length !== relicIds.length) return { success: false, message: "Invalid relic selection." };

        // Check levels
        const level = selectedRelics[0].level;
        const allSameLevel = selectedRelics.every(r => r.level === level);
        if (!allSameLevel) return { success: false, message: "Relics must be the same level." };
        if (level === 3) return { success: false, message: "Max level reached." };

        // Determine Probability
        let chance = 0;
        if (level === 0) chance = 1.0;      // 0 -> 1: 100%
        else if (level === 1) chance = 0.5; // 1 -> 2: 50%
        else if (level === 2) chance = 0.3; // 2 -> 3: 30%

        // Roll
        const success = Math.random() < chance;

        // Consume Relics (Remove them)
        const remainingRelics = state.relics.filter(r => !relicIds.includes(r.id));

        let resultMessage = "";
        let resultRelic: Relic | undefined = undefined;

        if (success) {
            resultRelic = {
                id: crypto.randomUUID(),
                level: (level + 1) as RelicLevel,
                obtainedAt: Date.now()
            };
            resultMessage = "Upgrade Successful!";
        } else {
            resultMessage = "Not this time.";
        }

        setState(prev => ({
            ...prev,
            relics: success && resultRelic ? [...remainingRelics, resultRelic] : remainingRelics
        }));

        return { success, message: resultMessage, newRelic: resultRelic };
    };

    const completePuzzle = () => {
        if (state.puzzleCompletedToday) return;

        const currentNow = Date.now();
        const reward1: Relic = { id: crypto.randomUUID(), level: 0, obtainedAt: currentNow };
        const reward2: Relic = { id: crypto.randomUUID(), level: 0, obtainedAt: currentNow }; // +2 Relics reward

        setState(prev => ({
            ...prev,
            puzzleCompletedToday: true,
            lastPuzzleDate: getTodayDate(),
            relics: [...prev.relics, reward1, reward2]
        }));
    };

    const claimSocialBonus = () => {
        if (state.socialBonusClaimed) return;

        const reward: Relic = { id: crypto.randomUUID(), level: 0, obtainedAt: Date.now() };

        setState(prev => ({
            ...prev,
            socialBonusClaimed: true,
            relics: [...prev.relics, reward]
        }));
    };

    return (
        <GameContext.Provider value={{
            state,
            claimRelic,
            completePuzzle,
            claimSocialBonus,
            upgradeRelics,
            canClaim,
            timeUntilClaim
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
