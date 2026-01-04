import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ArrowUpCircle, Users, Gem } from 'lucide-react';
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
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] font-sans antialiased pb-32">
            {/* Background Ambience (Subtle) */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-purple-900/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-indigo-950/10 blur-[120px] rounded-full" />
            </div>

            {/* Main Content */}
            <main className="relative z-10 p-5 max-w-md mx-auto flex flex-col min-h-screen">
                <header className="flex items-center justify-between mb-10 pt-4">
                    <div>
                        <span className="font-semibold text-xl tracking-tight text-white/90">RELIC</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {isSDKLoaded && (
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.4)]" title="Connected" />
                        )}
                        <span className="text-[10px] font-medium tracking-widest uppercase text-white/40">
                            Season 1
                        </span>
                    </div>
                </header>

                <div className="flex-1">
                    {children}
                </div>
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5 safe-pb">
                <div className="max-w-md mx-auto flex items-center justify-around h-[72px]">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all duration-300 group`}>
                                <div className={`relative p-1 transition-all ${isActive ? 'text-[var(--color-primary)]' : 'text-white/30 group-hover:text-white/50'}`}>
                                    <item.icon size={22} strokeWidth={isActive ? 2 : 1.5} />
                                    {isActive && (
                                        <div className="absolute inset-0 bg-purple-500/20 blur-lg rounded-full opacity-50" />
                                    )}
                                </div>
                                <span className={`text-[9px] font-medium tracking-wide uppercase transition-colors ${isActive ? 'text-white/90' : 'text-white/20'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </div>
    );
};
