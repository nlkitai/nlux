import {ChatAdapter, ChatAdapterExtras} from '@nlux-dev/core/src';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {submitPrompt} from '../../../packages/shared/src/services/submitPrompt/submitPromptImpl';
import {adapterBuilder} from '../../utils/adapterBuilder';
import {AdapterController} from '../../utils/adapters';
import {waitForMilliseconds} from '../../utils/wait';

describe('submitPrompt() + stream data transfer mode', () => {
    let adapterController: AdapterController<string> | undefined;
    let extras: ChatAdapterExtras<string> | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder<string>()
            .withFetchText(false)
            .withStreamText(true)
            .create();
        extras = {
            aiChatProps: {} as any,
        } as ChatAdapterExtras<string>;
    });

    afterEach(() => {
        adapterController = undefined;
        extras = undefined;
    });

    it('Should submit the prompt using the stream data transfer mode', () => {
        // Arrange
        const prompt = 'What is the weather like today?';
        const adapter: ChatAdapter<string> = adapterController!.adapter;

        // Act
        submitPrompt(prompt, adapter, extras!);

        // Assert
        expect(adapterController?.streamTextMock).toHaveBeenCalled();
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

        it('Should complete without calling fetchText', () => {
            // Arrange
            const prompt = '';
            const adapter = adapterController!.adapter;

            // Act
            submitPrompt(prompt, adapter, extras!);

            // Assert
            expect(adapterController?.fetchTextMock).not.toHaveBeenCalled();
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

        describe('When the server starts streaming', () => {
            it('Should emit aiMessageStreamStarted event when callback is registered', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToStreamStarted = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('aiMessageStreamStarted', listenToStreamStarted);
                adapterController!.next('The');
                await waitForMilliseconds(10);

                // Assert
                expect(listenToStreamStarted).toHaveBeenCalledWith({
                    uid: expect.any(String),
                    time: expect.any(Date),
                    dataTransferMode: 'stream',
                    participantRole: 'ai',
                    status: 'streaming',
                });
            });

            it('Should not emit aiMessageStreamStarted event when callback is removed', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToStreamStarted = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('aiMessageStreamStarted', listenToStreamStarted);
                observable.removeListener('aiMessageStreamStarted', listenToStreamStarted);
                adapterController!.next('The');
                await waitForMilliseconds(10);

                // Assert
                expect(listenToStreamStarted).not.toHaveBeenCalled();
            });

            it('Should not emit aiMessageStreamStarted event when observable is destroyed', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToStreamStarted = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('aiMessageStreamStarted', listenToStreamStarted);
                observable.destroy();
                adapterController!.next('The');
                await waitForMilliseconds(10);

                // Assert
                expect(listenToStreamStarted).not.toHaveBeenCalled();
            });

            it('Should emit aiChunkReceived event when callback is registered', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToChunkReceived = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('aiChunkReceived', listenToChunkReceived);
                adapterController!.next('The');
                await waitForMilliseconds(10);

                // Assert
                expect(listenToChunkReceived).toHaveBeenCalledWith('The', expect.any(String));
            });

            it('Should not emit aiChunkReceived event when callback is removed', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToChunkReceived = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('aiChunkReceived', listenToChunkReceived);
                observable.removeListener('aiChunkReceived', listenToChunkReceived);
                adapterController!.next('The');
                await waitForMilliseconds(10);

                // Assert
                expect(listenToChunkReceived).not.toHaveBeenCalled();
            });

            it('Should not emit aiChunkReceived event when observable is destroyed', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToChunkReceived = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('aiChunkReceived', listenToChunkReceived);
                observable.destroy();
                adapterController!.next('The');
                await waitForMilliseconds(10);

                // Assert
                expect(listenToChunkReceived).not.toHaveBeenCalled();
            });

            it('Should emit aiChunkReceived that is emitted after a delay', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToChunkReceived = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('aiChunkReceived', listenToChunkReceived);
                setTimeout(() => adapterController!.next('The'), 50);
                await waitForMilliseconds(60);

                // Assert
                expect(listenToChunkReceived).toHaveBeenCalledWith('The', expect.any(String));
            });

            it('Should emit aiChunkReceived after aiMessageStreamStarted', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;

                const eventsEmitted: string[] = [];
                const listenToStreamStarted = vi.fn().mockImplementation(
                    () => eventsEmitted.push('aiMessageStreamStarted'));
                const listenToChunkReceived = vi.fn().mockImplementation(
                    () => eventsEmitted.push('aiChunkReceived'));

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('aiChunkReceived', listenToChunkReceived);
                observable.on('aiMessageStreamStarted', listenToStreamStarted);
                adapterController!.next('The');
                await waitForMilliseconds(10);

                // Assert
                expect(eventsEmitted).toEqual(['aiMessageStreamStarted', 'aiChunkReceived']);
            });

            it('Should assign the same messageId to aiChunkReceived and aiMessageStreamStarted', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;

                const listenToStreamStarted = vi.fn();
                const listenToChunkReceived = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('aiChunkReceived', listenToChunkReceived);
                observable.on('aiMessageStreamStarted', listenToStreamStarted);
                adapterController!.next('The');
                await waitForMilliseconds(10);

                // Assert
                expect(listenToStreamStarted).toHaveBeenCalledTimes(1);
                expect(listenToChunkReceived).toHaveBeenCalledTimes(1);

                const messageId = listenToChunkReceived.mock.calls[0][1];
                expect(typeof messageId).toBe('string');
                expect(messageId.length).toBeGreaterThan(0);

                expect(listenToStreamStarted).toHaveBeenCalledWith({
                    uid: messageId,
                    time: expect.any(Date),
                    dataTransferMode: 'stream',
                    participantRole: 'ai',
                    status: 'streaming',
                });
            });
        });

        describe('When multiple chunks are streamed', () => {
            it('Should emit aiChunkReceived event for each chunk', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToChunkReceived = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('aiChunkReceived', listenToChunkReceived);
                adapterController!.next('The');
                adapterController!.next(' weather');
                adapterController!.next(' is');
                adapterController!.next(' sunny');
                await waitForMilliseconds(10);

                // Assert
                expect(listenToChunkReceived).toHaveBeenCalledTimes(4);
                expect(listenToChunkReceived).toHaveBeenCalledWith('The', expect.any(String));
                expect(listenToChunkReceived).toHaveBeenCalledWith(' weather', expect.any(String));
                expect(listenToChunkReceived).toHaveBeenCalledWith(' is', expect.any(String));
                expect(listenToChunkReceived).toHaveBeenCalledWith(' sunny', expect.any(String));
            });

            it('Should emit aiChunkReceived with the same message id for each chunk', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToChunkReceived = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('aiChunkReceived', listenToChunkReceived);
                adapterController!.next('The');
                adapterController!.next(' weather');
                adapterController!.next(' is');
                adapterController!.next(' sunny');
                await waitForMilliseconds(10);

                // Assert
                expect(listenToChunkReceived).toHaveBeenCalledTimes(4);
                const messageId = listenToChunkReceived.mock.calls[0][1];
                expect(typeof messageId).toBe('string');
                expect(messageId?.length).toBeGreaterThan(0);
                expect(listenToChunkReceived).toHaveBeenCalledWith('The', messageId);
                expect(listenToChunkReceived).toHaveBeenCalledWith(' weather', messageId);
                expect(listenToChunkReceived).toHaveBeenCalledWith(' is', messageId);
                expect(listenToChunkReceived).toHaveBeenCalledWith(' sunny', messageId);
            });
        });

        describe('When the server completes streaming', () => {
            it('Should emit aiMessageStreamed event when callback is registered', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToStreamed = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('aiMessageStreamed', listenToStreamed);
                adapterController!.next('The');
                adapterController!.next(' weather');
                adapterController!.next(' is');
                adapterController!.next(' sunny');
                adapterController!.complete();
                await waitForMilliseconds(10);

                // Assert
                expect(listenToStreamed)
                    .toHaveBeenCalledWith({
                        uid: expect.any(String),
                        status: 'complete',
                        time: expect.any(Date),
                        participantRole: 'ai',
                        dataTransferMode: 'stream',
                        content: 'The weather is sunny',
                    });
            });

            it('Should emit segment complete event when callback is registered', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToComplete = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('complete', listenToComplete);
                adapterController!.complete();
                await waitForMilliseconds(10);

                // Assert
                expect(listenToComplete).toHaveBeenCalledWith(
                    {
                        status: 'complete',
                        uid: expect.any(String),
                        items: expect.any(Array),
                    },
                );
            });

            it('Should ignore subsequent chunks after the server completes streaming', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToChunkReceived = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('aiChunkReceived', listenToChunkReceived);
                adapterController!.next('The');
                adapterController!.complete();
                adapterController!.next(' weather');
                adapterController!.next(' is');
                adapterController!.next(' sunny');
                await waitForMilliseconds(10);

                // Assert
                expect(listenToChunkReceived).toHaveBeenCalledTimes(1);
                expect(listenToChunkReceived).toHaveBeenCalledWith('The', expect.any(String));
            });

            it('Should include user message and ai messages in the complete event', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToComplete = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('complete', listenToComplete);
                adapterController!.next('The');
                adapterController!.next(' weather');
                adapterController!.next(' is');
                adapterController!.next(' sunny');
                adapterController!.complete();
                await waitForMilliseconds(10);

                // Assert
                expect(listenToComplete).toHaveBeenCalledWith(
                    {
                        status: 'complete',
                        uid: expect.any(String),
                        items: [
                            {
                                uid: expect.any(String),
                                time: expect.any(Date),
                                status: 'complete',
                                participantRole: 'user',
                                content: prompt,
                            },
                            {
                                uid: expect.any(String),
                                time: expect.any(Date),
                                status: 'complete',
                                content: 'The weather is sunny',
                                participantRole: 'ai',
                                dataTransferMode: 'stream',
                            },
                        ],
                    },
                );
            });

            it('Should emit all events in the correct order', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;

                const eventsEmitted: string[] = [];
                const listenToUserMessageReceived = vi.fn().mockImplementation(
                    () => eventsEmitted.push('userMessageReceived'));
                const listenToStreamStarted = vi.fn().mockImplementation(
                    () => eventsEmitted.push('aiMessageStreamStarted'));
                const listenToChunkReceived = vi.fn().mockImplementation(
                    () => eventsEmitted.push('aiChunkReceived'));
                const listenToComplete = vi.fn().mockImplementation(
                    () => eventsEmitted.push('complete'));

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('aiChunkReceived', listenToChunkReceived);
                observable.on('userMessageReceived', listenToUserMessageReceived);
                observable.on('complete', listenToComplete);
                observable.on('aiMessageStreamStarted', listenToStreamStarted);
                adapterController!.next('The');
                adapterController!.next(' weather');
                adapterController!.next(' is');
                adapterController!.next(' sunny');
                adapterController!.complete();
                await waitForMilliseconds(10);

                // Assert
                expect(eventsEmitted).toEqual([
                    'userMessageReceived',
                    'aiMessageStreamStarted',
                    'aiChunkReceived',
                    'aiChunkReceived',
                    'aiChunkReceived',
                    'aiChunkReceived',
                    'complete',
                ]);
            });
        });

        describe('When an error occurs during streaming', () => {
            it('Should emit error event when callback is registered', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToError = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('error', listenToError);
                adapterController!.error(new Error('Random streaming error'));
                await waitForMilliseconds(10);

                // Assert
                expect(listenToError).toHaveBeenCalledWith(
                    'failed-to-stream-content',
                    expect.any(Error),
                );
            });

            it('Should not emit error event when callback is removed', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToError = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('error', listenToError);
                observable.removeListener('error', listenToError);
                adapterController!.error(new Error('Random streaming error'));
                await waitForMilliseconds(10);

                // Assert
                expect(listenToError).not.toHaveBeenCalled();
            });

            it('Should not emit error event when observable is destroyed', async () => {
                // Arrange
                const prompt = 'What is the weather like today?';
                const adapter = adapterController!.adapter;
                const listenToError = vi.fn();

                // Act
                const {observable} = submitPrompt(prompt, adapter, extras!);
                observable.on('error', listenToError);
                observable.destroy();
                adapterController!.error(new Error('Random streaming error'));
                await waitForMilliseconds(10);

                // Assert
                expect(listenToError).not.toHaveBeenCalled();
            });

            describe('When an error occurs after streaming of the first chunk', () => {
                it('Should emit error event after aiMessageStreamStarted', async () => {
                    // Arrange
                    const prompt = 'What is the weather like today?';
                    const adapter = adapterController!.adapter;
                    const eventsEmitted: string[] = [];
                    const listenToStreamStarted = vi.fn().mockImplementation(
                        () => eventsEmitted.push('aiMessageStreamStarted'));
                    const listenToError = vi.fn().mockImplementation(
                        () => eventsEmitted.push('error'));

                    // Act
                    const {observable} = submitPrompt(prompt, adapter, extras!);
                    observable.on('aiMessageStreamStarted', listenToStreamStarted);
                    observable.on('error', listenToError);
                    adapterController!.next('The');
                    adapterController!.error(new Error('Random streaming error'));
                    await waitForMilliseconds(10);

                    // Assert
                    expect(listenToStreamStarted).toHaveBeenCalledTimes(1);
                    expect(listenToError).toHaveBeenCalledTimes(1);
                    expect(eventsEmitted).toEqual(['aiMessageStreamStarted', 'error']);
                });

                it('Should ignore subsequent chunks after an error occurs', async () => {
                    // Arrange
                    const prompt = 'What is the weather like today?';
                    const adapter = adapterController!.adapter;
                    const listenToChunkReceived = vi.fn();

                    // Act
                    const {observable} = submitPrompt(prompt, adapter, extras!);
                    observable.on('aiChunkReceived', listenToChunkReceived);
                    adapterController!.next('The');
                    adapterController!.error(new Error('Random streaming error'));
                    adapterController!.next(' weather');
                    adapterController!.next(' is');
                    adapterController!.next(' sunny');
                    await waitForMilliseconds(10);

                    // Assert
                    expect(listenToChunkReceived).toHaveBeenCalledTimes(1);
                    expect(listenToChunkReceived).toHaveBeenCalledWith('The', expect.any(String));
                });

                it('Should emit events in the correct order', async () => {
                    // Arrange
                    const prompt = 'What is the weather like today?';
                    const adapter = adapterController!.adapter;

                    const eventsEmitted: string[] = [];
                    const listenToUserMessageReceived = vi.fn().mockImplementation(
                        () => eventsEmitted.push('userMessageReceived'));
                    const listenToStreamStarted = vi.fn().mockImplementation(
                        () => eventsEmitted.push('aiMessageStreamStarted'));
                    const listenToChunkReceived = vi.fn().mockImplementation(
                        () => eventsEmitted.push('aiChunkReceived'));
                    const listenToError = vi.fn().mockImplementation(
                        () => eventsEmitted.push('error'));

                    // Act
                    const {observable} = submitPrompt(prompt, adapter, extras!);
                    observable.on('aiMessageStreamStarted', listenToStreamStarted);
                    observable.on('aiChunkReceived', listenToChunkReceived);
                    observable.on('error', listenToError);
                    observable.on('userMessageReceived', listenToUserMessageReceived);
                    adapterController!.next('The');
                    adapterController!.next(' weather');
                    adapterController!.error(new Error('Random streaming error'));
                    adapterController!.next(' is');
                    adapterController!.next(' sunny');
                    await waitForMilliseconds(10);

                    // Assert
                    expect(eventsEmitted).toEqual([
                        'userMessageReceived',
                        'aiMessageStreamStarted',
                        'aiChunkReceived',
                        'aiChunkReceived',
                        'error',
                    ]);
                });
            });
        });
    });
});
