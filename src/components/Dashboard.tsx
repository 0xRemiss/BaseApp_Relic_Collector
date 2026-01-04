import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Relic } from '../types';

const RelicCard = ({ relic }: { relic: Relic }) => {
    // Level differentiation: L0 (Minimal) -> L3 (Refined Glow)
    const getRelicStyle = (level: number) => {
        switch (level) {
            case 0: return 'bg-white/5 border-white/5 text-white/30';
            case 1: return 'bg-purple-900/20 border-purple-500/20 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.1)]';
            case 2: return 'bg-indigo-900/30 border-indigo-400/30 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.2)]';
            case 3: return 'bg-[var(--color-primary)]/20 border-[var(--color-primary)]/50 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] animate-pulse-slow';
            default: return 'bg-white/5';
        }
    };

    return (
        <div className={`aspect-square rounded-[var(--radius-sm)] border flex items-center justify-center relative group transition-all duration-300 hover:scale-[1.02] ${getRelicStyle(relic.level)}`}>
            {/* Inner abstract shape */}
            <div className={`w-3 h-3 rotate-45 transition-transform duration-500 group-hover:rotate-90 
                ${relic.level > 1 ? 'bg-current shadow-[0_0_8px_currentColor]' : 'border border-current'}`}
            />

            {/* Level indicator (Hidden by default, shown on hover for cleaner look, or small absolute) */}
            <div className="absolute bottom-1 right-1.5 text-[8px] font-mono opacity-40">
                L{relic.level}
            </div>
        </div>
    );
};

export const Dashboard = () => {
    const { state, claimRelic, timeUntilClaim, canClaim } = useGame();

    const formatTime = (ms: number) => {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const [timeLeft, setTimeLeft] = useState(timeUntilClaim);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(Math.max(0, timeLeft - 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => {
        setTimeLeft(timeUntilClaim);
    }, [timeUntilClaim]);

    const handleClaim = () => {
        const result = claimRelic();
        // Replace with a custom toast or subtler feedback later
        alert(result.message);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Status Cards */}
            <section className="grid grid-cols-2 gap-4">
                <div className="glass p-5 rounded-[var(--radius-lg)] flex flex-col items-center justify-center text-center group">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-2 group-hover:text-white/80 transition-colors">
                        Streak
                    </span>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-light tracking-tight text-white">{state.streak}</span>
                        <span className="text-[10px] text-[var(--color-primary)] font-medium">DAY</span>
                    </div>
                </div>
                <div className="glass p-5 rounded-[var(--radius-lg)] flex flex-col items-center justify-center text-center group">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-2 group-hover:text-white/80 transition-colors">
                        Pass
                    </span>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${state.genesisPass ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-white/10'}`} />
                        <span className={`text-sm font-medium tracking-wide ${state.genesisPass ? 'text-white' : 'text-white/30'}`}>
                            {state.genesisPass ? "ACTIVE" : "LOCKED"}
                        </span>
                    </div>
                </div>
            </section>

            {/* Timed Claim - Focal Point */}
            <section className="glass rounded-[var(--radius-lg)] p-8 text-center relative overflow-hidden group">
                {/* Subtle background gradient that breathes */}
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary-muted)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <h2 className="text-lg font-medium text-white/90 mb-6 tracking-wide">Time Anomaly</h2>

                <div className="mb-8 flex justify-center">
                    {canClaim ? (
                        <div className="w-32 h-32 rounded-full border border-[var(--color-primary)]/30 flex items-center justify-center bg-[var(--color-primary)]/5 animate-pulse-slow">
                            <span className="text-[var(--color-primary)] text-4xl animate-bounce-slow">✦</span>
                        </div>
                    ) : (
                        <div className="font-mono text-4xl text-white/80 tracking-widest tabular-nums">
                            {formatTime(timeLeft)}
                        </div>
                    )}
                </div>

                <p className="text-xs text-[var(--color-text-muted)] mb-6 max-w-[80%] mx-auto leading-relaxed">
                    {canClaim
                        ? "The anomaly has stabilized. Extraction available."
                        : "Resonance building. Patience required."}
                </p>

                <button
                    onClick={handleClaim}
                    disabled={!canClaim}
                    className={`w-full py-4 rounded-[var(--radius-md)] text-sm font-bold tracking-[0.15em] transition-all duration-500
                        ${canClaim
                            ? 'bg-white text-[var(--color-bg)] hover:bg-purple-100 shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.98]'
                            : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                        }`}
                >
                    {canClaim ? 'EXTRACT RELIC' : 'LOCKED'}
                </button>
            </section>

            {/* Inventory Grid */}
            <section>
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.15em]">
                        Relic Storage
                    </h3>
                    <span className="text-[10px] text-white/20 font-mono">
                        {state.relics.length}/∞
                    </span>
                </div>

                {state.relics.length === 0 ? (
                    <div className="py-16 text-center border border-dashed border-white/10 rounded-[var(--radius-lg)]">
                        <span className="text-xs text-white/20 block mb-2">Void Empty</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-3">
                        {state.relics.map((relic) => (
                            <RelicCard key={relic.id} relic={relic} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};
