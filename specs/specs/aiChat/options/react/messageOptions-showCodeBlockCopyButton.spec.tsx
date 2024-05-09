import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForMdStreamToComplete, waitForRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + messageOptions + showCodeBlockCopyButton', () => {
    let adapterController: AdapterController | undefined = undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withFetchText(true)
            .withStreamText(false)
            .create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When showCodeBlockCopyButton is not set', () => {
        it('Markdown code blocks should have a copy button', async () => {
            // Arrange
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                />
            );
            const {container} = render(aiChat);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            await userEvent.type(textArea, 'Give me some code block please{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('This is code block\n```js\nconsole.log("Hello, World!");\n```\n');
            await waitForMdStreamToComplete(100);

            // Assert
            const markdownContainer = container.querySelector('.nlux_cht_itm_in .nlux-md-cntr');
            expect(markdownContainer).toBeInTheDocument();

            const button = markdownContainer!.querySelector('.nlux-cpy-btn');
            expect(button).toBeInTheDocument();
        });
    });

    describe('When showCodeBlockCopyButton is set to false', () => {
        it('Markdown code blocks should not have a copy button', async () => {
            // Arrange
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{showCodeBlockCopyButton: false}}
                />
            );
            const {container} = render(aiChat);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            await userEvent.type(textArea, 'Give me some code block please{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('This is code block\n```js\nconsole.log("Hello, World!");\n```\n');
            await waitForMdStreamToComplete(100);

            // Assert
            const markdownContainer = container.querySelector('.nlux_cht_itm_in .nlux-md-cntr');
            expect(markdownContainer).toBeInTheDocument();

            const button = markdownContainer!.querySelector('.nlux-cpy-btn');
            expect(button).not.toBeInTheDocument();
        });
    });

    describe('When showCodeBlockCopyButton is set to true', () => {
        it('Markdown code blocks should have a copy button', async () => {
            // Arrange
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{showCodeBlockCopyButton: true}}
                />
            );
            const {container} = render(aiChat);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            await userEvent.type(textArea, 'Give me some code block please{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('This is code block\n```js\nconsole.log("Hello, World!");\n```\n');
            await waitForMdStreamToComplete(100);

            // Assert
            const markdownContainer = container.querySelector('.nlux_cht_itm_in .nlux-md-cntr');
            expect(markdownContainer).toBeInTheDocument();

            const button = markdownContainer!.querySelector('.nlux-cpy-btn');
            expect(button).toBeInTheDocument();
        });
    });
});
