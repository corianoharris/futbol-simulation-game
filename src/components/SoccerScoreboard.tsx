// src/components/SoccerScoreboard.tsx
import React, { useReducer, useEffect, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { initializeMirageServer } from '../server/mirage';
import { gameReducer, initialState } from '@/store/GameReducer';
import { useGameActions } from '../hooks/useGameActions';
import { ScoreDisplay } from './ScoreDisplay';
import { GameEvents } from './GameEvents';
import { MatchTimeline } from './MatchTimeline';
import { RecentAction } from './RecentAction';

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
            .then((data) => dispatch({ type: 'SET_PLAYERS', payload: data }));
    }, []);

    // Game timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (state.isPlaying && !state.isHalftime) {
            interval = setInterval(() => {
                const currentTime = state.gameTime;
                
                if (currentTime === Math.floor(0.5 * 44)) {
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
                dispatch({ type: 'UPDATE_TIME', payload: 45 });
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

    return (
        <div className="w-full bg-gray-100 p-6">
            <div className="w-full mx-auto space-y-6">
                {/* Main Scoreboard */}
                <motion.div
                    className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl p-8 shadow-xl"
                    animate={{ scale: state.flashWinner ? [1, 1.02, 1] : 1 }}
                    transition={{ duration: 0.5, repeat: state.flashWinner ? Infinity : 0 }}
                >
                    {/* Pattern Background */}
                    <div className="absolute inset-0 opacity-10">
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), 
                                 radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
                                backgroundSize: '100px 100px'
                            }}
                        />
                    </div>

                    {/* Score Display */}
                    <ScoreDisplay state={state} />

                    {/* Possession Bar */}
                    <div className="w-full mt-4">
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                                animate={{ width: `${state.possessionHome}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <div className="flex justify-between text-sm mt-1 text-white">
                            <span>{Math.round(state.possessionHome)}%</span>
                            <span>{Math.round(100 - state.possessionHome)}%</span>
                        </div>
                    </div>
                </motion.div>

                {/* Match Events */}
                <div className="grid grid-cols-2 gap-6">
                    <GameEvents state={state} side="home" />
                    <GameEvents state={state} side="away" />
                </div>

                {/* Match Timeline */}
                <MatchTimeline state={state} />

                {/* Control Button */}
                <motion.div
                    className="flex justify-center"
                    whileHover={{ scale: 1.05 }}
                >
                    <button
                        onClick={restart}
                        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 
                            hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full 
                            shadow-lg flex items-center gap-2 transition-all duration-200"
                    >
                        <ShieldAlert className="w-5 h-5" />
                        New Match
                    </button>
                </motion.div>

                {/* Game Modals */}
                <Suspense 
                    fallback={
                        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
                            <div className="bg-white p-4 rounded-lg shadow-lg">
                                Loading...
                            </div>
                        </div>
                    }
                >
                    {(state.showHalftimeModal || (state.isGameOver && showGameOverModal)) && (
                        <GameModals state={state} />
                    )}
                </Suspense>

                {/* Recent Action */}
                <RecentAction state={state} />
            </div>
        </div>
    );
};

export default SoccerScoreboard;