import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { GameState } from '../types/game';

type MatchTimelineProps = {
    state: GameState;
};

export const MatchTimeline: React.FC<MatchTimelineProps> = ({ state }) => (
    <motion.div
        className="bg-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
    >
        <h3 className="font-bold text-black mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Match Progress
        </h3>
        <div className="relative">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                    animate={{ width: `${(state.gameTime / 90) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
            <div className="flex justify-between mt-2 text-sm text-black">
                <span>Kickoff</span>
                <span className="relative">
                    Halftime
                    {state.isHalftime && (
                        <motion.div
                            className="absolute -top-2 w-full h-1 bg-yellow-400"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                    )}
                </span>
                <span className="flex items-center gap-1">
                    Full Time
                    {state.addedTime > 0 && (
                        <span className="text-xs text-red-500">+{state.addedTime}</span>
                    )}
                </span>
            </div>
        </div>
    </motion.div>
);