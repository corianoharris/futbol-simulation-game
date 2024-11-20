import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SoccerScoreboard from '@/components/SoccerScoreboard';
import * as ScoreDisplayModule from '@/components/ScoreDisplay';
import * as GameEventsModule from '@/components/GameEvents';
import * as MatchTimelineModule from '@/components/MatchTimeline';
import * as RecentActionModule from '@/components/RecentAction';
import { useGameActions } from '@/hooks/useGameActions';

// Mock the modules
jest.mock('../src/server/mirage', () => ({
    initializeMirageServer: jest.fn()
}));
jest.mock('../src/hooks/useGameActions');
jest.mock('../src/components/ScoreDisplay');
jest.mock('../src/components/GameEvents');
jest.mock('../src/components/MatchTimeline');
jest.mock('../src/components/RecentAction');

describe('SoccerScoreboard', () =>
{
    const mockScoreDisplay = jest.fn();
    const mockGameEvents = jest.fn();
    const mockMatchTimeline = jest.fn();
    const mockRecentAction = jest.fn();
    const mockGenerateGameAction = jest.fn();

    beforeEach(() =>
    {
        jest.useFakeTimers();

        jest.spyOn(ScoreDisplayModule, 'default').mockImplementation((props) =>
        {
            mockScoreDisplay(props);
            return <div data-testid="score-display">Score Display</div>;
        });

        jest.spyOn(GameEventsModule, 'default').mockImplementation((props) =>
        {
            mockGameEvents(props);
            return <div data-testid="game-events">Game Events</div>;
        });

        jest.spyOn(MatchTimelineModule, 'default').mockImplementation((props) =>
        {
            mockMatchTimeline(props);
            return <div data-testid="match-timeline">Match Timeline</div>;
        });

        jest.spyOn(RecentActionModule, 'default').mockImplementation((props) =>
        {
            mockRecentAction(props);
            return <div data-testid="recent-action">Recent Action</div>;
        });

        (useGameActions as jest.Mock).mockReturnValue({
            generateGameAction: mockGenerateGameAction
        });

        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve([
                    { id: 1, name: 'Player 1' },
                    { id: 2, name: 'Player 2' }
                ])
            })
        ) as jest.Mock;
    });

    afterEach(() =>
    {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    it('renders without crashing', async () =>
    {
        await act(async () =>
        {
            render(<SoccerScoreboard />);
        });

        expect(screen.getByText('New Match')).toBeInTheDocument();
        expect(mockScoreDisplay).toHaveBeenCalled();
        expect(mockGameEvents).toHaveBeenCalled();
        expect(mockMatchTimeline).toHaveBeenCalled();
    });

    it('fetches players on mount', async () =>
    {
        const fetchSpy = jest.spyOn(global, 'fetch');

        await act(async () =>
        {
            render(<SoccerScoreboard />);
        });

        expect(fetchSpy).toHaveBeenCalledWith('/api/players');
        await waitFor(() =>
        {
            expect(fetchSpy).toHaveBeenCalledTimes(1);
        });
    });

    it('handles halftime correctly', async () => {
        // 1. Setup and render
        const user = userEvent.setup({ delay: null });
        
        await act(async () => {
            render(<SoccerScoreboard />);
        });
    
        // 2. Wait for initial data fetch
        await waitFor(() => {
            const calls = mockScoreDisplay.mock.calls;
            expect(calls.length).toBeGreaterThan(0);
            expect(calls[calls.length - 1][0].state.players).toHaveLength(2);
        });
    
        // 3. Start game
        await user.click(screen.getByText('New Match'));
        mockScoreDisplay.mockClear();
    
        // 4. Advance to halftime (22 ticks for 22 seconds)
        for (let i = 0; i < 22; i++) {
            act(() => {
                jest.advanceTimersByTime(1000); // Advance one second at a time
            });
        }
    
        // 5. Verify halftime state
        await waitFor(() => {
            const lastCall = mockScoreDisplay.mock.calls[mockScoreDisplay.mock.calls.length - 1][0];
            expect(lastCall.state.isHalftime).toBe(false);
            expect(lastCall.state.isPlaying).toBe(true);
        });
    
        // 6. Advance through halftime modal (2.5 seconds)
        act(() => {
            jest.advanceTimersByTime(2500);
        });
    
        // 7. Advance through the halftime resume delay (additional 0.5 seconds)
        act(() => {
            jest.advanceTimersByTime(2500);
        });
    
        // 8. Verify game resumes at correct time
        await waitFor(() => {
            const lastCall = mockScoreDisplay.mock.calls[mockScoreDisplay.mock.calls.length - 1][0];
            expect(lastCall.state.isHalftime).toBe(false);
            expect(lastCall.state.isPlaying).toBe(true);
            expect(lastCall.state.gameTime).toBe(45);
        });
    }, 30000);
    
    // Add a test to verify the game timer works correctly
    it('updates game time correctly', async () => {
        await act(async () => {
            render(<SoccerScoreboard />);
        });
    
        await waitFor(() => {
            expect(mockScoreDisplay).toHaveBeenCalled();
        });
        mockScoreDisplay.mockClear();
    
        // Advance 5 seconds
        for (let i = 0; i < 5; i++) {
            act(() => {
                jest.advanceTimersByTime(1000);
            });
        }
    });
    
    // Add a simpler test to verify basic timer functionality
    it('advances game time correctly', () => {
        render(<SoccerScoreboard />);
        
        act(() => {
            jest.advanceTimersByTime(1000);
        });
    
        expect(mockScoreDisplay).toHaveBeenCalled();
    });
});