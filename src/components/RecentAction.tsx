import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState } from '../types/game';
import { getActionEmoji } from '../utils/gameUtils';

type RecentActionProps = {
    state: GameState;
};

const RecentAction: React.FC<RecentActionProps> = ({ state }) => (
    <AnimatePresence>
        {state.recentAction && (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed bottom-4 right-4 bg-gradient-to-r from-gray-900 to-gray-800 
                    text-white p-4 rounded-lg shadow-xl border border-gray-700"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-full">
                        {getActionEmoji(state.recentAction.type)}
                    </div>
                    <div>
                        <div className="text-sm font-medium">{state.recentAction.minute}`</div>
                        <div className="text-base">
                            {state.recentAction.player}
                            {state.recentAction.type === 'substitution' && (
                                <span className="text-gray-400 text-sm">
                                    {' '}↔️ {state.recentAction.replacementPlayer}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default RecentAction;