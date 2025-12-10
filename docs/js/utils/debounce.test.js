import { describe, it, expect, beforeEach, vi } from 'vitest';
import { debounce, debounceWithImmediate, throttle } from './debounce.js';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should delay function execution', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should cancel previous calls when called multiple times', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    vi.advanceTimersByTime(300);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to the debounced function', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn('test', 123);
    vi.advanceTimersByTime(300);

    expect(mockFn).toHaveBeenCalledWith('test', 123);
  });

  it('should preserve context (this)', () => {
    const obj = {
      value: 42,
      fn: vi.fn(function() {
        return this.value;
      })
    };

    obj.debouncedFn = debounce(obj.fn, 300);
    obj.debouncedFn();

    vi.advanceTimersByTime(300);
    expect(obj.fn).toHaveBeenCalled();
  });

  it('should use default wait time of 300ms', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn);

    debouncedFn();
    vi.advanceTimersByTime(299);
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

describe('debounceWithImmediate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should execute immediately on first call', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounceWithImmediate(mockFn, 300);

    debouncedFn();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should not execute again until wait time passes', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounceWithImmediate(mockFn, 300);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(300);
    debouncedFn();

    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should execute immediately on first call', () => {
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 300);

    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should throttle subsequent calls', () => {
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 300);

    throttledFn();
    throttledFn();
    throttledFn();

    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(300);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should pass latest arguments', () => {
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 300);

    throttledFn('first');
    throttledFn('second');
    throttledFn('third');

    expect(mockFn).toHaveBeenCalledWith('first');

    vi.advanceTimersByTime(300);
    expect(mockFn).toHaveBeenCalledWith('third');
  });
});
