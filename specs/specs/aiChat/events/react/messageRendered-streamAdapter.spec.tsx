import {AiChat} from '@nlux-dev/react/src';
import {render, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {act} from 'react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForMdStreamToComplete, waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + stream adapter + events + messageRendered', () => {
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

    describe('When a message is rendered by the markdown renderer', () => {
        it('It should trigger the messageRendered event once rendering is complete', async () => {
            // Arrange
            const messageRenderedCallback = vi.fn();
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    events={{messageRendered: messageRenderedCallback}}
                />
            );

            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Act
            await act(async () => {
                adapterController!.next('Yo!');
                adapterController!.complete();
                await waitForMdStreamToComplete();
            });

            // Assert
            await waitFor(() => expect(messageRenderedCallback).toHaveBeenCalledOnce());

        });
    });
});
