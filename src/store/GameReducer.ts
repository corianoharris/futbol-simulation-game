import { GameState, GameDispatchAction } from '../types/game';

export const initialState: GameState = {
    homeScore: 0,
    awayScore: 0,
    gameTime: 0,
    isPlaying: false,
    actions: [],
    players: [],
    isHalftime: false,
    showHalftimeModal: false,
    isGameOver: false,
    flashWinner: null,
    possessionHome: 50,
    recentAction: null,
    addedTime: 0
};

export const gameReducer = (state: GameState, action: GameDispatchAction): GameState => {
    switch (action.type) {
        case 'UPDATE_SCORE':
            return {
                ...state,
                homeScore: action.payload.homeScore ?? state.homeScore,
                awayScore: action.payload.awayScore ?? state.awayScore
            };
        case 'UPDATE_TIME':
            return {
                ...state,
                gameTime: action.payload
            };
        case 'ADD_ACTION':
            return {
                ...state,
                actions: [...state.actions, action.payload]
            };
        case 'SET_PLAYERS':
            return {
                ...state,
                players: action.payload
            };
        case 'SET_HALFTIME':
            return {
                ...state,
                isHalftime: action.payload
            };
        case 'SET_GAME_OVER':
            return {
                ...state,
                isGameOver: action.payload
            };
        case 'SET_FLASH_WINNER':
            return {
                ...state,
                flashWinner: action.payload
            };
        case 'UPDATE_POSSESSION':
            return {
                ...state,
                possessionHome: action.payload
            };
        case 'SET_RECENT_ACTION':
            return {
                ...state,
                recentAction: action.payload
            };
        case 'UPDATE_ADDED_TIME':
            return {
                ...state,
                addedTime: action.payload
            };
        case 'SET_PLAYING':
            return {
                ...state,
                isPlaying: action.payload
            };
        case 'SET_HALFTIME_MODAL':
            return {
                ...state,
                showHalftimeModal: action.payload
            };
        case 'RESET_GAME':
            return {
                ...initialState,
                players: state.players,
                isPlaying: true
            };
        default:
            return state;
    }
};