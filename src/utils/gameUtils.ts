import { GameActionType } from '../types/game';

export const getActionEmoji = (type: GameActionType) =>
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
        possession_change: '<->',
        save: '🧤',
        shot_on_target: '🎯',
        shot_off_target: '↗️'
    };
    return emojiMap[type] || '▪️';
};

export const getActionClass = (type: GameActionType) =>
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
        default: 'bg-gray-100 text-black',
        possession_change: 'bg-indigo-100 text-indigo-500',
        shot_on_target: 'bg-green-100 text-green-600',
        shot_off_target: 'bg-gray-100 text-gray-600',
        substitution: 'bg-purple-100 text-purple-600',
        offside: 'bg-orange-100 text-orange-600'
    };
    return classMap[type] || classMap.default;
};

export const formatGameActionMinute = (minute: number) => `${minute}'`;

export const formatActionType = (type: string, subAction?: string) => {
    switch (type) {
        case 'goal':
            return 'scores!';
        case 'yellow_card':
            return 'booked';
        case 'red_card':
            return 'sent off';
        case 'penalty':
            if (subAction) {
                switch (subAction) {
                    case 'scored':
                        return 'scores penalty!';
                    case 'missed':
                        return 'misses penalty';
                    case 'blocked':
                        return 'penalty saved';
                    default:
                        return 'takes penalty';
                }
            }
            return 'wins penalty';
        case 'corner':
            return 'takes corner';
        case 'foul':
            return 'commits foul';
        case 'substitution':
            return 'substituted';
        case 'injury':
            return 'injured';
        case 'offside':
            return 'caught offside';
        case 'save':
            return 'makes save';
        case 'possession_change':
            return `wins possession`;
        case 'shot_on_target':
            return 'shot on target';
        case 'shot_off_target':
            return 'shoots wide';
        default:
            return type.toLowerCase().replace(/_/g, ' ');
    }
};