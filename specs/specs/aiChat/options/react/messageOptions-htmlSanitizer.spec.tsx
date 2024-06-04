import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {act} from 'react';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForMdStreamToComplete, waitForReactRenderCycle, waitForRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + messageOptions + htmlSanitizer', () => {
    let adapterController: AdapterController | undefined = undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withBatchText(true)
            .withStreamText(false)
            .create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When htmlSanitizer is not set', () => {
        it('Message content should render the message as is', async () => {
            // Arrange
            const {container} = render(<AiChat adapter={adapterController!.adapter}/>);
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Give me a link please{enter}');
            await waitForReactRenderCycle();

            adapterController!.resolve('Click [here](https://example.com)');
            await waitForReactRenderCycle();

            // Assert
            const markdownContainer = container.querySelector('.nlux-comp-chatItem--received .nlux-markdown-container');
            expect(markdownContainer).toBeInTheDocument();

            const link = markdownContainer!.querySelector('a');
            expect(link).toBeInTheDocument();
            expect(link!.getAttribute('target')).toBe('_blank');
        });
    });

    describe('When htmlSanitizer is set to a custom function', () => {
        it('Renderer user prompt content should be sanitized using the custom function', async () => {
            // Arrange
            const {container} = render(
                <AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{
                        htmlSanitizer: (html: string) => html.toLowerCase().replaceAll('h', 'x'),
                    }}
                />,
            );
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hi! Henry The Assistant. Help! Give me a hyperlink!{enter}');
            await waitForRenderCycle();

            adapterController!.resolve('Hi! [here](https://haha.hawai) I hand over a link! Haha :) !');
            await act(() => waitForMdStreamToComplete(100));

            // Assert
            const userMessageContainer = container.querySelector('.nlux-comp-chatItem--sent .nlux-markdown-container') as HTMLElement | null;
            expect(userMessageContainer!.innerHTML).toBe('<p>xi! xenry txe assistant. xelp! give me a xyperlink!</p>\n');
        });

        it('Renderer ai message content should be sanitized using the custom function', async () => {
            // Arrange
            const {container} = render(
                <AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{
                        htmlSanitizer: (html: string) => html
                            .toLowerCase()
                            .replaceAll('h', 'x')
                            .replaceAll('<p>', '<div>')
                            .replaceAll('</p>', '</div>'),
                    }}
                />,
            );
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hi! Henry The Assistant. Help! Give me a hyperlink!{enter}');
            await waitForRenderCycle();

            adapterController!.resolve('Hi! [here](https://haha.hawai) I hand over a link! Haha :) !');
            await act(() => waitForMdStreamToComplete(100));

            // Assert
            const markdownContainer = container.querySelector('.nlux-comp-chatItem--received .nlux-markdown-container') as HTMLElement | null;
            expect(markdownContainer).toBeInTheDocument();
            expect(markdownContainer!.innerHTML).toBe('<div>xi! <a xref="xttps://xaxa.xawai" target="_blank">xere</a> i xand over a link! xaxa :) !</div>\n');
        });
    });
});
