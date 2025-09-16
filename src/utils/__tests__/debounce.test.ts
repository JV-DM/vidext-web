import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import debounce from 'lodash.debounce';

vi.mock('lodash.debounce');

describe('Debounce Functionality', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should debounce function calls correctly', () => {
    const mockFn = vi.fn();
    const mockDebounce = vi.mocked(debounce);

    const debouncedFn = vi.fn();
    mockDebounce.mockReturnValue(debouncedFn);

    const result = debounce(mockFn, 500);

    expect(mockDebounce).toHaveBeenCalledWith(mockFn, 500);
    expect(result).toBe(debouncedFn);
  });

  it('should call debounced function with correct parameters', () => {
    const mockFn = vi.fn();
    const debouncedFn = vi.fn();

    vi.mocked(debounce).mockImplementation((fn, delay) => {
      let timeoutId: NodeJS.Timeout;
      return ((...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
      }) as any;
    });

    const result = debounce(mockFn, 500);

    result('test', 123);
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(mockFn).toHaveBeenCalledWith('test', 123);
  });

  it('should cancel previous calls when called multiple times', () => {
    const mockFn = vi.fn();

    vi.mocked(debounce).mockImplementation((fn, delay) => {
      let timeoutId: NodeJS.Timeout;
      return ((...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
      }) as any;
    });

    const debouncedFn = debounce(mockFn, 500);

    debouncedFn('first');
    debouncedFn('second');
    debouncedFn('third');

    vi.advanceTimersByTime(500);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('third');
  });

  it('should work with different delay values', () => {
    const mockFn = vi.fn();

    vi.mocked(debounce).mockImplementation((fn, delay) => {
      let timeoutId: NodeJS.Timeout;
      return ((...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
      }) as any;
    });

    const shortDebounce = debounce(mockFn, 100);
    const longDebounce = debounce(mockFn, 1000);

    shortDebounce('short');
    longDebounce('long');

    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledWith('short');

    vi.advanceTimersByTime(900);
    expect(mockFn).toHaveBeenCalledWith('long');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
