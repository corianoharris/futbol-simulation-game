export type GameActionType = 'goal' | 'yellow_card' | 'red_card' | 'penalty' |
    'corner' | 'foul' | 'substitution' | 'injury' | 'offside' | 'save' | 'shot_on_target' | 'shot_off_target';

export type GameAction = {
    id: string;
    type: GameActionType;
    team: 'home' | 'away';
    player: string;
    minute: number;
    subAction?: 'blocked' | 'missed' | 'scored';
    replacementPlayer?: string;
};

export type GameState = {
    homeScore: number;
    awayScore: number;
    gameTime: number;
    isPlaying: boolean;
    actions: GameAction[];
    players: string[];
    isHalftime: boolean;
    showHalftimeModal: boolean;
    isGameOver: boolean;
    flashWinner: 'home' | 'away' | 'both' | null;
    possessionHome: number;
    recentAction: GameAction | null;
    addedTime: number;
};

export type GameDispatchAction = {
    type: 'UPDATE_SCORE' | 'UPDATE_TIME' | 'ADD_ACTION' | 'SET_PLAYERS' |
    'SET_HALFTIME' | 'SET_GAME_OVER' | 'SET_FLASH_WINNER' |
    'UPDATE_POSSESSION' | 'SET_RECENT_ACTION' | 'UPDATE_ADDED_TIME' |
    'RESET_GAME' | 'SET_PLAYING' | 'SET_HALFTIME_MODAL';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any 
    payload?: any;
};
