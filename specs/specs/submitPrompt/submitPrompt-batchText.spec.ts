import {ChatAdapter, ChatAdapterExtras} from '@nlux-dev/core/src';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {submitPrompt} from '@shared/services/submitPrompt/submitPromptImpl';
import {adapterBuilder} from '../../utils/adapterBuilder';
import {AdapterController} from '../../utils/adapters';
import {waitForMilliseconds} from '../../utils/wait';

describe('submitPrompt() + fetch data transfer mode', () => {
    let adapterController: AdapterController<string> | undefined;
    let extras: ChatAdapterExtras<string> | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder<string>()
            .withBatchText(true)
            .withStreamText(false)
            .create();
        extras = {
            aiChatProps: {} as any,
        } as ChatAdapterExtras<string>;
    });

    afterEach(() => {
        adapterController = undefined;
        extras = undefined;
    });

    it('Should submit the prompt using the fetch data transfer mode', () => {
        // Arrange
        const prompt = 'What is the weather like today?';
        const adapter: ChatAdapter<string> = adapterController!.adapter;

        // Act
        submitPrompt(prompt, adapter, extras!);

        // Assert
        expect(adapterController?.batchTextMock).toHaveBeenCalled();
    });

    it('Should return segment and observable', () => {
        // Arrange
        const prompt = 'What is the weather like today?';
        const adapter = adapterController!.adapter;

        // Act
        const {segment, observable} = submitPrompt(prompt, adapter, extras!);

        // Assert
        expect(segment).toBeDefined();
        expect(observable).toBeDefined();
    });

    describe('When an empty prompt is submitted', () => {
        it('Should emit complete event with empty items', async () => {
            // Arrange
            const prompt = '';
            const adapter = adapterController!.adapter;

            // Act
            const {observable} = submitPrompt(prompt, adapter, extras!);
            const listenToComplete = vi.fn();
            observable.on('complete', listenToComplete);
            await waitForMilliseconds(1);

            // Assert
            expect(listenToComplete).toHaveBeenCalledWith(
                {
                    status: 'complete',
                    uid: expect.any(String),
                    items: [],
                },
            );
        });

        it('Should complete without adding user message', async () => {
            // Arrange
            const prompt = '';
            const adapter = adapterController!.adapter;
            const listenToUserMessageReceived = vi.fn();
            const listenToComplete = vi.fn();

            // Act
            const {observable} = submitPrompt(prompt, adapter, extras!);
            observable.on('complete', listenToComplete);
            observable.on('userMessageReceived', listenToUserMessageReceived);
            await waitForMilliseconds(1);

            // Assert
            expect(listenToUserMessageReceived).not.toHaveBeenCalled();
        });

        it('Should complete without calling batchText', () => {
            // Arrange
            const prompt = '';
            const adapter = adapterController!.adapter;

            // Act
            submitPrompt(prompt, adapter, extras!);

            // Assert
            expect(adapterController?.batchTextMock).not.toHaveBeenCalled();
        });
    });

    describe('When a valid prompt is submitted', () => {
        it('Should emit userMessageReceived event if a callback is registered', async () => {
            // Arrange
            const prompt = 'What is the weather like today?';
            const adapter = adapterController!.adapter;
            const listenToUserMessageReceived = vi.fn();

            // Act
            const {observable} = submitPrompt(prompt, adapter, extras!);
            observable.on('userMessageReceived', listenToUserMessageReceived);
            adapterController!.resolve('Hi! The weather is sunny today.');
            await waitForMilliseconds(2);

            // Assert
            expect(listenToUserMessageReceived).toHaveBeenCalledWith({
                content: prompt,
                participantRole: 'user',
                status: 'complete',
                contentType: 'text',
                time: expect.any(Date),
                uid: expect.any(String),
            });
        });

        it('Should not call userMessageReceived event when callback is removed', async () => {
            // Arrange
            const prompt = 'What is the weather like today?';
            const adapter = adapterController!.adapter;
            const listenToUserMessageReceived = vi.fn();

            // Act
            const {observable} = submitPrompt(prompt, adapter, extras!);
            observable.on('userMessageReceived', listenToUserMessageReceived);
            observable.removeListener('userMessageReceived', listenToUserMessageReceived);
            await waitForMilliseconds(1);

            // Assert
            expect(listenToUserMessageReceived).not.toHaveBeenCalled();
        });

        it('Should not call userMessageReceived event when observable is destroyed', async () => {
            // Arrange
            const prompt = 'What is the weather like today?';
            const adapter = adapterController!.adapter;
            const listenToUserMessageReceived = vi.fn();

            // Act
            const {observable} = submitPrompt(prompt, adapter, extras!);
            observable.on('userMessageReceived', listenToUserMessageReceived);
            observable.destroy();
            await waitForMilliseconds(1);

            // Assert
            expect(listenToUserMessageReceived).not.toHaveBeenCalled();
        });

        describe('When the server responds with an AI message', () => {
            it('Should emit aiMessageReceived event when callback is registered', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToAiMessageReceived = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('aiMessageReceived', listenToAiMessageReceived);
                adapterController!.resolve('Hi! The weather is sunny today.');
                await waitForMilliseconds(10);

                // Assert
                expect(listenToAiMessageReceived).toHaveBeenCalledWith({
                    uid: expect.any(String),
                    time: expect.any(Date),
                    dataTransferMode: 'batch',
                    content: 'Hi! The weather is sunny today.',
                    contentType: 'text',
                    participantRole: 'assistant',
                    status: 'complete',
                });
            });

            it('Should not call aiMessageReceived event when callback is removed', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToAiMessageReceived = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('aiMessageReceived', listenToAiMessageReceived);
                observable.removeListener('aiMessageReceived', listenToAiMessageReceived);
                adapterController!.resolve('Hi! The weather is sunny today.');
                await waitForMilliseconds(10);

                // Assert
                expect(listenToAiMessageReceived).not.toHaveBeenCalled();
            });

            it('Should not call aiMessageReceived event when observable is destroyed', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToAiMessageReceived = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('aiMessageReceived', listenToAiMessageReceived);
                observable.destroy();
                adapterController!.resolve('Hi! The weather is sunny today.');
                await waitForMilliseconds(10);

                // Assert
                expect(listenToAiMessageReceived).not.toHaveBeenCalled();
            });

            it('Should emit chatSegmentComplete event when callback is registered', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToChatSegmentComplete = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('complete', listenToChatSegmentComplete);
                adapterController!.resolve('Hi! The weather is sunny today.');
                await waitForMilliseconds(10);

                // Assert
                expect(listenToChatSegmentComplete).toHaveBeenCalledWith({
                    uid: expect.any(String),
                    status: 'complete',
                    items: expect.arrayContaining([
                        {
                            content: prompt,
                            contentType: 'text',
                            participantRole: 'user',
                            status: 'complete',
                            time: expect.any(Date),
                            uid: expect.any(String),
                        },
                        {
                            content: 'Hi! The weather is sunny today.',
                            contentType: 'text',
                            participantRole: 'assistant',
                            status: 'complete',
                            dataTransferMode: 'batch',
                            time: expect.any(Date),
                            uid: expect.any(String),
                        },
                    ]),
                });
            });

            it('Should not call chatSegmentComplete event when callback is removed', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToChatSegmentComplete = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('complete', listenToChatSegmentComplete);
                observable.removeListener('complete', listenToChatSegmentComplete);
                adapterController!.resolve('Hi! The weather is sunny today.');
                await waitForMilliseconds(10);

                // Assert
                expect(listenToChatSegmentComplete).not.toHaveBeenCalled();
            });

            it('Should not call chatSegmentComplete event when observable is destroyed', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToChatSegmentComplete = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('complete', listenToChatSegmentComplete);
                observable.destroy();
                adapterController!.resolve('Hi! The weather is sunny today.');
                await waitForMilliseconds(10);

                // Assert
                expect(listenToChatSegmentComplete).not.toHaveBeenCalled();
            });

            it('Should emit events in the correct order', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const callsOrder: string[] = [];
                const listenToUserMessageReceived = vi.fn(() => callsOrder.push('userMessageReceived'));
                const listenToAiMessageReceived = vi.fn(() => callsOrder.push('aiMessageReceived'));
                const listenToChatSegmentComplete = vi.fn(() => callsOrder.push('chatSegmentComplete'));

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('complete', listenToChatSegmentComplete);
                observable.on('userMessageReceived', listenToUserMessageReceived);
                observable.on('aiMessageReceived', listenToAiMessageReceived);
                adapterController!.resolve('Hi! The weather is sunny today.');
                await waitForMilliseconds(10);

                // Assert
                expect(callsOrder).toEqual(['userMessageReceived', 'aiMessageReceived', 'chatSegmentComplete']);
            });
        });

        describe('When the server responds with an error', () => {
            it('Should emit error event when callback is registered', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToError = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('error', listenToError);
                adapterController!.reject('Error message');
                await waitForMilliseconds(10);

                // Assert
                expect(listenToError).toHaveBeenCalledWith(
                    'failed-to-load-content',
                    expect.any(Error),
                );
            });

            it('Should not call error event when callback is removed', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToError = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('error', listenToError);
                observable.removeListener('error', listenToError);
                adapterController!.reject('Error message');
                await waitForMilliseconds(10);

                // Assert
                expect(listenToError).not.toHaveBeenCalled();
            });

            it('Should not call error event when observable is destroyed', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToError = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('error', listenToError);
                observable.destroy();
                adapterController!.reject('Error message');
                await waitForMilliseconds(10);

                // Assert
                expect(listenToError).not.toHaveBeenCalled();
            });

            it('Should not emit complete event when an error is thrown', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToComplete = vi.fn();
                const listenToError = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('complete', listenToComplete);
                observable.on('error', listenToError);
                adapterController!.reject('Error message');
                await waitForMilliseconds(10);

                // Assert
                expect(listenToComplete).not.toHaveBeenCalled();
            });

            it('Should emit events in the correct order', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const callsOrder: string[] = [];
                const listenToUserMessageReceived = vi.fn(() => callsOrder.push('userMessageReceived'));
                const listenToError = vi.fn(() => callsOrder.push('error'));

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('error', listenToError);
                observable.on('userMessageReceived', listenToUserMessageReceived);
                adapterController!.reject('Error message');
                await waitForMilliseconds(10);

                // Assert
                expect(callsOrder).toEqual(['userMessageReceived', 'error']);
            });
        });
    });
});
