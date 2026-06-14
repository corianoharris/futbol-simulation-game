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
    addedTime: 0,
    homePlayersCount: 11,
    awayPlayersCount: 11,
    playerYellowCards: {},
    homeGoalkeeper: '',
    awayGoalkeeper: '',
    homeSubsUsed: 0,
    awaySubsUsed: 0
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
                players: action.payload,
                homeGoalkeeper: action.payload[0] ?? '',
                awayGoalkeeper: action.payload[26] ?? '',
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
        case 'UPDATE_PLAYER_COUNT':
            return {
                ...state,
                homePlayersCount: action.payload.team === 'home'
                    ? Math.max(7, state.homePlayersCount - 1)
                    : state.homePlayersCount,
                awayPlayersCount: action.payload.team === 'away'
                    ? Math.max(7, state.awayPlayersCount - 1)
                    : state.awayPlayersCount,
            };
        case 'SET_GOALKEEPER':
            return {
                ...state,
                homeGoalkeeper: action.payload.team === 'home' ? action.payload.player : state.homeGoalkeeper,
                awayGoalkeeper: action.payload.team === 'away' ? action.payload.player : state.awayGoalkeeper,
            };
        case 'UPDATE_SUBS_USED':
            return {
                ...state,
                homeSubsUsed: action.payload.team === 'home' ? state.homeSubsUsed + 1 : state.homeSubsUsed,
                awaySubsUsed: action.payload.team === 'away' ? state.awaySubsUsed + 1 : state.awaySubsUsed,
            };
        case 'UPDATE_YELLOW_CARDS':
            return {
                ...state,
                playerYellowCards: {
                    ...state.playerYellowCards,
                    [action.payload.key]: action.payload.count,
                },
            };
        case 'RESET_GAME':
            return {
                ...initialState,
                players: state.players,
                homeGoalkeeper: state.homeGoalkeeper,
                awayGoalkeeper: state.awayGoalkeeper,
                isPlaying: true
            };
            // homeSubsUsed / awaySubsUsed intentionally reset to 0 via initialState spread
        default:
            return state;
    }
};