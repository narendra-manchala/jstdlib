import { describe, it, expect } from 'vitest';
import { PriorityQueue } from './priorityQueue';

describe('PriorityQueue', () => {
  it('initializes empty', () => {
    const pq = new PriorityQueue<number>();
    expect(pq.size).toBe(0);
    expect(pq.isEmpty).toBe(true);
    expect(pq.pop()).toBeUndefined();
    expect(pq.peek()).toBeUndefined();
  });

  it('functions as a min-queue by default for numbers', () => {
    const pq = new PriorityQueue<number>();
    pq.push(5);
    pq.push(1);
    pq.push(3);
    
    expect(pq.peek()).toBe(1);
    expect(pq.pop()).toBe(1);
    expect(pq.pop()).toBe(3);
    expect(pq.pop()).toBe(5);
    expect(pq.isEmpty).toBe(true);
  });

  it('functions as a min-queue by default for strings', () => {
    const pq = new PriorityQueue<string>();
    pq.push('c');
    pq.push('a');
    pq.push('b');
    
    expect(pq.pop()).toBe('a');
    expect(pq.pop()).toBe('b');
    expect(pq.pop()).toBe('c');
  });

  it('uses a custom max-queue comparator correctly', () => {
    const maxQ = new PriorityQueue<number>((a, b) => b - a);
    maxQ.push(5);
    maxQ.push(10);
    maxQ.push(1);
    
    expect(maxQ.pop()).toBe(10);
    expect(maxQ.pop()).toBe(5);
    expect(maxQ.pop()).toBe(1);
  });

  it('handles complex objects with a custom comparator', () => {
    interface Task { id: string; prio: number; }
    const pq = new PriorityQueue<Task>((a, b) => a.prio - b.prio);
    
    pq.push({ id: 'low', prio: 10 });
    pq.push({ id: 'high', prio: 1 });
    pq.push({ id: 'med', prio: 5 });
    
    expect(pq.pop()?.id).toBe('high');
    expect(pq.pop()?.id).toBe('med');
    expect(pq.pop()?.id).toBe('low');
  });

  it('clears correctly', () => {
    const pq = new PriorityQueue<number>();
    pq.push(1);
    pq.push(2);
    pq.clear();
    expect(pq.size).toBe(0);
    expect(pq.isEmpty).toBe(true);
    expect(pq.pop()).toBeUndefined();
  });

  it('is iterable', () => {
    const pq = new PriorityQueue<number>();
    
    // Test empty iteration
    const emptyArr = [...pq];
    expect(emptyArr.length).toBe(0);

    // Test populated iteration
    pq.push(1);
    pq.push(2);
    
    const arr = [...pq];
    expect(arr.length).toBe(2);
    expect(arr).toContain(1);
    expect(arr).toContain(2);

    // Direct iterator invocation
    const iterator = pq[Symbol.iterator]();
    expect(iterator.next().done).toBe(false);
  });
  
  it('handles lots of identical elements', () => {
    const pq = new PriorityQueue<number>();
    pq.push(2);
    pq.push(2);
    pq.push(2);
    expect(pq.pop()).toBe(2);
    expect(pq.pop()).toBe(2);
    expect(pq.pop()).toBe(2);
  });
});
