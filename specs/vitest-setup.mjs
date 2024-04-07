import * as matchers from '@testing-library/jest-dom/matchers';
import {cleanup} from '@testing-library/react';
import ResizeObserver from 'resize-observer-polyfill';
import {afterEach, expect, vi} from 'vitest';
import '@testing-library/jest-dom/vitest';

expect.extend(matchers);

afterEach(() => {
    cleanup();
});

console.warn = vi.fn();
console.log = vi.fn();
console.info = vi.fn();

global.ResizeObserver = ResizeObserver;
global.HTMLElement.prototype.scroll = vi.fn();
global.HTMLElement.prototype.scrollTo = vi.fn();
global.HTMLElement.prototype.scrollIntoView = vi.fn();
