import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState } from '../types/game';
import { getActionEmoji, formatActionType, formatGameActionMinute } from '../utils/gameUtils';

type RecentActionProps = {
    state: GameState;
};

const RecentAction: React.FC<RecentActionProps> = ({ state }) => (
    <div style={{ height: '52px' }}>
        <AnimatePresence>
            {state.recentAction && (
                <motion.div
                    key={state.recentAction.id}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="flex items-center gap-3 w-full h-full px-5 py-3 rounded-2xl border"
                    style={
                        state.recentAction.team === 'home'
                            ? {
                                  background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(234,88,12,0.12))',
                                  borderColor: 'rgba(245,158,11,0.2)',
                              }
                            : {
                                  background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(37,99,235,0.12))',
                                  borderColor: 'rgba(59,130,246,0.2)',
                              }
                    }
                >
                    <span className="text-xl leading-none flex-shrink-0">
                        {getActionEmoji(state.recentAction.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-sm leading-tight">
                            {state.recentAction.player}
                        </div>
                        <div className="text-white/50 text-[11px] leading-tight">
                            {formatActionType(state.recentAction.type, state.recentAction.subAction)}
                        </div>
                    </div>
                    {state.recentAction.replacementPlayer && (
                        <div
                            className="flex-shrink-0 text-[11px] px-2.5 py-1 rounded-lg"
                            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
                        >
                            ↔ {state.recentAction.replacementPlayer}
                        </div>
                    )}
                    <span
                        className="flex-shrink-0 font-mono text-[11px] font-bold px-2 py-1 rounded-lg"
                        style={
                            state.recentAction.team === 'home'
                                ? { background: 'rgba(245,158,11,0.2)', color: 'rgba(245,158,11,0.9)' }
                                : { background: 'rgba(59,130,246,0.2)', color: 'rgba(96,165,250,0.9)' }
                        }
                    >
                        {formatGameActionMinute(state.recentAction.minute)}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

export default RecentAction;
