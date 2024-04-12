import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('<AiChat /> + promptBox', () => {
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
            const {container} = render(<AiChat adapter={adapterController!.adapter}/>);

            // When
            const promptBox = container.querySelector('.nlux-comp-prmptBox');

            // Then
            expect(promptBox).not.toBeFalsy();
        });

        it('The promptBox should contain text area', async () => {
            // Given
            const {container} = render(<AiChat adapter={adapterController!.adapter}/>);

            // container
            const textArea = container.querySelector('.nlux-comp-prmptBox > textarea');

            // Then
            expect(textArea).not.toBeFalsy();
        });

        it('The promptBox should contain send button', async () => {
            // Given
            const {container} = render(<AiChat adapter={adapterController!.adapter}/>);

            // When
            const sendButton = container.querySelector('.nlux-comp-prmptBox > button');

            // Then
            expect(sendButton).not.toBeFalsy();
        });

        it('The send button should be disabled by default', async () => {
            // Given
            const {container} = render(<AiChat adapter={adapterController!.adapter}/>);

            // When
            const sendButton = container.querySelector('.nlux-comp-prmptBox > button');

            // Then
            expect(sendButton).toHaveAttribute('disabled');
        });

        describe('When the user types a message', () => {
            it('The send button should be enabled', async () => {
                // Given
                const {container} = render(<AiChat adapter={adapterController!.adapter}/>);
                await waitForRenderCycle();

                // When
                const textArea = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello');

                // Then
                const sendButton = container.querySelector('.nlux-comp-prmptBox > button');
                expect(sendButton).not.toHaveAttribute('disabled');
            });
        });
    });
});
