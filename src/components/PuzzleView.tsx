import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CheckCircle2, RotateCcw } from 'lucide-react';

export const PuzzleView = ({ onClose }: { onClose: () => void }) => {
    const { completePuzzle } = useGame();

    // Simple "Order the numbers" or "Click in order" puzzle
    // For interaction requirement: Let's do a 3x3 grid where you must click 1-2-3-4 in order.
    const [sequence, setSequence] = useState<number[]>([]);
    const [completed, setCompleted] = useState(false);

    const target = [1, 2, 3, 4];

    const handleTileClick = (num: number) => {
        if (completed) return;

        // Check if correct next number
        const expected = target[sequence.length];
        if (num === expected) {
            const newSeq = [...sequence, num];
            setSequence(newSeq);

            if (newSeq.length === target.length) {
                setCompleted(true);
                setTimeout(() => {
                    completePuzzle();
                    onClose();
                }, 1000);
            }
        } else {
            // Wrong click - simple shake or reset
            setSequence([]);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm glass p-8 rounded-3xl text-center relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500">Close</button>

                <h2 className="text-2xl font-bold text-white mb-2">Security Override</h2>
                <p className="text-gray-400 mb-8 text-sm">Tap the nodes in ascending order.</p>

                <div className="grid grid-cols-2 gap-4 max-w-[200px] mx-auto mb-8">
                    {[1, 2, 3, 4].sort(() => Math.random() - 0.5).map((num) => (
                        <button
                            key={num}
                            onClick={() => handleTileClick(num)}
                            disabled={sequence.includes(num) || completed}
                            className={`aspect-square rounded-xl flex items-center justify-center text-2xl font-bold transition-all ${sequence.includes(num)
                                    ? 'bg-green-500 text-black scale-95 opacity-50'
                                    : 'bg-white/10 text-white hover:bg-white/20 active:scale-90'
                                }`}
                        >
                            {completed ? <CheckCircle2 /> : num}
                        </button>
                    ))}
                </div>

                <div className="flex justify-center gap-2">
                    {target.map((t, i) => (
                        <div key={t} className={`w-2 h-2 rounded-full ${i < sequence.length ? 'bg-green-500' : 'bg-gray-600'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};
