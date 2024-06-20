import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {AdapterController} from '../../../utils/adapters';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AiChat, Markdown, ResponseRenderer} from '@nlux-dev/react/src';
import {memo} from 'react';
import {render} from '@testing-library/react';
import {waitForReactRenderCycle} from '../../../utils/wait';
import userEvent from '@testing-library/user-event';

describe('<AiChat /> + <Markdown /> + inside custom renderers', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withBatchText(true)
            .withStreamText(false)
            .create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    it('should parse and render the markdown content', async () => {
        // Arrange
        const responseRenderer: ResponseRenderer<string> = memo((props) => {
            const {dataTransferMode, content} = props;
            return (
                <div>
                    <h1>Response Renderer</h1>
                    <Markdown>{content}</Markdown>
                </div>
            );
        });

        const {container} = render(
            <AiChat
                adapter={adapterController!.adapter}
                messageOptions={{responseRenderer}}
            />,
        );
        const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
        await waitForReactRenderCycle();

        // Act
        await userEvent.type(textArea, 'Hello{enter}');
        await waitForReactRenderCycle();

        adapterController!.resolve('**Yo!**');
        await waitForReactRenderCycle();

        // Assert
        const responseElement = container.querySelector('.nlux-comp-chatItem--received');
        expect(responseElement!.innerHTML).toEqual(
            expect.stringContaining('<div class="nlux-markdown-container"><p><strong>Yo!</strong></p>\n</div>'),
        );
    });
});
