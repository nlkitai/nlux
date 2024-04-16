import {ChatAdapterExtras, submitPrompt} from '@nlux-dev/core/src';
import {ChatAdapter} from '@nlux/core';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../utils/adapterBuilder';
import {AdapterController} from '../../utils/adapters';
import {waitForMilliseconds} from '../../utils/wait';

describe('submitPrompt() + fetch data transfer mode', () => {
    let adapterController: AdapterController<string> | undefined;
    let extras: ChatAdapterExtras<string> | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder<string>()
            .withFetchText(true)
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
        expect(adapterController?.fetchTextMock).toHaveBeenCalled();
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
                expect.objectContaining({
                    status: 'complete',
                    uid: expect.any(String),
                    items: [],
                }),
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
        it('Should emit userMessageReceived event when callback is registered', async () => {
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
    });
});
