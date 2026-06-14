import React from 'react';
import { motion } from 'framer-motion';
import { GameState } from '../types/game';

type MatchTimelineProps = {
    state: GameState;
};

const MatchTimeline: React.FC<MatchTimelineProps> = ({ state }) => {
    const progress = Math.min((state.gameTime / 90) * 100, 100);

    const goals = state.actions.filter(
        a => a.type === 'goal' || (a.type === 'penalty' && a.subAction === 'scored')
    );

    return (
        <div>
            {/* Period labels */}
            <div className="flex justify-between text-[10px] text-gray-700 uppercase tracking-widest mb-2 font-medium">
                <span>KO</span>
                <span className={state.isHalftime ? 'text-yellow-500' : ''}>HT</span>
                <span className={state.isGameOver ? 'text-white/50' : ''}>
                    FT{state.addedTime > 0 ? ` +${state.addedTime}` : ''}
                </span>
            </div>

            {/* Progress bar */}
            <div className="relative h-1.5 bg-white/[0.06] rounded-full overflow-visible">
                <motion.div
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #34d399 100%)' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
                {/* HT divider */}
                <div className="absolute top-1/2 -translate-y-1/2 w-px h-3 bg-white/20" style={{ left: '50%' }} />
            </div>

            {/* Goal markers */}
            {goals.length > 0 && (
                <div className="relative h-6 mt-1">
                    {goals.map(g => {
                        const pct = Math.min((g.minute / 90) * 100, 99);
                        const isHome = g.team === 'home';
                        return (
                            <div
                                key={g.id}
                                className="absolute group"
                                style={{ left: `${pct}%` }}
                            >
                                {/* Visual marker */}
                                <div className={`w-1 h-3 rounded-sm mt-1.5 ${isHome ? 'bg-amber-400' : 'bg-blue-400'}`} />

                                {/* Expanded hit area so hover is easy to trigger */}
                                <div className="absolute inset-0 -mx-2 -my-1 cursor-default" />

                                {/* Tooltip */}
                                <div
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                                        hidden group-hover:block z-20 pointer-events-none
                                        text-[10px] font-medium whitespace-nowrap px-2 py-1 rounded-lg
                                        border"
                                    style={{
                                        background: '#0d1117',
                                        borderColor: isHome ? 'rgba(245,158,11,0.3)' : 'rgba(96,165,250,0.3)',
                                        color: isHome ? 'rgba(245,158,11,0.9)' : 'rgba(96,165,250,0.9)',
                                    }}
                                >
                                    ⚽ {g.player} {g.minute}&apos;
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Halftime active pulse */}
            {state.isHalftime && (
                <motion.div
                    className="mt-2 text-center text-[10px] text-yellow-500 tracking-widest uppercase font-semibold"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                >
                    Half Time Interval
                </motion.div>
            )}
        </div>
    );
};

export default MatchTimeline;
