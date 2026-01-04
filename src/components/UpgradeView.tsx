import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Relic } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpCircle, X } from 'lucide-react';

export const UpgradeView = () => {
    const { state, upgradeRelics } = useGame();
    const [slots, setSlots] = useState<(Relic | null)[]>([null, null, null, null, null, null]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultMessage, setResultMessage] = useState<string | null>(null);

    // Calculate base probability (Placeholder logic: 10% per relic?)
    const filledCount = slots.filter(Boolean).length;
    const probability = filledCount * 15; // Example logic

    const availableRelics = state.relics.filter(
        (relic) => !slots.find((s) => s?.id === relic.id)
    );

    const handleDragStart = (e: any, relic: Relic) => {
        e.dataTransfer.setData('relicId', relic.id);
    };

    const handleDrop = (e: any, index: number) => {
        e.preventDefault();
        const relicId = e.dataTransfer.getData('relicId');
        const relic = state.relics.find((r) => r.id === relicId);

        if (relic) {
            const newSlots = [...slots];
            const oldSlotIndex = newSlots.findIndex(s => s?.id === relicId);
            if (oldSlotIndex !== -1) newSlots[oldSlotIndex] = null;
            newSlots[index] = relic;
            setSlots(newSlots);
        }
    };

    const clearSlot = (index: number) => {
        const newSlots = [...slots];
        newSlots[index] = null;
        setSlots(newSlots);
    };

    const handleUpgrade = () => {
        const filledSlots = slots.filter(Boolean) as Relic[];
        if (filledSlots.length < 2) return;

        setIsProcessing(true);
        setResultMessage(null);

        setTimeout(() => {
            const ids = filledSlots.map(r => r.id);
            const result = upgradeRelics(ids);
            setResultMessage(result.message);
            setSlots([null, null, null, null, null, null]);
            setIsProcessing(false);
            setTimeout(() => setResultMessage(null), 3000);
        }, 2000); // 2s for "Ritual" feel
    };

    const autoFillSlot = (relic: Relic) => {
        const emptyIndex = slots.findIndex(s => s === null);
        if (emptyIndex !== -1) {
            const newSlots = [...slots];
            newSlots[emptyIndex] = relic;
            setSlots(newSlots);
        }
    };

    const getRelicStyle = (level: number) => {
        switch (level) {
            case 0: return 'bg-white/5 text-white/30';
            case 1: return 'bg-purple-900/20 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.1)]';
            case 2: return 'bg-indigo-900/30 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.2)]';
            case 3: return 'bg-[var(--color-primary)]/20 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]';
            default: return 'bg-white/5';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in relative min-h-[80vh] flex flex-col">
            <header className="flex items-center justify-between px-2">
                <div>
                    <h2 className="text-xl font-light text-white tracking-widest uppercase">Ascension</h2>
                    <p className="text-[10px] text-[var(--color-text-muted)] tracking-wide mt-1">
                        Combine relics to increase potency.
                    </p>
                </div>
            </header>

            {/* Ritual Center */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                {/* 2x3 Grid */}
                <div className="grid grid-cols-3 gap-4">
                    {slots.map((slot, index) => (
                        <div
                            key={index}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, index)}
                            className={`w-20 h-20 rounded-[var(--radius-md)] border transition-all duration-500 relative flex items-center justify-center
                                ${slot
                                    ? 'border-[var(--color-primary)]/30 bg-[var(--color-surface)]'
                                    : 'border-white/5 bg-white/[0.02]'
                                }`}
                        >
                            {slot ? (
                                <motion.div
                                    layoutId={slot.id}
                                    className={`w-14 h-14 rotate-45 rounded-[var(--radius-sm)] flex items-center justify-center ${getRelicStyle(slot.level)}`}
                                >
                                    {/* Using minimal text for level inside ritual */}
                                    <span className="text-xs font-mono -rotate-45">L{slot.level}</span>
                                    <button
                                        onClick={() => clearSlot(index)}
                                        className="absolute -top-1 -right-1 bg-[var(--color-surface)] border border-white/10 rounded-full p-1 hover:text-white text-gray-500"
                                    >
                                        <X size={10} />
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="w-2 h-2 rounded-full bg-white/5" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Probability Indicator */}
                <div className="text-center">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] block mb-2">
                        Success Probability
                    </span>
                    <div className="text-3xl font-light tabular-nums text-white">
                        {filledCount < 2 ? '---' : `${Math.min(100, probability)}%`}
                    </div>
                </div>

                {/* Action Area */}
                <div className="w-full max-w-[200px] h-12 relative flex items-center justify-center">
                    <AnimatePresence>
                        {resultMessage ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-sm font-medium text-white tracking-wide"
                            >
                                {resultMessage}
                            </motion.div>
                        ) : (
                            <button
                                disabled={filledCount < 2 || isProcessing}
                                onClick={handleUpgrade}
                                className={`w-full h-full rounded-full border transition-all duration-500 uppercase text-xs font-bold tracking-[0.2em]
                                    ${filledCount >= 2 && !isProcessing
                                        ? 'border-[var(--color-primary)]/50 text-white bg-[var(--color-primary)]/10 shadow-[0_0_30px_rgba(139,92,246,0.15)] hover:bg-[var(--color-primary)]/20'
                                        : 'border-white/5 text-white/10 cursor-not-allowed'
                                    }`}
                            >
                                {isProcessing ? 'Ascending...' : 'Initiate Ritual'}
                            </button>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Inventory Drawer (Bottom) */}
            <div className={`glass border-t border-white/5 p-6 -mx-5 -mb-5 transition-transform duration-500 ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
                <h3 className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
                    Select Components
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {availableRelics.map(relic => (
                        <div key={relic.id} className="snap-start shrink-0">
                            <motion.div
                                layoutId={relic.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, relic)}
                                onClick={() => autoFillSlot(relic)}
                                className={`w-16 h-16 rounded-[var(--radius-md)] border border-white/5 flex items-center justify-center cursor-pointer active:scale-95 transition-all ${getRelicStyle(relic.level)}`}
                            >
                                <span className="font-mono text-xs font-bold">L{relic.level}</span>
                            </motion.div>
                        </div>
                    ))}
                    {availableRelics.length === 0 && (
                        <div className="w-full text-center py-4 text-[10px] text-[var(--color-text-muted)]">
                            Empty
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
