import { useCallback } from 'react';
import { GameState, GameAction, GameDispatchAction } from '../types/game';

export const useGameActions = (
    state: GameState,
    dispatch: React.Dispatch<GameDispatchAction>
) => {
    const generateGameAction = useCallback(() => {
        const actionTypes = [
            'goal', 'yellow_card', 'red_card', 'penalty', 'corner', 'foul',
            'substitution', 'injury', 'offside', 'save',
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
        const player = state.players[Math.floor(Math.random() * state.players.length)];

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

        if (type === 'injury') {
            dispatch({
                type: 'UPDATE_ADDED_TIME',
                payload: Math.min(5, state.addedTime + Math.floor(Math.random() * 2) + 1)
            });
        }

        dispatch({ type: 'ADD_ACTION', payload: action });
        dispatch({ type: 'SET_RECENT_ACTION', payload: action });
        setTimeout(() => dispatch({ type: 'SET_RECENT_ACTION', payload: null }), 3000);
    }, [state, dispatch]);

    return { generateGameAction };
};