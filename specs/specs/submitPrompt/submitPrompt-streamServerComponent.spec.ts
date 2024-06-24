import {ChatAdapter, ChatAdapterExtras} from '@nlux-dev/core/src';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {submitPrompt} from '@shared/services/submitPrompt/submitPromptImpl';
import {adapterBuilder} from '../../utils/adapterBuilder';
import {AdapterController} from '../../utils/adapters';

describe('submitPrompt() + with server component generation', () => {
    let adapterController: AdapterController<string> | undefined;
    let extras: ChatAdapterExtras<string> | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder<string>()
            .withStreamServerComponent(true)
            .withBatchText(false)
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
        expect(adapterController?.streamServerComponentMock).toHaveBeenCalled();
    });

    it('Should pass the prompt to the server component adapter', () => {
        // Arrange
        const prompt = 'What is the weather like today?';
        const adapter: ChatAdapter<string> = adapterController!.adapter;

        // Act
        submitPrompt(prompt, adapter, extras!);

        // Assert
        expect(adapterController?.streamServerComponentMock).toHaveBeenCalledWith(
            prompt,
        );
    });
});
