import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ArrowUpCircle, Users, Share2, Gem } from 'lucide-react';
import { useFarcaster } from '../hooks/useFarcaster'; // Ensure this matches actual file path

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const { isSDKLoaded } = useFarcaster();

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: ArrowUpCircle, label: 'Upgrade', path: '/upgrade' },
        { icon: Users, label: 'Social', path: '/social' },
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans pb-24">
            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full" />
            </div>

            {/* Main Content */}
            <main className="relative z-10 p-4 max-w-md mx-auto">
                <header className="flex items-center justify-between mb-8 pt-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Gem size={18} className="text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">ECHOES</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {isSDKLoaded && (
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Farcaster Connected" />
                        )}
                        <div className="px-3 py-1 rounded-full glass text-xs font-medium text-purple-200">
                            Season 1
                        </div>
                    </div>
                </header>

                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 pb-safe">
                <div className="max-w-md mx-auto flex items-center justify-around h-16">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </div>
    );
};
