import {submitPrompt} from '@nlux-dev/core/src';
import {ChatAdapterExtras} from '@nlux/core';
import {describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {waitForRenderCycle} from '../../../utils/wait';

describe('When submitPrompt is called', () => {
    it('should return a conversation part', () => {
        // Arrange
        const adapterController = adapterBuilder().withFetchText().create();

        // Act
        const result = submitPrompt(
            'Hello',
            adapterController.adapter,
            {} as ChatAdapterExtras,
            'fetch',
        );

        // Assert
        expect(result).toEqual({
            uid: expect.stringMatching(/^[0-9a-z-]+$/),
            status: 'active',
            messages: [
                expect.objectContaining({
                    uid: expect.stringMatching(/^[0-9a-z-]+$/),
                    content: 'Hello',
                    participantRole: 'user',
                    time: expect.any(Date),
                }),
                expect.objectContaining({
                    uid: expect.stringMatching(/^[0-9a-z-]+$/),
                    participantRole: 'ai',
                    type: 'message',
                    time: expect.any(Date),
                }),
            ],
            on: expect.any(Function),
            removeListener: expect.any(Function),
        });
    });

    describe('when the data transfer mode is "fetch"', () => {
        it('should call fetchText on the adapter', () => {
            // Arrange
            const adapterController = adapterBuilder().withFetchText().create();

            // Act
            submitPrompt(
                'Hello',
                adapterController.adapter,
                {} as ChatAdapterExtras,
                'fetch',
            );

            // Assert
            expect(adapterController.fetchTextMock).toHaveBeenCalledWith('Hello');
        });

        it('should call fetchText on the adapter with the prompt', () => {
            // Arrange
            const adapterController = adapterBuilder().withFetchText().create();

            // Act
            submitPrompt(
                'Hello',
                adapterController.adapter,
                {} as ChatAdapterExtras,
                'fetch',
            );

            // Assert
            expect(adapterController.fetchTextMock).toHaveBeenCalledWith('Hello');
        });

        it('the conversation part should have a message with the prompt', () => {
            // Arrange
            const adapterController = adapterBuilder().withFetchText().create();

            // Act
            const result = submitPrompt(
                'Hello',
                adapterController.adapter,
                {} as ChatAdapterExtras,
                'fetch',
            );

            // Assert
            expect(result.messages[0].content).toBe('Hello');
        });

        it('the conversation part should have a message from the AI', () => {
            // Arrange
            const adapterController = adapterBuilder().withFetchText().create();

            // Act
            const result = submitPrompt(
                'Hello',
                adapterController.adapter,
                {} as ChatAdapterExtras,
                'fetch',
            );

            // Assert
            expect(result.messages[1].participantRole).toBe('ai');
        });

        it('the message from the AI should be empty', () => {
            // Arrange
            const adapterController = adapterBuilder().withFetchText().create();

            // Act
            const result = submitPrompt(
                'Hello',
                adapterController.adapter,
                {} as ChatAdapterExtras,
                'fetch',
            );

            // Assert
            expect(result.messages[1].content).toBe(undefined);
        });

        describe('when the adapter returns a response', () => {
            it('should update the conversation part with the response', async () => {
                // Arrange
                const adapterController = adapterBuilder().withFetchText().create();
                const conversationPart = submitPrompt(
                    'Hello',
                    adapterController.adapter,
                    {} as ChatAdapterExtras,
                    'fetch',
                );

                // Act
                adapterController.resolve('Hi there');
                await waitForRenderCycle();

                // Assert
                expect(conversationPart.messages[1].content).toBe('Hi there');
            });

            it('should update the conversation part status to "complete"', async () => {
                // Arrange
                const adapterController = adapterBuilder().withFetchText().create();
                const conversationPart = submitPrompt(
                    'Hello',
                    adapterController.adapter,
                    {} as ChatAdapterExtras,
                    'fetch',
                );

                // Act
                adapterController.resolve('Hi there');
                await waitForRenderCycle();

                // Assert
                expect(conversationPart.status).toBe('complete');
            });

            describe('when a listener is added for the "complete" event', () => {
                it('should call the listener when the conversation part is complete', async () => {
                    // Arrange
                    const adapterController=adapterBuilder().withFetchText().create();
                    const conversationPart=submitPrompt(
                        'Hello',
                        adapterController.adapter,
                        {} as ChatAdapterExtras,
                        'fetch',
                    );
                    const completeListener= vi.fn();
                    conversationPart.on('complete', completeListener);

                    // Act
                    adapterController.resolve('Hi there');
                    await waitForRenderCycle();

                    // Assert
                    expect(completeListener).toHaveBeenCalled();
                });
            });

            describe('when a listener is added for the "update" event', () => {
                it('should call the listener when the conversation part is updated', async () => {
                    // Arrange
                    const adapterController = adapterBuilder().withFetchText().create();
                    const conversationPart = submitPrompt(
                        'Hello',
                        adapterController.adapter,
                        {} as ChatAdapterExtras,
                        'fetch',
                    );
                    const updateListener = vi.fn();
                    conversationPart.on('update', updateListener);

                    // Act
                    adapterController.resolve('Hi there');
                    await waitForRenderCycle();

                    // Assert
                    expect(updateListener).toHaveBeenCalled();
                });
            });

            describe('when a listener is added for the "error" event', () => {
                it('should not call the listener when the conversation part is complete', async () => {
                    // Arrange
                    const adapterController = adapterBuilder().withFetchText().create();
                    const conversationPart = submitPrompt(
                        'Hello',
                        adapterController.adapter,
                        {} as ChatAdapterExtras,
                        'fetch',
                    );
                    const errorListener = vi.fn();
                    conversationPart.on('error', errorListener);

                    // Act
                    adapterController.resolve('Hi there');
                    await waitForRenderCycle();

                    // Assert
                    expect(errorListener).not.toHaveBeenCalled();
                });

                it('should not call the listener when the conversation part is updated', async () => {
                    // Arrange
                    const adapterController = adapterBuilder().withFetchText().create();
                    const conversationPart = submitPrompt(
                        'Hello',
                        adapterController.adapter,
                        {} as ChatAdapterExtras,
                        'fetch',
                    );
                    const errorListener = vi.fn();
                    conversationPart.on('error', errorListener);

                    // Act
                    adapterController.resolve('Hi there');
                    await waitForRenderCycle();

                    // Assert
                    expect(errorListener).not.toHaveBeenCalled();
                });

                it('should call the listener when the conversation part has an error', async () => {
                    // Arrange
                    const adapterController = adapterBuilder().withFetchText().create();
                    const conversationPart = submitPrompt(
                        'Hello',
                        adapterController.adapter,
                        {} as ChatAdapterExtras,
                        'fetch',
                    );
                    const errorListener = vi.fn();
                    conversationPart.on('error', errorListener);

                    // Act
                    adapterController.reject('This is an error!');
                    await waitForRenderCycle();

                    // Assert
                    expect(errorListener).toHaveBeenCalled();
                });
            });
        });
    });

    describe('when the data transfer mode is "stream"', () => {
        it('should call streamText on the adapter', () => {
            // Arrange
            const adapterController = adapterBuilder().withStreamText().create();

            // Act
            submitPrompt(
                'Hello',
                adapterController.adapter,
                {} as ChatAdapterExtras,
                'stream',
            );

            // Assert
            expect(adapterController.streamTextMock).toHaveBeenCalled();
        });

        it('should call streamText on the adapter with the prompt', () => {
            // Arrange
            const adapterController = adapterBuilder().withStreamText().create();

            // Act
            submitPrompt(
                'Hello',
                adapterController.adapter,
                {} as ChatAdapterExtras,
                'stream',
            );

            // Assert
            expect(adapterController.streamTextMock).toHaveBeenCalledWith(
                'Hello',
                expect.objectContaining({
                    complete: expect.any(Function),
                    error: expect.any(Function),
                    next: expect.any(Function),
                }),
            );
        });

        it('the conversation part should have a message with the prompt', () => {
            // Arrange
            const adapterController = adapterBuilder().withStreamText().create();

            // Act
            const result = submitPrompt(
                'Hello',
                adapterController.adapter,
                {} as ChatAdapterExtras,
                'stream',
            );

            // Assert
            expect(result.messages[0].content).toBe('Hello');
        });

        it('the conversation part should have a message from the AI', () => {
            // Arrange
            const adapterController = adapterBuilder().withStreamText().create();

            // Act
            const result = submitPrompt(
                'Hello',
                adapterController.adapter,
                {} as ChatAdapterExtras,
                'stream',
            );

            // Assert
            expect(result.messages[1].participantRole).toBe('ai');
        });

        it('the message from the AI should be empty', () => {
            // Arrange
            const adapterController = adapterBuilder().withStreamText().create();

            // Act
            const result = submitPrompt(
                'Hello',
                adapterController.adapter,
                {} as ChatAdapterExtras,
                'stream',
            );

            // Assert
            expect(result.messages[1].content).toBe(undefined);
        });

        describe('when the adapter streams a chunk', () => {
            it('should call the "chunk" listeners', async () => {
                // Arrange
                const adapterController = adapterBuilder().withStreamText().create();
                const conversationPart = submitPrompt(
                    'Hello',
                    adapterController.adapter,
                    {} as ChatAdapterExtras,
                    'stream',
                );
                const chunkListener = vi.fn();
                conversationPart.on('chunk', chunkListener);

                // Act
                adapterController.next('Hi there');
                await waitForRenderCycle();

                // Assert
                expect(chunkListener).toHaveBeenCalledWith(conversationPart.messages[1].uid, 'Hi there');
            });
        });

        describe('when a listener is added for the "complete" event', () => {
            it('should call the listener when the conversation part is complete', async () => {
                // Arrange
                const adapterController = adapterBuilder().withStreamText().create();
                const conversationPart = submitPrompt(
                    'Hello',
                    adapterController.adapter,
                    {} as ChatAdapterExtras,
                    'stream',
                );
                const completeListener = vi.fn();
                conversationPart.on('complete', completeListener);

                // Act
                adapterController.complete();
                await waitForRenderCycle();

                // Assert
                expect(completeListener).toHaveBeenCalled();
            });
        });

        describe('when streaming is complete', () => {
            it('should update the conversation part status to "complete"', async () => {
                // Arrange
                const adapterController = adapterBuilder().withStreamText().create();
                const conversationPart = submitPrompt(
                    'Hello',
                    adapterController.adapter,
                    {} as ChatAdapterExtras,
                    'stream',
                );

                // Act
                adapterController.complete();
                await waitForRenderCycle();

                // Assert
                expect(conversationPart.status).toBe('complete');
            });

            it('should call the "complete" listeners', async () => {
                // Arrange
                const adapterController = adapterBuilder().withStreamText().create();
                const conversationPart = submitPrompt(
                    'Hello',
                    adapterController.adapter,
                    {} as ChatAdapterExtras,
                    'stream',
                );
                const completeListener = vi.fn();
                conversationPart.on('complete', completeListener);

                // Act
                adapterController.complete();
                await waitForRenderCycle();

                // Assert
                expect(completeListener).toHaveBeenCalled();
            });
        });

        describe('when streaming has an error', () => {
            it('should update the conversation part status to "error"', async () => {
                // Arrange
                const adapterController = adapterBuilder().withStreamText().create();
                const conversationPart = submitPrompt(
                    'Hello',
                    adapterController.adapter,
                    {} as ChatAdapterExtras,
                    'stream',
                );

                // Act
                adapterController.error(new Error('This is an error!'));
                await waitForRenderCycle();

                // Assert
                expect(conversationPart.status).toBe('error');
            });

            it('should call the "error" listeners', async () => {
                // Arrange
                const adapterController = adapterBuilder().withStreamText().create();
                const conversationPart = submitPrompt(
                    'Hello',
                    adapterController.adapter,
                    {} as ChatAdapterExtras,
                    'stream',
                );
                const errorListener = vi.fn();
                conversationPart.on('error', errorListener);

                // Act
                adapterController.error(new Error('This is an error!'));
                await waitForRenderCycle();

                // Assert
                expect(errorListener).toHaveBeenCalled();
            });
        });
    });
});
