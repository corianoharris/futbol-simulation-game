import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState } from '../types/game';

type GameModalsProps = {
    state: GameState;
};

const StatRow = ({ label, home, away }: { label: string; home: number; away: number }) => (
    <div className="flex items-center gap-4">
        <span className="text-white font-bold text-sm w-8 text-right tabular-nums">{home}</span>
        <div className="flex-1">
            <div className="h-0.5 bg-white/[0.06] rounded-full overflow-hidden flex">
                <motion.div
                    className="h-full bg-amber-500/60 rounded-full"
                    style={{ marginLeft: 'auto' }}
                    animate={{ width: home + away > 0 ? `${(home / (home + away)) * 100}%` : '50%' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
            </div>
            <div className="text-center text-[9px] text-gray-600 uppercase tracking-widest mt-1 font-medium">{label}</div>
        </div>
        <span className="text-white font-bold text-sm w-8 text-left tabular-nums">{away}</span>
    </div>
);

const GameModals: React.FC<GameModalsProps> = ({ state }) => {
    const homeShots = state.actions.filter(a => a.team === 'home' && (a.type === 'shot_on_target' || a.type === 'shot_off_target')).length;
    const awayShots = state.actions.filter(a => a.team === 'away' && (a.type === 'shot_on_target' || a.type === 'shot_off_target')).length;
    const homeCorners = state.actions.filter(a => a.team === 'home' && a.type === 'corner').length;
    const awayCorners = state.actions.filter(a => a.team === 'away' && a.type === 'corner').length;
    const homeFouls = state.actions.filter(a => a.team === 'home' && a.type === 'foul').length;
    const awayFouls = state.actions.filter(a => a.team === 'away' && a.type === 'foul').length;

    const winnerText =
        state.homeScore > state.awayScore ? 'Fallbook Warriors Win' :
        state.awayScore > state.homeScore ? 'Dominican Penguins Win' :
        "It's a Draw";

    return (
        <>
            <AnimatePresence>
                {state.showHalftimeModal && (
                    <motion.div
                        key="halftime"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        style={{ background: 'rgba(3,5,8,0.88)', backdropFilter: 'blur(16px)' }}
                    >
                        <motion.div
                            initial={{ scale: 0.88, y: 24 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.88, opacity: 0 }}
                            className="text-center px-8"
                        >
                            <div className="text-[9px] tracking-[0.5em] text-gray-600 uppercase font-bold mb-5">
                                League · Matchday 18
                            </div>
                            <div
                                className="text-[72px] font-black text-white leading-none tracking-tight mb-8"
                                style={{ textShadow: '0 0 80px rgba(255,255,255,0.08)' }}
                            >
                                HALF TIME
                            </div>
                            <div className="flex items-center justify-center gap-10">
                                <div className="text-right">
                                    <div className="text-[10px] tracking-[0.3em] text-amber-500/60 uppercase mb-1">FLBK</div>
                                    <div className="text-6xl font-black text-white tabular-nums">{state.homeScore}</div>
                                </div>
                                <div className="text-gray-700 text-4xl font-light">—</div>
                                <div className="text-left">
                                    <div className="text-[10px] tracking-[0.3em] text-blue-500/60 uppercase mb-1">DOM</div>
                                    <div className="text-6xl font-black text-white tabular-nums">{state.awayScore}</div>
                                </div>
                            </div>
                            <motion.p
                                className="mt-8 text-gray-600 text-xs tracking-widest uppercase"
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 1.6, repeat: Infinity }}
                            >
                                Second half starting soon
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {state.isGameOver && (
                    <motion.div
                        key="fulltime"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        style={{ background: 'rgba(3,5,8,0.92)', backdropFilter: 'blur(20px)' }}
                    >
                        <motion.div
                            initial={{ scale: 0.88, y: 24 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.88, opacity: 0 }}
                            className="text-center w-full max-w-sm px-8"
                        >
                            <div className="text-[9px] tracking-[0.5em] text-gray-600 uppercase font-bold mb-5">
                                Full Time · Final Score
                            </div>
                            <div
                                className="text-[72px] font-black text-white leading-none tracking-tight"
                                style={{ textShadow: '0 0 80px rgba(255,255,255,0.08)' }}
                            >
                                FULL TIME
                            </div>

                            <div className="flex items-center justify-center gap-10 mt-6 mb-6">
                                <div className="text-right">
                                    <div className="text-[10px] tracking-[0.3em] text-amber-500/60 uppercase mb-1">FLBK</div>
                                    <div className="text-6xl font-black text-white tabular-nums">{state.homeScore}</div>
                                </div>
                                <div className="text-gray-700 text-4xl font-light">—</div>
                                <div className="text-left">
                                    <div className="text-[10px] tracking-[0.3em] text-blue-500/60 uppercase mb-1">DOM</div>
                                    <div className="text-6xl font-black text-white tabular-nums">{state.awayScore}</div>
                                </div>
                            </div>

                            <motion.div
                                className="text-base font-bold text-white/80 mb-8"
                                animate={{ scale: [1, 1.04, 1] }}
                                transition={{ duration: 1.8, repeat: Infinity }}
                            >
                                {winnerText}
                            </motion.div>

                            {/* Stats */}
                            <div className="border-t border-white/[0.06] pt-6 space-y-4">
                                <StatRow
                                    label="Possession"
                                    home={Math.floor(state.possessionHome)}
                                    away={100 - Math.floor(state.possessionHome)}
                                />
                                <StatRow label="Shots" home={homeShots} away={awayShots} />
                                <StatRow label="Corners" home={homeCorners} away={awayCorners} />
                                <StatRow label="Fouls" home={homeFouls} away={awayFouls} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default GameModals;
