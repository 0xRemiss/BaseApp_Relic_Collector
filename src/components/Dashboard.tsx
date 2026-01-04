import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Clock } from 'lucide-react';
import { Relic } from '../types';

const RelicCard = ({ relic }: { relic: Relic }) => {
    const levelColors = {
        0: 'from-gray-700 to-gray-600 border-gray-500',
        1: 'from-green-900 to-green-800 border-green-500',
        2: 'from-blue-900 to-blue-800 border-blue-500',
        3: 'from-purple-900 to-purple-800 border-purple-500 animate-pulse-slow',
    };

    return (
        <div className={`aspect-square rounded-xl bg-gradient-to-br ${levelColors[relic.level]} border border-opacity-30 flex items-center justify-center relative group`}>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            <span className="text-xl font-bold text-white/90">L{relic.level}</span>
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

    // Sync if context updates
    useEffect(() => {
        setTimeLeft(timeUntilClaim);
    }, [timeUntilClaim]);

    const handleClaim = () => {
        const result = claimRelic();
        alert(result.message); // Replace with toast later
    };

    // Group relics for display stats (optional, but requested Inventory Grid)
    // For now just listing them.

    return (
        <div className="space-y-6">
            {/* Status Cards */}
            <div className="grid grid-cols-2 gap-3">
                <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                    <span className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-1">Streak</span>
                    <div className="flex items-center gap-1.5 text-orange-400">
                        {/* <Flame size={20} fill="currentColor" /> Icon issue? use text for now if imports fail */}
                        <span className="text-2xl font-bold">{state.streak}</span>
                        <span className="text-xs text-orange-400/80">Days</span>
                    </div>
                </div>
                <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                    <span className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-1">Pass</span>
                    <div className="flex items-center gap-1.5 text-purple-400">
                        <span className="text-sm font-bold">{state.genesisPass ? "OWNED" : "LOCKED"}</span>
                    </div>
                </div>
            </div>

            {/* Claim Section */}
            <div className="glass p-6 rounded-3xl relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

                <h2 className="text-2xl font-bold mb-1 text-white">Time Anomaly</h2>
                <p className="text-gray-400 text-sm mb-6">Stabilize the anomaly to extract a Relic.</p>

                {canClaim ? (
                    <button
                        onClick={handleClaim}
                        className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 transition-transform"
                    >
                        CLAIM RELIC
                    </button>
                ) : (
                    <div className="flex items-center justify-center gap-2 text-purple-300 font-mono text-xl py-3 bg-white/5 rounded-xl border border-white/10">
                        <Clock size={20} />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                )}
            </div>

            {/* Inventory */}
            <div>
                <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider px-1">Artifact Storage</h3>
                {state.relics.length === 0 ? (
                    <div className="py-12 text-center text-gray-600 glass rounded-2xl border-dashed">
                        No relics found. Start by claiming.
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-3">
                        {state.relics.map((relic) => (
                            <RelicCard key={relic.id} relic={relic} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
