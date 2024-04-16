import {ChatAdapterExtras, StandardAdapterInfo, StandardChatAdapter, submitPrompt} from '@nlux-dev/core/src';
import {describe, expect, it, vi} from 'vitest';
import {waitForMilliseconds} from '../../utils/wait';

describe('submitPrompt()', () => {
    describe('When the adapter does not support any data transfer modes', () => {
        it('Should emit an exception', async () => {
            // Arrange
            const prompt = 'What is the weather like today?';
            const adapter = {
                streamText: undefined,
                fetchText: undefined,
            };
            const extras = {
                aiChatProps: {} as any,
            } satisfies ChatAdapterExtras<string>;

            // Act
            const {observable} = submitPrompt(prompt, adapter, extras);
            const exceptionSpy = vi.fn();
            observable.on('exception', exceptionSpy);
            await waitForMilliseconds(1);

            // Assert
            expect(exceptionSpy).toHaveBeenCalledWith({
                type: 'error',
                id: 'NX-AD-002',
                message: 'The provided adapter does not support loading data via fetch or streaming modes.',
            });
        });
    });

    describe('When the adapter supports only supports fetch data transfer mode', () => {
        it('Should use the fetch data transfer mode', () => {
            // Arrange
            const prompt = 'What is the weather like today?';
            const adapter = {
                streamText: undefined,
                fetchText: vi.fn().mockReturnValue(Promise.resolve('')),
            };
            const extras = {
                aiChatProps: {} as any,
            } satisfies ChatAdapterExtras<string>;

            // Act
            submitPrompt(prompt, adapter, extras);

            // Assert
            expect(adapter.fetchText).toHaveBeenCalled();
        });
    });

    describe('When the adapter supports only supports stream data transfer mode', () => {
        it('Should use the stream data transfer mode', () => {
            // Arrange
            const prompt = 'What is the weather like today?';
            const adapter = {
                streamText: vi.fn().mockReturnValue(Promise.resolve('')),
                fetchText: undefined,
            };
            const extras = {
                aiChatProps: {} as any,
            } satisfies ChatAdapterExtras<string>;

            // Act
            submitPrompt(prompt, adapter, extras);

            // Assert
            expect(adapter.streamText).toHaveBeenCalled();
        });
    });

    describe('When the adapter supports both stream and fetch data transfer modes', () => {
        it('Should use the stream data transfer mode by default', () => {
            // Arrange
            const prompt = 'What is the weather like today?';
            const adapter = {
                streamText: vi.fn().mockReturnValue(Promise.resolve('')),
                fetchText: vi.fn().mockReturnValue(Promise.resolve('')),
            };
            const extras = {
                aiChatProps: {} as any,
            } satisfies ChatAdapterExtras<string>;

            // Act
            submitPrompt(prompt, adapter, extras);

            // Assert
            expect(adapter.streamText).toHaveBeenCalled();
        });

        it('Should use the fetch data transfer mode when the adapter specifies it', () => {
            // Arrange
            const prompt = 'What is the weather like today?';
            const adapter = {
                streamText: vi.fn().mockReturnValue(Promise.resolve('')),
                fetchText: vi.fn().mockReturnValue(Promise.resolve('')),
                dataTransferMode: 'fetch',
                id: '123',
                info: {} as StandardAdapterInfo,
            } satisfies StandardChatAdapter<string>;

            const extras = {
                aiChatProps: {} as any,
            } satisfies ChatAdapterExtras<string>;

            // Act
            submitPrompt(prompt, adapter, extras);

            // Assert
            expect(adapter.fetchText).toHaveBeenCalled();
        });
    });
});
