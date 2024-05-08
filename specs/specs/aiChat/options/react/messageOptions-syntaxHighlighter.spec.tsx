import {highlighter} from '@nlux-dev/highlighter/src';
import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + messageOptions + syntaxHighlighter', () => {
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

    describe('When a syntax highlighter is used', () => {
        it('Code should be highlighted', async () => {
            // Arrange
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{syntaxHighlighter: highlighter}}
                />
            );
            const {container} = render(aiChat);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            await userEvent.type(textArea, 'Write some JS code{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('```js\nvar someJsCode = true;\n\n```');
            await waitForRenderCycle();

            // Assert
            const responseElement = container.querySelector('.nlux_cht_itm_in .nlux-md-cntr');
            expect(responseElement!.innerHTML).toBe(
                '<div class="code-block"><pre data-language="js" class="highlighter-dark"><div><span class="hljs-keyword">var</span> someJsCode = <span class="hljs-literal">true</span>;\n</div></pre></div>\n',
            );
        });
    });

    describe('When no syntax highlighter is used', () => {
        it('Code should not be highlighted', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            await userEvent.type(textArea, 'Write some JS code{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('```\nvar someJsCode = true;\n```');
            await waitForRenderCycle();

            // Assert
            const responseElement = container.querySelector('.nlux_cht_itm_in .nlux-md-cntr');
            expect(responseElement?.innerHTML).toEqual(
                expect.stringContaining('<div class="code-block"><pre><div>var someJsCode = true;\n</div></pre></div>'),
            );
        });
    });

    describe('When a syntax highlighter is removed after being set', () => {
        it('Code should not be highlighted', async () => {
            // Arrange
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{syntaxHighlighter: highlighter}}
                />
            );
            const {container, rerender} = render(aiChat);
            await waitForRenderCycle();

            // Act
            rerender(
                <AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{syntaxHighlighter: undefined}}
                />,
            );
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Write some JS code{enter}');
            await waitForRenderCycle();

            adapterController!.resolve('```js\nvar someJsCode = true;\n```');
            await waitForRenderCycle();

            // Assert
            const responseElement = container.querySelector('.nlux_cht_itm_in .nlux-md-cntr');
            expect(responseElement?.innerHTML).toEqual(
                expect.stringContaining(
                    '<div class="code-block"><pre data-language="js"><div>var someJsCode = true;\n</div></pre></div>',
                ),
            );
        });
    });
});