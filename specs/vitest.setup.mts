import * as matchers from '@testing-library/jest-dom/matchers';
import {cleanup} from '@testing-library/react';
import '@testing-library/jest-dom';
import ResizeObserver from 'resize-observer-polyfill';
import {afterEach, expect, vi} from 'vitest';
import '@testing-library/jest-dom/vitest';

expect.extend(matchers as any);

afterEach(() => {
    cleanup();
});

console.warn = vi.fn();
console.log = vi.fn();
console.info = vi.fn();

(global as any).ResizeObserver = ResizeObserver;
(global as any).HTMLElement.prototype.scroll = vi.fn();
(global as any).HTMLElement.prototype.scrollTo = vi.fn();
(global as any).HTMLElement.prototype.scrollIntoView = vi.fn();
