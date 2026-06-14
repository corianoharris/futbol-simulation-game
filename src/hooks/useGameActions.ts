import { useCallback } from 'react';
import { GameState, GameAction, GameDispatchAction } from '../types/game';

export const useGameActions = (
    state: GameState,
    dispatch: React.Dispatch<GameDispatchAction>
) => {
    const generateGameAction = useCallback(() => {
        if (state.players.length === 0) return;

        const actionTypes = [
            'goal', 'yellow_card', 'red_card', 'penalty', 'corner', 'foul',
            'substitution', 'injury', 'offside', 'save', 'possession_change',
            'shot_on_target', 'shot_off_target'
        ] as const;

        const weights = [5, 8, 2, 3, 12, 15, 8, 5, 10, 12, 20, 10, 8];
        let random = Math.random() * weights.reduce((a, b) => a + b, 0);
        let typeIndex = 0;

        for (let i = 0; i < weights.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                typeIndex = i;
                break;
            }
        }

        const type = actionTypes[typeIndex];
        const team = Math.random() > state.possessionHome / 100 ? 'away' : 'home';
        const designatedGK = team === 'home' ? state.homeGoalkeeper : state.awayGoalkeeper;
        const goalkeeper = designatedGK || state.players[Math.floor(Math.random() * state.players.length)];
        const player = type === 'save'
            ? goalkeeper
            : state.players[Math.floor(Math.random() * state.players.length)];

        const action: GameAction = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            team,
            player,
            minute: state.gameTime
        };

        if (type === 'substitution') {
            action.replacementPlayer = state.players[Math.floor(Math.random() * state.players.length)];
        }

        // Yellow card: track per player per team; 2nd yellow = sending off
        if (type === 'yellow_card') {
            const cardKey = `${team}:${player}`;
            const prev = state.playerYellowCards[cardKey] || 0;
            dispatch({ type: 'UPDATE_YELLOW_CARDS', payload: { key: cardKey, count: prev + 1 } });
            if (prev >= 1) {
                dispatch({ type: 'UPDATE_PLAYER_COUNT', payload: { team } });
            }
        }

        if (type === 'red_card') {
            dispatch({ type: 'UPDATE_PLAYER_COUNT', payload: { team } });
            if (player === goalkeeper) {
                // GK sent off — positional switch to a field player, no sub slot used
                const fieldPlayers = state.players.filter(p => p !== goalkeeper);
                const emergencyGK = fieldPlayers[Math.floor(Math.random() * fieldPlayers.length)];
                if (emergencyGK) {
                    action.replacementPlayer = emergencyGK;
                    dispatch({ type: 'SET_GOALKEEPER', payload: { team, player: emergencyGK } });
                }
            }
        }

        if (type === 'injury') {
            const subsUsed = team === 'home' ? state.homeSubsUsed : state.awaySubsUsed;

            if (player === goalkeeper) {
                if (subsUsed < 5) {
                    // GK injured, sub available — replace GK, count unchanged
                    const fieldPlayers = state.players.filter(p => p !== goalkeeper);
                    const newGK = fieldPlayers[Math.floor(Math.random() * fieldPlayers.length)];
                    if (newGK) {
                        action.replacementPlayer = newGK;
                        dispatch({ type: 'SET_GOALKEEPER', payload: { team, player: newGK } });
                        dispatch({ type: 'UPDATE_SUBS_USED', payload: { team } });
                    }
                } else {
                    // GK injured, no subs left — field player becomes emergency GK, count drops
                    dispatch({ type: 'UPDATE_PLAYER_COUNT', payload: { team } });
                    const fieldPlayers = state.players.filter(p => p !== goalkeeper);
                    const emergencyGK = fieldPlayers[Math.floor(Math.random() * fieldPlayers.length)];
                    if (emergencyGK) {
                        action.replacementPlayer = emergencyGK;
                        dispatch({ type: 'SET_GOALKEEPER', payload: { team, player: emergencyGK } });
                    }
                }
            } else {
                if (subsUsed < 5) {
                    // Regular player injured, sub available — substitute in, count unchanged
                    const others = state.players.filter(p => p !== player);
                    const sub = others[Math.floor(Math.random() * others.length)];
                    if (sub) {
                        action.replacementPlayer = sub;
                        dispatch({ type: 'UPDATE_SUBS_USED', payload: { team } });
                    }
                } else {
                    // No subs left — player leaves, count drops
                    dispatch({ type: 'UPDATE_PLAYER_COUNT', payload: { team } });
                }
            }
        }

        if (type === 'penalty') {
            const outcomes: ('blocked' | 'missed' | 'scored')[] = ['blocked', 'missed', 'scored'];
            action.subAction = outcomes[Math.floor(Math.random() * outcomes.length)];

            if (action.subAction === 'scored') {
                dispatch({
                    type: 'UPDATE_SCORE',
                    payload: {
                        homeScore: team === 'home' ? state.homeScore + 1 : state.homeScore,
                        awayScore: team === 'away' ? state.awayScore + 1 : state.awayScore
                    }
                });
            }
        } else if (type === 'goal') {
            dispatch({
                type: 'UPDATE_SCORE',
                payload: {
                    homeScore: team === 'home' ? state.homeScore + 1 : state.homeScore,
                    awayScore: team === 'away' ? state.awayScore + 1 : state.awayScore
                }
            });
        }

        if (type === 'possession_change') {
            const shift = Math.floor(Math.random() * 5) + 1;
            const newPossession = team === 'home'
                ? Math.min(80, state.possessionHome + shift)
                : Math.max(20, state.possessionHome - shift);
            dispatch({ type: 'UPDATE_POSSESSION', payload: newPossession });
        }

        if (type === 'injury') {
            dispatch({ type: 'UPDATE_ADDED_TIME', payload: Math.min(5, state.addedTime + Math.floor(Math.random() * 2) + 1) });
        }

        dispatch({ type: 'ADD_ACTION', payload: action });
        dispatch({ type: 'SET_RECENT_ACTION', payload: action });
        setTimeout(() => dispatch({ type: 'SET_RECENT_ACTION', payload: null }), 3000);
    }, [state, dispatch]);

    return { generateGameAction };
};