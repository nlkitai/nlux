import {AiChat, PromptRenderer} from '@nlux-dev/react/src';
import {render, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../utils/wait';

describe('<AiChat /> + promptRenderer', () => {
    let adapterController: AdapterController | undefined = undefined;

    describe('When a prompt renderer is used', () => {
        beforeEach(() => {
            adapterController = adapterBuilder()
                .withFetchText(true)
                .withStreamText(false)
                .create();
        });

        afterEach(() => {
            adapterController = undefined;
        });

        it('Should render the submitted prompt', async () => {
            // Arrange
            const promptRenderer: PromptRenderer = ({prompt, uid}) => (
                <div>
                    <span className="user-prompt">{prompt}</span>
                </div>
            );

            const promptRendererSpy = vi.fn().mockImplementation(promptRenderer);
            const {container} = render(
                <AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{
                        promptRenderer: promptRendererSpy
                    }}
                />
            );
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello custom renderer!{enter}');
            await waitForReactRenderCycle();

            // Assert
            expect(promptRendererSpy).toHaveBeenCalledWith({
                prompt: 'Hello custom renderer!',
                uid: expect.any(String)
            });

            expect(container.innerHTML).toContain(
                '<div><span class="user-prompt">Hello custom renderer!</span></div>'
            );
        });
    });

    describe('When a prompt renderer is not used', () => {
        beforeEach(() => {
            adapterController = adapterBuilder()
                .withFetchText(true)
                .withStreamText(false)
                .create();
        });

        afterEach(() => {
            adapterController = undefined;
        });

        it('Should render the default prompt', async () => {
            // Arrange
            const {container} = render(
                <AiChat
                    adapter={adapterController!.adapter}
                />
            );
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello default renderer!{enter}');
            await waitForReactRenderCycle();

            // Assert
            expect(container.innerHTML).toEqual(
                expect.stringContaining(
                    '<div class="nlux-md-strm-root"><div class="nlux-md-cntr"><p>Hello default renderer!</p>\n</div></div>'
                )
            );
        });
    });
});
