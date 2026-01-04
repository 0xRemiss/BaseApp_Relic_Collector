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

    // Filter available relics (not in slots)
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
            // If relic allows (Check level compatibility if first slot is filled?)
            // For now, let them place anything, validate on upgrade.
            const newSlots = [...slots];

            // Remove from old slot if it was there
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

        // Fake delay for tension
        setTimeout(() => {
            const ids = filledSlots.map(r => r.id);
            const result = upgradeRelics(ids);

            setResultMessage(result.message);
            setSlots([null, null, null, null, null, null]);
            setIsProcessing(false);

            // Clear message after delay
            setTimeout(() => setResultMessage(null), 3000);
        }, 1500);
    };

    // HTML5 DnD is a bit finicky with React/Mobile. 
    // Implementing a simple "Tap to assign" fallback or alternative is good UX, 
    // but let's stick to the visual requirement. 
    // For the prompt's sake, we'll assume standard DnD works or use simplified click-to-fill for speed if DnD fails.
    // Adding "Click to add to first empty slot" for better usability.

    const autoFillSlot = (relic: Relic) => {
        const emptyIndex = slots.findIndex(s => s === null);
        if (emptyIndex !== -1) {
            const newSlots = [...slots];
            newSlots[emptyIndex] = relic;
            setSlots(newSlots);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Synthesize</h2>
                <span className="text-xs text-purple-400 font-mono uppercase">Drag to slots</span>
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-3 gap-3">
                {slots.map((slot, index) => (
                    <div
                        key={index}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`aspect-square rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center relative transition-colors ${slot ? 'border-purple-500/50 bg-purple-500/10' : 'bg-white/5'}`}
                    >
                        {slot ? (
                            <motion.div
                                layoutId={slot.id}
                                className="w-[80%] h-[80%] rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center font-bold text-white relative group"
                            >
                                L{slot.level}
                                <button
                                    onClick={() => clearSlot(index)}
                                    className="absolute -top-2 -right-2 bg-black rounded-full p-0.5 text-gray-400 hover:text-white"
                                >
                                    <X size={12} />
                                </button>
                            </motion.div>
                        ) : (
                            <span className="text-white/10 font-bold text-2xl">{index + 1}</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Action Area */}
            <div className="h-16 flex items-center justify-center">
                <AnimatePresence>
                    {resultMessage ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-center font-medium text-white"
                        >
                            {resultMessage}
                        </motion.div>
                    ) : (
                        <button
                            disabled={slots.filter(Boolean).length < 2 || isProcessing}
                            onClick={handleUpgrade}
                            className="flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            {isProcessing ? (
                                <span className="animate-pulse">SYNTHESIZING...</span>
                            ) : (
                                <>
                                    <ArrowUpCircle size={20} />
                                    <span>INITIATE UPGRADE</span>
                                </>
                            )}
                        </button>
                    )}
                </AnimatePresence>
            </div>

            {/* Inventory Panel */}
            <div className="glass rounded-t-3xl -mx-4 p-4 min-h-[300px]">
                <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Available Relics</h3>
                <div className="grid grid-cols-4 gap-3">
                    {availableRelics.map(relic => (
                        <motion.div
                            key={relic.id}
                            layoutId={relic.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, relic)}
                            onClick={() => autoFillSlot(relic)}
                            className="aspect-square rounded-lg bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                        >
                            <span className="text-white font-bold text-sm">L{relic.level}</span>
                        </motion.div>
                    ))}
                    {availableRelics.length === 0 && (
                        <div className="col-span-4 text-center text-gray-600 py-8 text-sm">
                            No compatible relics available.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
