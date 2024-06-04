import {AiChat} from '@nlux-dev/react/src';
import {render, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {act} from 'react';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForMdStreamToComplete, waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + stream adapter + markdown', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withBatchText(false)
            .withStreamText(true)
            .create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When markdown is being streamed', () => {
        it('Should be rendered correctly', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
            await userEvent.type(textArea, 'Hi AI{enter}');
            await waitForReactRenderCycle();

            // Act
            await act(async () => {
                adapterController!.next('**Hello');
                adapterController!.next(' Human!**');
                adapterController!.complete();
                await waitForMdStreamToComplete(50);
            });

            // Assert
            const markdownContainer: HTMLElement = container.querySelector('.nlux_msg_received .nlux-markdown-container')!;
            expect(markdownContainer).toBeInTheDocument();

            await waitFor(() => {
                expect(markdownContainer!.innerHTML).toEqual(
                    '<p><strong>Hello Human!</strong></p>\n',
                );
            });
        });
    });
});
