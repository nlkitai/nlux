import {AiChat, useAsRscAdapter} from '@nlux-dev/react/src';
import {render, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + rsc adapter + events + aiServerComponentStreamStarted', () => {
    describe('<AiChat /> + submit prompt + rsc adapter', () => {
        let adapterController: AdapterController | undefined;

        beforeEach(() => {
            adapterController = adapterBuilder()
                .withStreamServerComponent(true)
                .withBatchText(false)
                .withStreamText(false)
                .create();
        });

        afterEach(() => {
            adapterController = undefined;
        });

        describe('When a prompt is submitted', () => {
            it('It should trigger serverComponentStreamStarted event', async () => {
                // Arrange
                const serverComponentStreamStarted = vi.fn();
                const aiChat = (
                    <AiChat
                        adapter={adapterController!.adapter}
                        events={{serverComponentStreamStarted}}
                    />
                );

                const {container} = render(aiChat);
                await waitForReactRenderCycle();
                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

                // Act
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForReactRenderCycle();

                // Assert
                expect(serverComponentStreamStarted).toHaveBeenCalledOnce();
            });
        });

        describe('When a server component is renderer', () => {
            it('It should trigger serverComponentRendered event', async () => {
                // Arrange
                const createAdapter = useAsRscAdapter;
                const rscAdapter = createAdapter(
                    Promise.resolve({default: () => <div>HiXxx!</div>}),
                );
                const serverComponentRendered = vi.fn();
                const aiChat = (
                    <AiChat
                        adapter={rscAdapter}
                        events={{serverComponentRendered}}
                    />
                );

                const {container} = render(aiChat);
                await waitForReactRenderCycle();
                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

                // Act
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForReactRenderCycle();

                // Assert
                await waitFor(() => expect(serverComponentRendered).toHaveBeenCalledOnce());
            });
        });
    });
});
