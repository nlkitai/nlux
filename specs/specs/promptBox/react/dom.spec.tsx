import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';

describe('createAiChat() + promptBox', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When the component is created', () => {
        it('The promptBox should be rendered', async () => {
            // Given
            render(<AiChat adapter={adapterController!.adapter}/>);

            // When
            const promptBox = document.querySelector('.nlux-comp-prmptBox');

            // Then
            expect(promptBox).not.toBeFalsy();
        });

        it('The promptBox should contain text area', async () => {
            // Given
            render(<AiChat adapter={adapterController!.adapter}/>);

            // When
            const textArea = document.querySelector('.nlux-comp-prmptBox > textarea');

            // Then
            expect(textArea).not.toBeFalsy();
        });

        it('The promptBox should contain send button', async () => {
            // Given
            render(<AiChat adapter={adapterController!.adapter}/>);

            // When
            const sendButton = document.querySelector('.nlux-comp-prmptBox > button');

            // Then
            expect(sendButton).not.toBeFalsy();
        });
    });
});
