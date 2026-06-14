import React from 'react';
import { motion } from 'framer-motion';
import { GameState } from '../types/game';

type ScoreDisplayProps = {
    state: GameState;
};

const LiveBadge = ({ state }: { state: GameState }) => {
    if (state.isGameOver) {
        return <span className="text-[10px] tracking-[0.25em] text-gray-500 uppercase font-semibold">Full Time</span>;
    }
    if (state.isHalftime) {
        return <span className="text-[10px] tracking-[0.25em] text-yellow-500 uppercase font-semibold">Half Time</span>;
    }
    if (state.isPlaying) {
        return (
            <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                </span>
                <span className="text-[10px] tracking-[0.25em] text-red-400 uppercase font-bold">Live</span>
            </div>
        );
    }
    return <span className="text-[10px] tracking-[0.25em] text-gray-600 uppercase font-semibold">Kick Off</span>;
};

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ state }) => {
    const mins = state.gameTime;
    const displayTime = mins < 10 ? `0${mins}` : `${mins}`;

    return (
        <div>
            {/* Competition / status strip */}
            <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] tracking-[0.2em] text-gray-600 uppercase font-medium">League</span>
                <LiveBadge state={state} />
                <span className="text-[10px] tracking-[0.2em] text-gray-600 uppercase font-medium">Matchday 18</span>
            </div>

            {/* Scoreboard */}
            <div className="grid grid-cols-3 items-center gap-4">

                {/* Home team */}
                <motion.div
                    className="flex flex-col items-center gap-2"
                    animate={{ scale: state.flashWinner === 'home' ? [1, 1.04, 1] : 1 }}
                    transition={{ duration: 0.6, repeat: state.flashWinner === 'home' ? Infinity : 0 }}
                >
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #ea580c)', boxShadow: '0 8px 24px rgba(245,158,11,0.25)' }}
                    >
                        <span className="text-white font-black text-base leading-none">FL</span>
                    </div>
                    <span className="text-white font-bold text-sm tracking-[0.15em]">FLBK</span>
                    {state.homePlayersCount < 11 && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                            🟥 {state.homePlayersCount} men
                        </span>
                    )}
                </motion.div>

                {/* Score + clock */}
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3">
                        <motion.span
                            key={`home-${state.homeScore}`}
                            className="text-6xl font-black text-white tabular-nums leading-none"
                            initial={{ scale: 1.35, color: '#f59e0b' }}
                            animate={{ scale: 1, color: '#ffffff' }}
                            transition={{ duration: 0.4 }}
                        >
                            {state.homeScore}
                        </motion.span>
                        <span className="text-gray-700 text-3xl font-light select-none">—</span>
                        <motion.span
                            key={`away-${state.awayScore}`}
                            className="text-6xl font-black text-white tabular-nums leading-none"
                            initial={{ scale: 1.35, color: '#3b82f6' }}
                            animate={{ scale: 1, color: '#ffffff' }}
                            transition={{ duration: 0.4 }}
                        >
                            {state.awayScore}
                        </motion.span>
                    </div>

                    {/* Clock */}
                    <div className="flex items-baseline gap-1 bg-white/[0.05] rounded-full px-4 py-1 border border-white/[0.07]">
                        <span className="text-white font-mono text-base font-semibold tabular-nums">
                            {displayTime}&apos;
                        </span>
                        {state.addedTime > 0 && (
                            <span className="text-red-400 font-mono text-xs">+{state.addedTime}</span>
                        )}
                    </div>

                    {/* Scorers */}
                    <div className="flex gap-6 text-[10px] font-medium min-h-[1rem]">
                        <div className="text-right space-y-0.5" style={{ color: 'rgba(245,158,11,0.8)' }}>
                            {state.actions
                                .filter(a => a.team === 'home' && (a.type === 'goal' || (a.type === 'penalty' && a.subAction === 'scored')))
                                .map(a => (
                                    <div key={a.id}>⚽ {a.player} {a.minute}&apos;</div>
                                ))}
                        </div>
                        <div className="text-left space-y-0.5" style={{ color: 'rgba(96,165,250,0.8)' }}>
                            {state.actions
                                .filter(a => a.team === 'away' && (a.type === 'goal' || (a.type === 'penalty' && a.subAction === 'scored')))
                                .map(a => (
                                    <div key={a.id}>⚽ {a.player} {a.minute}&apos;</div>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Away team */}
                <motion.div
                    className="flex flex-col items-center gap-2"
                    animate={{ scale: state.flashWinner === 'away' ? [1, 1.04, 1] : 1 }}
                    transition={{ duration: 0.6, repeat: state.flashWinner === 'away' ? Infinity : 0 }}
                >
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #60a5fa, #2563eb)', boxShadow: '0 8px 24px rgba(59,130,246,0.25)' }}
                    >
                        <span className="text-white font-black text-base leading-none">DO</span>
                    </div>
                    <span className="text-white font-bold text-sm tracking-[0.15em]">DOM</span>
                    {state.awayPlayersCount < 11 && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                            🟥 {state.awayPlayersCount} men
                        </span>
                    )}
                </motion.div>
            </div>

            {/* Possession bar */}
            <div className="mt-7">
                <div className="flex justify-between text-[10px] text-gray-600 mb-1.5 uppercase tracking-widest font-medium">
                    <span className="text-amber-500/80">{Math.round(state.possessionHome)}%</span>
                    <span>Possession</span>
                    <span className="text-blue-500/80">{Math.round(100 - state.possessionHome)}%</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden flex">
                    <motion.div
                        className="h-full"
                        style={{ background: '#f59e0b' }}
                        animate={{ width: `${state.possessionHome}%` }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                    />
                    <motion.div
                        className="h-full"
                        style={{ background: '#3b82f6' }}
                        animate={{ width: `${100 - state.possessionHome}%` }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ScoreDisplay;
