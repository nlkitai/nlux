import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('<AiChat /> + composer', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withBatchText().create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When the component is created', () => {
        it('The composer should be rendered', async () => {
            // Arrange
            const {container} = render(<AiChat adapter={adapterController!.adapter}/>);

            // Act
            const composer = container.querySelector('.nlux-comp-prmptBox');

            // Assert
            expect(composer).not.toBeFalsy();
        });

        it('The composer should contain text area', async () => {
            // Arrange
            const {container} = render(<AiChat adapter={adapterController!.adapter}/>);

            // container
            const textArea = container.querySelector('.nlux-comp-prmptBox > textarea');

            // Assert
            expect(textArea).not.toBeFalsy();
        });

        it('The composer should contain send button', async () => {
            // Arrange
            const {container} = render(<AiChat adapter={adapterController!.adapter}/>);

            // Act
            const sendButton = container.querySelector('.nlux-comp-prmptBox > button');

            // Assert
            expect(sendButton).not.toBeFalsy();
        });

        it('The send button should be disabled by default', async () => {
            // Arrange
            const {container} = render(<AiChat adapter={adapterController!.adapter}/>);

            // Act
            const sendButton = container.querySelector('.nlux-comp-prmptBox > button');

            // Assert
            expect(sendButton).toHaveAttribute('disabled');
        });

        describe('When the user types a message', () => {
            it('The send button should be enabled', async () => {
                // Arrange
                const {container} = render(<AiChat adapter={adapterController!.adapter}/>);
                await waitForRenderCycle();

                // Act
                const textArea = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello');

                // Assert
                const sendButton = container.querySelector('.nlux-comp-prmptBox > button');
                expect(sendButton).not.toHaveAttribute('disabled');
            });
        });
    });
});
