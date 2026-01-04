import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { UpgradeView } from './components/UpgradeView';
import { SocialView } from './components/SocialView';
import { PuzzleView } from './components/PuzzleView';
import { Gamepad2 } from 'lucide-react';

const PuzzleFloatingButton = () => {
    const { state } = useGame();
    const [showPuzzle, setShowPuzzle] = useState(false);

    if (state.puzzleCompletedToday) return null;

    return (
        <>
            <button
                onClick={() => setShowPuzzle(true)}
                className="fixed bottom-24 right-4 z-40 bg-white text-black p-3 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] animate-bounce"
            >
                <Gamepad2 size={24} />
            </button>
            {showPuzzle && <PuzzleView onClose={() => setShowPuzzle(false)} />}
        </>
    );
};

function App() {
    return (
        <GameProvider>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/upgrade" element={<UpgradeView />} />
                        <Route path="/social" element={<SocialView />} />
                    </Routes>
                    <PuzzleFloatingButton />
                </Layout>
            </BrowserRouter>
        </GameProvider>
    );
}

export default App;
