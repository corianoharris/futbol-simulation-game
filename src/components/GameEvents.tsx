import React from 'react';
import { motion } from 'framer-motion';
import { GameState } from '../types/game';
import { getActionEmoji, formatActionType, formatGameActionMinute } from '../utils/gameUtils';

type GameEventsProps = {
    state: GameState;
    side: 'home' | 'away';
};

const GameEvents: React.FC<GameEventsProps> = ({ state, side }) => {
    const isHome = side === 'home';
    const events = state.actions.filter(a => a.team === side).slice().reverse();

    return (
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {events.length === 0 && (
                <p className="text-gray-700 text-[11px] text-center py-5 tracking-widest uppercase">
                    No events yet
                </p>
            )}
            {events.map((action) => (
                <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: isHome ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] ${
                        isHome ? '' : 'flex-row-reverse'
                    }`}
                >
                    <span className="text-sm flex-shrink-0 leading-none">{getActionEmoji(action.type)}</span>

                    <div className={`flex-1 min-w-0 ${isHome ? 'text-left' : 'text-right'}`}>
                        <span className="text-white text-[11px] font-semibold truncate block leading-tight">
                            {action.player}
                        </span>
                        <span className="text-gray-600 text-[10px] leading-tight">
                            {formatActionType(action.type, action.subAction)}
                            {action.replacementPlayer && (
                                <span className="text-gray-700"> · {action.replacementPlayer}</span>
                            )}
                        </span>
                    </div>

                    <span
                        className={`text-[10px] font-mono font-bold flex-shrink-0 px-1.5 py-0.5 rounded-md ${
                            isHome
                                ? 'bg-amber-500/10 text-amber-500/80'
                                : 'bg-blue-500/10 text-blue-400/80'
                        }`}
                    >
                        {formatGameActionMinute(action.minute)}
                    </span>
                </motion.div>
            ))}
        </div>
    );
};

export default GameEvents;
