import type { DocSection } from './data/types';
import { gettingStartedDoc } from './data/docs/gettingStarted';
import { dequeDoc } from './data/docs/deque';
import { priorityQueueDoc } from './data/docs/priorityQueue';

export type { DocItem, MethodDoc, MethodParam } from './data/types';

export const DOCS: DocSection[] = [
  {
    section: "Getting Started",
    items: [gettingStartedDoc],
  },
  {
    section: "Data Structures",
    items: [dequeDoc, priorityQueueDoc],
  },
];
