// SoccerScoreboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { createServer } from 'miragejs';
import { faker } from '@faker-js/faker';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Shield, Trophy, Activity, ShieldAlert } from 'lucide-react';

// Initialize Mirage server
if (typeof window !== 'undefined')
{
    createServer({
        routes()
        {
            this.get("/api/players", () =>
            {
                return Array.from({ length: 22 }, () => faker.person.lastName());
            });
        },
    });
}

// Types
type GameAction = {
    id: string;
    type: 'goal' | 'yellow_card' | 'red_card' | 'penalty' | 'corner' | 'foul' |
    'substitution' | 'injury' | 'offside' | 'save' | 'possession_change' |
    'shot_on_target' | 'shot_off_target';
    team: 'home' | 'away';
    player: string;
    minute: number;
    subAction?: 'blocked' | 'missed' | 'scored';
    replacementPlayer?: string;
};

// Utility functions
const getActionEmoji = (type: GameAction['type']) =>
{
    const emojiMap = {
        goal: '⚽',
        yellow_card: '🟨',
        red_card: '🟥',
        penalty: '🎯',
        corner: '🚩',
        foul: '👊',
        substitution: '🔄',
        injury: '🚑',
        offside: '🚫',
        save: '🧤',
        possession_change: '↔️',
        shot_on_target: '🎯',
        shot_off_target: '↗️'
    };
    return emojiMap[type] || '▪️';
};

const getActionClass = (type: GameAction['type']) =>
{
    const classMap = {
        goal: 'bg-green-100 text-green-600',
        yellow_card: 'bg-yellow-100 text-yellow-600',
        red_card: 'bg-red-100 text-red-600',
        penalty: 'bg-purple-100 text-purple-600',
        corner: 'bg-blue-100 text-blue-600',
        foul: 'bg-orange-100 text-orange-600',
        injury: 'bg-red-100 text-red-600',
        save: 'bg-cyan-100 text-cyan-600',
        default: 'bg-gray-100 text-gray-600',
        possession_change: 'bg-blue-100 text-blue-600',
        shot_on_target: 'bg-green-100 text-green-600',
        shot_off_target: 'bg-gray-100 text-gray-600',
        substitution: 'bg-purple-100 text-purple-600',
        offside: 'bg-orange-100 text-orange-600'
    };
    return classMap[type] || classMap.default;
};

