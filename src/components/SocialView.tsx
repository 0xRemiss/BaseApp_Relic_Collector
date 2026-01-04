import React from 'react';
import { useGame } from '../context/GameContext';
import { Copy, Gift } from 'lucide-react';

export const SocialView = () => {
    const { state, claimSocialBonus } = useGame();

    const handleCopy = () => {
        navigator.clipboard.writeText(`https://t.me/baseminiapp?start=${state.referralCount + 1000}`);
        alert("Referral link copied!");
    };

    return (
        <div className="space-y-4">
            <div className="glass p-6 rounded-3xl text-center">
                <h2 className="text-xl font-bold text-white mb-2">Community Link</h2>
                <p className="text-gray-400 text-sm mb-6">Connect with the network to receive a bonus Relic.</p>

                {state.socialBonusClaimed ? (
                    <div className="py-3 bg-white/5 rounded-xl text-green-400 text-sm font-bold">
                        BONUS CLAIMED
                    </div>
                ) : (
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); claimSocialBonus(); }}
                        className="block w-full py-3 bg-[#0088cc] rounded-xl text-white font-bold"
                    >
                        OPEN TELEGRAM
                    </a>
                )}
            </div>

            <div className="glass p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-white">Referrals</h3>
                        <p className="text-gray-400 text-xs">Earn +1 Relic per user</p>
                    </div>
                    <div className="text-2xl font-bold text-white">
                        {state.referralCount}<span className="text-gray-500 text-sm">/100</span>
                    </div>
                </div>

                <button
                    onClick={handleCopy}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl text-white hover:bg-white/5"
                >
                    <Copy size={16} />
                    <span>Copy Referral Link</span>
                </button>
            </div>
        </div>
    );
};
