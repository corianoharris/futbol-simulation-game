// src/components/SoccerScoreboard.tsx
import React, { useReducer, useEffect, Suspense, useState } from 'react';
import { initializeMirageServer } from '../server/mirage';
import { gameReducer, initialState } from '@/store/GameReducer';
import { useGameActions } from '../hooks/useGameActions';
import ScoreDisplay from '@/components/ScoreDisplay';
import GameEvents from '@/components/GameEvents';
import MatchTimeline  from '@/components/MatchTimeline';
import RecentAction  from '@/components/RecentAction';

// Lazy load GameModals
const GameModals = React.lazy(() => import('./GameModals'));

// Initialize Mirage server
initializeMirageServer();

const SoccerScoreboard = () => {
    const [showGameOverModal, setShowGameOverModal] = useState(false);
    
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const { generateGameAction } = useGameActions(state, dispatch);

    // Fetch players on mount
    useEffect(() => {
        fetch("/api/players")
            .then((res) => res.json())
            .then((data) => dispatch({ type: 'SET_PLAYERS', payload: data }))
            .catch(() => dispatch({ type: 'SET_PLAYERS', payload: [] }));
    }, []);

    // Game timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (state.isPlaying && !state.isHalftime) {
            interval = setInterval(() => {
                const currentTime = state.gameTime;
                
                if (currentTime === 45) {
                    dispatch({ type: 'SET_HALFTIME', payload: true });
                    dispatch({ type: 'SET_PLAYING', payload: false });
                    dispatch({ type: 'UPDATE_TIME', payload: currentTime + 1 });
                    return;
                }
                
                if (currentTime === 90) {
                    if (state.addedTime > 0) {
                        dispatch({ type: 'UPDATE_ADDED_TIME', payload: state.addedTime - 1 });
                        if (Math.random() < 0.3) generateGameAction();
                        return;
                    }
                    dispatch({ type: 'SET_PLAYING', payload: false });
                    dispatch({ type: 'SET_GAME_OVER', payload: true });
                    return;
                }
                
                if (Math.random() < 0.3) generateGameAction();
                dispatch({ type: 'UPDATE_TIME', payload: currentTime + 1 });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [state.isPlaying, state.isHalftime, state.gameTime, state.addedTime, generateGameAction]);

    // Halftime effect
    useEffect(() => {
        if (state.isHalftime) {
            dispatch({ type: 'SET_HALFTIME_MODAL', payload: true });

            const modalTimer = setTimeout(() => {
                dispatch({ type: 'SET_HALFTIME_MODAL', payload: false });
            }, 2500);

            const gameTimer = setTimeout(() => {
                dispatch({ type: 'SET_HALFTIME', payload: false });
                dispatch({ type: 'SET_PLAYING', payload: true });
                dispatch({ type: 'UPDATE_TIME', payload: 46 });
            }, 3000);

            return () => {
                clearTimeout(modalTimer);
                clearTimeout(gameTimer);
            };
        }
    }, [state.isHalftime]);

    // Game over effect
    useEffect(() => {
        if (state.isGameOver) {
            const winner = state.homeScore > state.awayScore ? 'home' :
                state.awayScore > state.homeScore ? 'away' : 'both';
            dispatch({ type: 'SET_FLASH_WINNER', payload: winner });
            setShowGameOverModal(true);

            // Hide modal after 5 seconds
            const modalTimer = setTimeout(() => {
                setShowGameOverModal(false);
            }, 5000);

            const flashTimer = setTimeout(() => {
                dispatch({ type: 'SET_FLASH_WINNER', payload: null });
            }, 3000);

            return () => {
                clearTimeout(modalTimer);
                clearTimeout(flashTimer);
            };
        }
    }, [state.isGameOver, state.homeScore, state.awayScore]);

    const restart = () => {
        dispatch({ type: 'RESET_GAME' });
    };

    const togglePause = () => {
        dispatch({ type: 'SET_PLAYING', payload: !state.isPlaying });
    };

    return (
        <div className="w-full space-y-3">

            {/* ── Main scoreboard card ── */}
            <div
                className="rounded-2xl overflow-hidden border"
                style={{
                    background: 'linear-gradient(160deg, #0d1117 0%, #111827 100%)',
                    borderColor: 'rgba(255,255,255,0.07)',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
                }}
            >
                <div className="px-6 py-8">
                    <ScoreDisplay state={state} />
                </div>
            </div>

            {/* ── Recent action ── */}
            <RecentAction state={state} />

            {/* ── Events columns ── */}
            <div className="grid grid-cols-2 gap-3">
                <div
                    className="rounded-2xl overflow-hidden border"
                    style={{ background: '#0d1117', borderColor: 'rgba(255,255,255,0.07)' }}
                >
                    <div
                        className="flex items-center gap-2 px-4 py-2.5 border-b"
                        style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                        <span className="text-[10px] tracking-[0.2em] text-gray-600 uppercase font-medium">FLBK Events</span>
                    </div>
                    <div className="p-3">
                        <GameEvents state={state} side="home" />
                    </div>
                </div>

                <div
                    className="rounded-2xl overflow-hidden border"
                    style={{ background: '#0d1117', borderColor: 'rgba(255,255,255,0.07)' }}
                >
                    <div
                        className="flex items-center justify-end gap-2 px-4 py-2.5 border-b"
                        style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
                    >
                        <span className="text-[10px] tracking-[0.2em] text-gray-600 uppercase font-medium">DOM Events</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    </div>
                    <div className="p-3">
                        <GameEvents state={state} side="away" />
                    </div>
                </div>
            </div>

            {/* ── Timeline ── */}
            <div
                className="rounded-2xl border px-5 py-4"
                style={{ background: '#0d1117', borderColor: 'rgba(255,255,255,0.07)' }}
            >
                <div className="text-[10px] tracking-[0.25em] text-gray-600 uppercase font-medium mb-3">
                    Match Progress
                </div>
                <MatchTimeline state={state} />
            </div>

            {/* ── Controls ── */}
            <div className="flex justify-center pt-1">
                {state.isGameOver ? (
                    <button
                        onClick={restart}
                        className="text-gray-400 hover:text-white text-xs font-semibold py-2.5 px-6 rounded-full
                            border transition-all duration-200 tracking-widest uppercase"
                        style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                    >
                        ⚽ New Match
                    </button>
                ) : !state.isHalftime && (
                    <button
                        onClick={togglePause}
                        className="text-gray-400 hover:text-white text-xs font-semibold py-2.5 px-6 rounded-full
                            border transition-all duration-200 tracking-widest uppercase"
                        style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                    >
                        {state.isPlaying ? '⏸ Pause' : '▶ Resume'}
                    </button>
                )}
            </div>

            {/* ── Modals ── */}
            <Suspense fallback={null}>
                {(state.showHalftimeModal || (state.isGameOver && showGameOverModal)) && (
                    <GameModals state={state} />
                )}
            </Suspense>

        </div>
    );
};

export default SoccerScoreboard;