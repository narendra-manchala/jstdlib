import { describe, it, expect } from 'vitest';
import { Deque } from './deque';

describe('Deque', () => {
  it('initializes empty', () => {
    const dq = new Deque();
    expect(dq.size).toBe(0);
    expect(dq.isEmpty).toBe(true);
    expect(dq.popFront()).toBeUndefined();
    expect(dq.popBack()).toBeUndefined();
    expect(dq.peekFront()).toBeUndefined();
    expect(dq.peekBack()).toBeUndefined();
  });

  it('can push and pop back', () => {
    const dq = new Deque<number>();
    dq.pushBack(1);
    dq.pushBack(2);
    expect(dq.size).toBe(2);
    expect(dq.peekBack()).toBe(2);
    expect(dq.popBack()).toBe(2);
    expect(dq.popBack()).toBe(1);
    expect(dq.isEmpty).toBe(true);
  });

  it('can push and pop front', () => {
    const dq = new Deque<number>();
    dq.pushFront(1);
    dq.pushFront(2);
    expect(dq.size).toBe(2);
    expect(dq.peekFront()).toBe(2);
    expect(dq.popFront()).toBe(2);
    expect(dq.popFront()).toBe(1);
    expect(dq.isEmpty).toBe(true);
  });

  it('handles mixed operations correctly', () => {
    const dq = new Deque<number>();
    dq.pushBack(1); // [1]
    dq.pushFront(2); // [2, 1]
    dq.pushBack(3); // [2, 1, 3]
    
    expect(dq.peekFront()).toBe(2);
    expect(dq.peekBack()).toBe(3);
    
    expect(dq.popFront()).toBe(2); // [1, 3]
    expect(dq.popBack()).toBe(3); // [1]
    expect(dq.popFront()).toBe(1); // []
    expect(dq.isEmpty).toBe(true);
  });

  it('resizes correctly when capacity is exceeded', () => {
    const dq = new Deque<number>(2); // small initial capacity
    dq.pushBack(1);
    dq.pushBack(2);
    dq.pushBack(3); // triggers resize
    
    expect(dq.size).toBe(3);
    expect(dq.popFront()).toBe(1);
    expect(dq.popFront()).toBe(2);
    expect(dq.popFront()).toBe(3);
  });

  it('resizes correctly when capacity is exceeded with front pushes', () => {
    const dq = new Deque<number>(2);
    dq.pushFront(1);
    dq.pushFront(2);
    dq.pushFront(3); // triggers resize
    
    expect(dq.size).toBe(3);
    expect(dq.popBack()).toBe(1);
    expect(dq.popBack()).toBe(2);
    expect(dq.popBack()).toBe(3);
  });

  it('clears correctly', () => {
    const dq = new Deque<number>();
    dq.pushBack(1);
    dq.pushBack(2);
    dq.clear();
    expect(dq.size).toBe(0);
    expect(dq.isEmpty).toBe(true);
    expect(dq.popFront()).toBeUndefined();
  });

  it('is iterable and adheres to the iterator protocol', () => {
    const dq = new Deque<number>();
    dq.pushBack(1);
    dq.pushBack(2);
    dq.pushFront(0); // [0, 1, 2]
    
    const arr = [...dq]; // Testing array spreading using for...of generator
    expect(arr).toEqual([0, 1, 2]);
  });
});
