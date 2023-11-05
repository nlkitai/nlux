import fetchMock from 'jest-fetch-mock';
import ResizeObserver from 'resize-observer-polyfill';

fetchMock.enableMocks();

console.warn = jest.fn();
console.log = jest.fn();
console.info = jest.fn();

global.ResizeObserver = ResizeObserver;
global.HTMLElement.prototype.scroll = jest.fn();
global.HTMLElement.prototype.scrollIntoView = jest.fn();
