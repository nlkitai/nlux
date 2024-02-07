import {describe, expect, it} from 'vitest';
import {parseChunk} from '../../../../packages/js/langchain/src/langserve/parser/parseChunk';
import multipleMixedEvents from './data/multiple-mixed-events';
import multipleValidDataEvents from './data/multiple-valid-data-events';
import multipleValidDataEventsWithSpace from './data/multiple-valid-data-events-with-space';
import oneValidDataEvent from './data/one-valid-data-event';
import oneValidDataEventWithSpace from './data/one-valid-data-event-with-space';

describe('When LangServe adapter is used in streaming mode', () => {
    it('should handle chunk with a single data event', () => {
        const result = parseChunk(oneValidDataEvent);
        expect(result).toEqual([
            {
                event: 'data',
                data: expect.objectContaining({content: 'This is some test AI data'}),
            },
        ]);
    });

    it('should handle chunk with a single data event with extra empty lines', () => {
        const result = parseChunk(oneValidDataEventWithSpace);
        expect(result).toEqual([
            {
                event: 'data',
                data: expect.objectContaining({content: 'This is some test AI data'}),
            },
        ]);
    });

    it('should handle chunk with multiple data events', () => {
        const result = parseChunk(multipleValidDataEvents);
        expect(result).toEqual([
            {
                event: 'data',
                data: expect.objectContaining({content: 'This is some test AI data'}),
            },
            {
                event: 'data',
                data: expect.objectContaining({content: 'Here is more test AI data'}),
            },
        ]);
    });

    it('should handle chunk with multiple data events with extra empty lines', () => {
        const result = parseChunk(multipleValidDataEventsWithSpace);
        expect(result).toEqual([
            {
                event: 'data',
                data: expect.objectContaining({content: 'This is some test AI data'}),
            },
            {
                event: 'data',
                data: expect.objectContaining({content: 'Here is more test AI data'}),
            },
        ]);
    });

    it('should ignore non-data events', () => {
        const result = parseChunk(multipleMixedEvents);
        expect(result).toEqual([
            {
                event: 'data',
                data: expect.objectContaining({content: 'This is some test AI data'}),
            },
            {
                event: 'data',
                data: expect.objectContaining({content: 'This is some extra test AI data'}),
            },
        ]);
    });

    it.todo('should report an error when an invalid chunk is provided');
    it.todo('should report an error when a chunk with invalid data is provided');
});