const SoccerScoreboard = () =>
{
    // State definitions
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [gameTime, setGameTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [actions, setActions] = useState<GameAction[]>([]);
    const [players, setPlayers] = useState<string[]>([]);
    const [isHalftime, setIsHalftime] = useState(false);
    const [showHalftimeModal, setShowHalftimeModal] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [flashWinner, setFlashWinner] = useState<'home' | 'away' | 'both' | null>(null);
    const [possessionHome, setPossessionHome] = useState(50);
    const [recentAction, setRecentAction] = useState<GameAction | null>(null);
    const [addedTime, setAddedTime] = useState(0);

    // Fetch players on mount
    useEffect(() =>
    {
        fetch("/api/players")
            .then((res) => res.json())
            .then((data) => setPlayers(data));
    }, []);

    const generateGameAction = useCallback(() =>
    {
        const actionTypes: GameAction['type'][] = [
            'goal', 'yellow_card', 'red_card', 'penalty', 'corner', 'foul',
            'substitution', 'injury', 'offside', 'save', 'possession_change',
            'shot_on_target', 'shot_off_target'
        ];

        const weights = [5, 8, 2, 3, 12, 15, 8, 5, 10, 12, 20, 10, 8];
        let random = Math.random() * weights.reduce((a, b) => a + b, 0);
        let typeIndex = 0;

        for (let i = 0; i < weights.length; i++)
        {
            random -= weights[i];
            if (random <= 0)
            {
                typeIndex = i;
                break;
            }
        }

        const type = actionTypes[typeIndex];
        const team = Math.random() > possessionHome / 100 ? 'away' : 'home';
        const player = players[Math.floor(Math.random() * players.length)];

        const action: GameAction = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            team,
            player,
            minute: gameTime
        };

        // Handle special action types
        if (type === 'substitution')
        {
            action.replacementPlayer = players[Math.floor(Math.random() * players.length)];
        }

        if (type === 'possession_change')
        {
            setPossessionHome(prev =>
            {
                const change = Math.random() * 10 - 5;
                return Math.max(30, Math.min(70, prev + change));
            });
        }

        if (type === 'penalty')
        {
            const outcomes: ('blocked' | 'missed' | 'scored')[] = ['blocked', 'missed', 'scored'];
            action.subAction = outcomes[Math.floor(Math.random() * outcomes.length)];

            if (action.subAction === 'scored')
            {
                if (team === 'home')
                {
                    setHomeScore(prev => prev + 1);
                } else
                {
                    setAwayScore(prev => prev + 1);
                }
            }
        } else if (type === 'goal')
        {
            if (team === 'home')
            {
                setHomeScore(prev => prev + 1);
            } else
            {
                setAwayScore(prev => prev + 1);
            }
        }

        if (type === 'injury')
        {
            setAddedTime(prev => Math.min(5, prev + Math.floor(Math.random() * 2) + 1));
        }

        setActions(prev => [...prev, action]);
        setRecentAction(action);
        setTimeout(() => setRecentAction(null), 3000);
    }, [gameTime, players, possessionHome]);

    // Game timer effect
    useEffect(() =>
    {
        let interval: NodeJS.Timeout;

        if (isPlaying && !isHalftime)
        {
            interval = setInterval(() =>
            {
                setGameTime(prev =>
                {
                    if (prev === Math.floor(0.5 * 44))
                    {
                        setIsHalftime(true);
                        setIsPlaying(false);
                        
                        return prev + 1;
                    }
                    if (prev === 90)
                    {
                        if (addedTime > 0)
                        {
                            setAddedTime(prev => prev - 1);
                            if (Math.random() < 0.3) generateGameAction();
                            return prev;
                        }
                        setIsPlaying(false);
                        setIsGameOver(true);
                        return prev;
                    }
                    if (Math.random() < 0.3) generateGameAction();
                    return prev + 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isPlaying, isHalftime, players, addedTime, generateGameAction]);

    // Halftime effect
    useEffect(() =>
    {
        if (isHalftime)
        {
            setShowHalftimeModal(true);

            // Close modal after 2.5 seconds (before game resumes)
            const modalTimer = setTimeout(() =>
            {
                setShowHalftimeModal(false);
            }, 2500);

            // Resume game after 3 seconds
            const gameTimer = setTimeout(() =>
            {
                setIsHalftime(false);
                setIsPlaying(true);
                setGameTime(45);
            }, 3000);

            return () =>
            {
                clearTimeout(modalTimer);
                clearTimeout(gameTimer);
            };
        }
    }, [isHalftime]);

    // Game over effect
    useEffect(() =>
    {
        if (isGameOver)
        {
            if (homeScore > awayScore) setFlashWinner('home');
            else if (awayScore > homeScore) setFlashWinner('away');
            else setFlashWinner('both');

            setTimeout(() => setFlashWinner(null), 3000);
        }
    }, [isGameOver, homeScore, awayScore]);

    const restart = () =>
    {
        setHomeScore(0);
        setAwayScore(0);
        setGameTime(0);
        setIsPlaying(true);
        setActions([]);
        setIsHalftime(false);
        setIsGameOver(false);
        setFlashWinner(null);
        setPossessionHome(50);
        setAddedTime(0);
        setRecentAction(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Main Scoreboard */}
                <motion.div
                    className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl p-8 shadow-xl"
                    animate={{ scale: flashWinner ? [1, 1.02, 1] : 1 }}
                    transition={{ duration: 0.5, repeat: flashWinner ? Infinity : 0 }}
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
                    <div className="relative grid grid-cols-3 gap-4 text-white">
                        {/* Home Team */}
                        <motion.div
                            className="flex flex-col items-center"
                            animate={{
                                scale: homeScore > awayScore && isGameOver ? [1, 1.1, 1] : 1,
                                textShadow: flashWinner === 'home' ? "0 0 8px rgba(255,255,255,0.8)" : "none"
                            }}
                        >
                            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-2 rounded-lg mb-2">
                                <Shield className="w-8 h-8" />
                            </div>
                            <span className="text-xl font-semibold">WOL</span>
                            <span className="text-5xl font-bold mt-2">{homeScore}</span>
                        </motion.div>

                        {/* Center / Time */}
                        <div className="flex flex-col items-center justify-center">
                            <div className="bg-gray-800/50 px-4 py-2 rounded-full flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-400" />
                                <span className="text-2xl">
                                    {gameTime < 10 ? `0${gameTime}` : gameTime}:00
                                    {addedTime > 0 && (
                                        <span className="text-red-400 ml-1">+{addedTime}</span>
                                    )}
                                </span>
                            </div>

                            {/* Possession Bar */}
                            <div className="w-full mt-4">
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                                        animate={{ width: `${possessionHome}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span>{Math.round(possessionHome)}%</span>
                                    <span>{Math.round(100 - possessionHome)}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Away Team */}
                        <motion.div
                            className="flex flex-col items-center"
                            animate={{
                                scale: awayScore > homeScore && isGameOver ? [1, 1.1, 1] : 1,
                                textShadow: flashWinner === 'away' ? "0 0 8px rgba(255,255,255,0.8)" : "none"
                            }}
                        >
                            <div className="bg-gradient-to-r from-red-500 to-red-600 p-2 rounded-lg mb-2">
                                <Shield className="w-8 h-8" />
                            </div>
                            <span className="text-xl font-semibold">SOU</span>
                            <span className="text-5xl font-bold mt-2">{awayScore}</span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Match Events */}
                <div className="grid grid-cols-2 gap-6">
                    {['home', 'away'].map((side) => (
                        <motion.div
                            key={side}
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
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {actions
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
                                                        <span className="text-sm font-medium">`{action.minute}-{action.type}`</span>
                                                        <span className="text-sm">{action.player}</span>
                                                    </div>
                                                    {action.subAction && (
                                                        <span className="text-xs text-gray-500">({action.subAction})</span>
                                                    )}
                                                    {action.replacementPlayer && (
                                                        <span className="text-xs text-gray-500">
                                                            → {action.replacementPlayer}
                                                        </span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Match Timeline */}
                <motion.div
                    className="bg-white rounded-xl p-6 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Match Progress
                    </h3>
                    <div className="relative">
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                                animate={{ width: `${(gameTime / 90) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                            <span>Kickoff</span>
                            <span className="relative">
                                Halftime
                                {isHalftime && (
                                    <motion.div
                                        className="absolute -top-2 w-full h-1 bg-yellow-400"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                )}
                            </span>
                            <span className="flex items-center gap-1">
                                Full Time
                                {addedTime > 0 && (
                                    <span className="text-xs text-red-500">+{addedTime}</span>
                                )}
                            </span>
                        </div>
                    </div>
                </motion.div>

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

                {/* Recent Action Popup */}
                <AnimatePresence>
                    {recentAction && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className="fixed bottom-4 right-4 bg-gradient-to-r from-gray-900 to-gray-800 
                        text-white p-4 rounded-lg shadow-xl border border-gray-700"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-full">
                                    {getActionEmoji(recentAction.type)}
                                </div>
                                <div>
                                    <div className="text-sm font-medium">{recentAction.minute}</div>
                                    <div className="text-base">
                                        {recentAction.player}
                                        {recentAction.type === 'substitution' && (
                                            <span className="text-gray-400 text-sm">
                                                {' '}↔️ {recentAction.replacementPlayer}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Halftime Modal */}
                <AnimatePresence>
                    {showHalftimeModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
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
                                        WOL {homeScore} - {awayScore} SOU
                                    </div>
                                    <motion.div
                                        className="text-gray-600"
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
                </AnimatePresence>

                {/* Game Over Modal */}
                <AnimatePresence>
                    {isGameOver && (
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
                                <div className="text-center">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="inline-block mb-4"
                                    >
                                        <Trophy className="w-12 h-12 text-yellow-400" />
                                    </motion.div>
                                    <h2 className="text-3xl font-bold mb-4">Full Time</h2>
                                    <div className="text-2xl mb-6">
                                        WOL {homeScore} - {awayScore} SOU
                                    </div>
                                    <motion.div
                                        className="text-xl font-semibold"
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        {homeScore > awayScore ? 'Wolves Win!' :
                                            awayScore > homeScore ? 'Southampton Win!' :
                                                'It\'s a Draw!'}
                                    </motion.div>

                                    {/* Match Statistics */}
                                    <div className="mt-6 text-left">
                                        <h3 className="text-lg font-semibold mb-2">Match Statistics</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span>Possession</span>
                                                <span>{possessionHome}% - {100 - possessionHome}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Shots</span>
                                                <span>
                                                    {actions.filter(a =>
                                                        a.team === 'home' &&
                                                        (a.type === 'shot_on_target' || a.type === 'shot_off_target')
                                                    ).length} - {
                                                        actions.filter(a =>
                                                            a.team === 'away' &&
                                                            (a.type === 'shot_on_target' || a.type === 'shot_off_target')
                                                        ).length}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Corners</span>
                                                <span>
                                                    {actions.filter(a => a.team === 'home' && a.type === 'corner').length} - {
                                                        actions.filter(a => a.team === 'away' && a.type === 'corner').length}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Fouls</span>
                                                <span>
                                                    {actions.filter(a => a.team === 'home' && a.type === 'foul').length} - {
                                                        actions.filter(a => a.team === 'away' && a.type === 'foul').length}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SoccerScoreboard;
