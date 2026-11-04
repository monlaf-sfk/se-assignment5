// @vitest-environment jsdom
// E14 — UI / integration test: real App + real SAMPLE_ROOMS, fixed now = 10:30.
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

afterEach(cleanup);

const PLACEHOLDER = /Select a room and enter a time range/;
const roomButton = (name: RegExp) => screen.getByRole('button', { name });
const setTime = (current: string, next: string) =>
  fireEvent.change(screen.getByDisplayValue(current), { target: { value: next } });

describe('App — filter → select → check → switch room', () => {
  test('F1/F2/F3/F5 + AC4: result follows the selected room', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Filter: 10 attendees + projector (F1, F2)
    const attendees = screen.getByLabelText('Attendees');
    await user.clear(attendees);
    await user.type(attendees, '10');
    await user.click(screen.getByRole('checkbox', { name: 'projector' }));

    expect(screen.getByText('3 of 5 rooms match')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Library Study Room 201/ })).toBeNull(); // 8 seats, no projector
    expect((roomButton(/Science Seminar Room 340/) as HTMLButtonElement).disabled).toBe(true); // F3

    // Select Engineering Lab 110, 13:00–14:00 overlaps "Robotics Workshop" 12:00–14:00 (AC4)
    await user.click(roomButton(/Engineering Lab 110/));
    setTime('11:00', '13:00');
    setTime('12:00', '14:00');
    await user.click(screen.getByRole('button', { name: 'Check' }));
    expect(screen.getByText('Unavailable')).toBeTruthy();
    expect(screen.getByText(/Robotics Workshop/)).toBeTruthy();

    // Switch room → old verdict disappears (F5)
    await user.click(roomButton(/Arts Studio 05/));
    expect(screen.queryByText('Unavailable')).toBeNull();
    expect(screen.getByText(PLACEHOLDER)).toBeTruthy();

    // Check again → uses Arts Studio 05 bookings (840–900 only touches the request)
    await user.click(screen.getByRole('button', { name: 'Check' }));
    expect(screen.getByText('Available')).toBeTruthy();
    expect(screen.getByText(/\(60 min\)/)).toBeTruthy();
  });

  test('F4: impossible filter shows the empty state', async () => {
    const user = userEvent.setup();
    render(<App />);

    const attendees = screen.getByLabelText('Attendees');
    await user.clear(attendees);
    await user.type(attendees, '50');

    expect(screen.getByText('0 of 5 rooms match')).toBeTruthy();
    expect(screen.getByText('No rooms match your requirements')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Engineering Lab 110/ })).toBeNull();
  });

  test('F5: filter that hides the selected room clears selection and result', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Default selection Library 201, 11:00–12:00 → Available
    await user.click(screen.getByRole('button', { name: 'Check' }));
    expect(screen.getByText('Available')).toBeTruthy();

    // Library 201 has no projector → hidden, result cleared
    await user.click(screen.getByRole('checkbox', { name: 'projector' }));
    expect(screen.queryByRole('button', { name: /Library Study Room 201/ })).toBeNull();
    expect(screen.queryByText('Available')).toBeNull();
    expect(screen.getByText(PLACEHOLDER)).toBeTruthy();
  });
});
