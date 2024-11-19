import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { GameState } from '../types/game';

type ScoreDisplayProps = {
    state: GameState;
};

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ state }) => (
    <div className="relative grid grid-cols-3 gap-4 text-white">
        {/* Home Team */}
        <motion.div
            className="flex flex-col items-center"
            animate={{
                scale: state.homeScore > state.awayScore && state.isGameOver ? [1, 1.1, 1] : 1,
                textShadow: state.flashWinner === 'home' ? "0 0 8px rgba(255,255,255,0.8)" : "none"
            }}
        >
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-2 rounded-lg mb-2">
                <Shield className="w-8 h-8" />
            </div>
            <span className="text-xl font-semibold">FLBK</span>
            <span className="text-5xl font-bold mt-2">{state.homeScore}</span>
        </motion.div>

        {/* Center / Time */}
        <div className="flex flex-col items-center justify-center">
            <div className="bg-gray-800/50 px-4 py-2 rounded-full">
                <span className="text-2xl">
                    {state.gameTime < 10 ? `0${state.gameTime}` : state.gameTime}:00
                    {state.addedTime > 0 && (
                        <span className="text-red-400 ml-1">+{state.addedTime}</span>
                    )}
                </span>
            </div>
        </div>

        {/* Away Team */}
        <motion.div
            className="flex flex-col items-center"
            animate={{
                scale: state.awayScore > state.homeScore && state.isGameOver ? [1, 1.1, 1] : 1,
                textShadow: state.flashWinner === 'away' ? "0 0 8px rgba(255,255,255,0.8)" : "none"
            }}
        >
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-2 rounded-lg mb-2">
                <Shield className="w-8 h-8" />
            </div>
            <span className="text-xl font-semibold">DOM</span>
            <span className="text-5xl font-bold mt-2">{state.awayScore}</span>
        </motion.div>
    </div>
);

export default ScoreDisplay;