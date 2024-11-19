import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { GameState } from '../types/game';
import { getActionEmoji, getActionClass, formatActionType, formatGameActionMinute } from '../utils/gameUtils';

type GameEventsProps = {
    state: GameState;
    side: 'home' | 'away';
};

export const GameEvents: React.FC<GameEventsProps> = ({ state, side }) => (
    
    <motion.div
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ x: side === 'home' ? -20 : 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
    >
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4">
            <h3 className="font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {side === 'home' ? 'WOL' : 'SOU'} Events
            </h3>
        </div>
        <div className="p-4">
            <div className="space-y-3 text-gray-900 max-h-64 overflow-y-auto">
                {state.actions
                    .filter(action => action.team === side)
                    .reverse()
                    .map((action) => (
                        <motion.div
                            key={action.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                            <div className={`p-2 rounded-full ${getActionClass(action.type)}`}>
                                {getActionEmoji(action.type)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{formatGameActionMinute(action.minute)}</span>
                                    <span className="text-sm">{action.player}   {formatActionType(action.type.toLowerCase())}</span>
                                </div>
                                {action.subAction && (
                                        <span className="text-xs text-gray-500">({action.subAction})</span>
                                    )}
                                    {action.replacementPlayer && (
                                        <span className="text-xs text-gray-500">
                                            → {action.replacementPlayer} enters
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                </div>
            </div>
        </motion.div>
    );