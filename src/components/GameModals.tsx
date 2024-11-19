import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { GameState } from '../types/game';

type GameModalsProps = {
    state: GameState;
};

 const GameModals: React.FC<GameModalsProps> = ({ state }) => (
    <>
        <AnimatePresence>
            {state.showHalftimeModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 text-black flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        className="bg-white p-8 rounded-xl shadow-2xl"
                    >
                        <div className="text-center">
                            <h2 className="text-3xl font-bold mb-4">Halftime</h2>
                            <div className="text-2xl mb-6">
                                WOL {state.homeScore} - {state.awayScore} SOU
                            </div>
                            <motion.div
                                className="text-black"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                Second half starting in 3 seconds...
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {state.isGameOver && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center"
                >
                    <motion.div
                        initial={{ scale: 0.8, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 20 }}
                        className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full"
                    >
                        <div className="text-center text-black">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="inline-block mb-4"
                            >
                                <Trophy className="w-12 h-12 text-yellow-400" />
                            </motion.div>
                            <h2 className="text-3xl font-bold mb-4">Full Time</h2>
                            <div className="text-2xl mb-6">
                                WOL {state.homeScore} - {state.awayScore} SOU
                            </div>
                            <motion.div
                                className="text-xl font-semibold"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                {state.homeScore > state.awayScore ? 'Wolves Win!' :
                                    state.awayScore > state.homeScore ? 'Southampton Win!' :
                                        'It\'s a Draw!'}
                            </motion.div>

                            {/* Match Statistics */}
                            <div className="mt-6 text-left text-black">
                                <h3 className="text-lg font-semibold mb-2">Match Statistics</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Possession</span>
                                        <span>WOL {Math.floor(state.possessionHome)}% - {100 - Math.floor(state.possessionHome)}% SOU</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shots</span>
                                        <span>
                                            {state.actions.filter(a =>
                                                a.team === 'home' &&
                                                (a.type === 'shot_on_target' || a.type === 'shot_off_target')
                                            ).length} - {
                                                state.actions.filter(a =>
                                                    a.team === 'away' &&
                                                    (a.type === 'shot_on_target' || a.type === 'shot_off_target')
                                                ).length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Corners</span>
                                        <span>
                                            {state.actions.filter(a => a.team === 'home' && a.type === 'corner').length} - {
                                                state.actions.filter(a => a.team === 'away' && a.type === 'corner').length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Fouls</span>
                                        <span>
                                            {state.actions.filter(a => a.team === 'home' && a.type === 'foul').length} - {
                                                state.actions.filter(a => a.team === 'away' && a.type === 'foul').length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    </>
);

export default GameModals;