import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App';
import {describe, expect, test, beforeEach, afterEach} from '@jest/globals';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          { uuid: '1', cityName: 'Darmstadt', count: 100 },
          { uuid: '2', cityName: 'Hamburg', count: 80 },
        ]),
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('App component', () => {
  beforeEach(async () => {
    await act(async () => {
      render(<App />);
    });
  });


  test('renders heading and search input', () => {
    expect(screen.getByRole('heading', { name: /city search/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search city/i)).toBeInTheDocument();
  });

  test('allows user to type in the search box', () => {
    const input = screen.getByPlaceholderText(/search city/i);
    fireEvent.change(input, { target: { value: 'Frankfurt' } });
    expect((input as HTMLInputElement).value).toBe('Frankfurt');
  });


  test('calls fetch Cities on search button', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response)
    ) as jest.Mock;

    const input = screen.getByPlaceholderText(/search city/i);
    const button = screen.getByRole('button', { name: /search/i });

    await act(async () => {
      fireEvent.change(input, { target: { value: 'London' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('search=London'));
    });
  });


  test('displays city "Frankfurt" after successful fetch', async () => {

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { uuid: '3', cityName: 'Frankfurt', count: 50 },
          ]),
      })
    ) as jest.Mock;

    const input = screen.getByPlaceholderText(/search city/i);
    const button = screen.getByRole('button', { name: /search/i });

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Frankfurt' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText(/frankfurt/i)).toBeInTheDocument();
    });
  });


});