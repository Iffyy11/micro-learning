/**
 * Tests for state store
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { StateStore, stateUtils } from '../store/state.js';

describe('StateStore', () => {
  let store;

  beforeEach(() => {
    store = new StateStore({ count: 0, items: [] });
  });

  describe('getState', () => {
    it('should return current state', () => {
      expect(store.getState()).toEqual({ count: 0, items: [] });
    });

    it('should return a copy of state', () => {
      const state1 = store.getState();
      const state2 = store.getState();
      expect(state1).not.toBe(state2);
    });
  });

  describe('get', () => {
    it('should get specific state value', () => {
      expect(store.get('count')).toBe(0);
      expect(store.get('items')).toEqual([]);
    });
  });

  describe('setState', () => {
    it('should update state', () => {
      store.setState({ count: 5 });
      expect(store.get('count')).toBe(5);
    });

    it('should merge with existing state', () => {
      store.setState({ count: 5 });
      store.setState({ items: [1, 2, 3] });
      expect(store.getState()).toEqual({ count: 5, items: [1, 2, 3] });
    });

    it('should notify subscribers', () => {
      let notified = false;
      store.subscribe('test', () => { notified = true; });
      store.setState({ count: 1 });
      expect(notified).toBe(true);
    });
  });

  describe('subscribe/unsubscribe', () => {
    it('should subscribe to state changes', () => {
      let callCount = 0;
      store.subscribe('test', () => { callCount++; });
      
      store.setState({ count: 1 });
      store.setState({ count: 2 });
      
      expect(callCount).toBe(2);
    });

    it('should unsubscribe from state changes', () => {
      let callCount = 0;
      store.subscribe('test', () => { callCount++; });
      
      store.setState({ count: 1 });
      store.unsubscribe('test');
      store.setState({ count: 2 });
      
      expect(callCount).toBe(1);
    });

    it('should return unsubscribe function', () => {
      let callCount = 0;
      const unsubscribe = store.subscribe('test', () => { callCount++; });
      
      store.setState({ count: 1 });
      unsubscribe();
      store.setState({ count: 2 });
      
      expect(callCount).toBe(1);
    });
  });

  describe('reset', () => {
    it('should reset state to initial values', () => {
      store.setState({ count: 10, items: [1, 2, 3] });
      store.reset({ count: 0, items: [] });
      expect(store.getState()).toEqual({ count: 0, items: [] });
    });

    it('should notify subscribers on reset', () => {
      let notified = false;
      store.subscribe('test', () => { notified = true; });
      store.reset();
      expect(notified).toBe(true);
    });
  });

  describe('notify', () => {
    it('should pass old and new state to subscribers', () => {
      let oldState, newState;
      store.subscribe('test', (old, updated) => {
        oldState = old;
        newState = updated;
      });
      
      store.setState({ count: 5 });
      
      expect(oldState.count).toBe(0);
      expect(newState.count).toBe(5);
    });
  });
});
