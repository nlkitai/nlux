import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {act} from 'react';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForMdStreamToComplete, waitForMilliseconds, waitForReactRenderCycle} from '../../../utils/wait';

describe.each([
        {dataTransferMode: 'batch'},
        // {dataTransferMode: 'stream'},
    ] satisfies Array<{dataTransferMode: 'stream' | 'batch'}>,
)('<AiChat /> + adapter($mode) + personaOptions extras', ({dataTransferMode}) => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withBatchText().create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    it('Persona Options should be provided to the adapter as part of extras attribute', async () => {
        // Arrange
        const testPersonaOptions = {
            assistant: {
                name: 'Test Assistant',
                picture: 'https://example.com/test-assistant-image.png',
                tagline: 'Test Assistant Tagline',
            },
            user: {
                name: 'Test User',
                picture: 'https://example.com/test-user-image.png',
            },
        };

        const {container} = render(
            <AiChat adapter={adapterController!.adapter} personaOptions={testPersonaOptions}/>,
        );

        await waitForReactRenderCycle();
        const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

        // Act
        await userEvent.type(textArea, 'Hello{enter}');
        await waitForReactRenderCycle();

        // Assert
        expect(adapterController!.getLastExtras()?.aiChatProps?.personaOptions)
            .toEqual(testPersonaOptions);
    });

    describe('When persona options are updated', () => {
        it('New options should be provided to the adapter as part of extras attribute', async () => {
            // Arrange
            const testPersonaOptions = {
                assistant: {
                    name: 'Test Assistant',
                    picture: 'https://example.com/test-assistant-image.png',
                    tagline: 'Test Assistant Tagline',
                },
                user: {
                    name: 'Test User',
                    picture: 'https://example.com/test-user-image.png',
                },
            };

            const newPersonaOptions = {
                assistant: {
                    name: 'New Assistant',
                    picture: 'https://example.com/new-assistant-image.png',
                    tagline: 'New Assistant Tagline',
                },
                user: {
                    name: 'New User',
                    picture: 'https://example.com/new-user-image.png',
                },
            };

            const {container, rerender} = render(
                <AiChat adapter={adapterController!.adapter} personaOptions={testPersonaOptions}/>,
            );
            await waitForReactRenderCycle();

            let textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            await act(async () => {
                adapterController!.resolve('Cheers!');
                adapterController!.complete();
                await waitForMdStreamToComplete(20);
            });

            // Assert
            expect(adapterController!.getLastExtras()?.aiChatProps?.personaOptions)
                .toEqual(testPersonaOptions);

            // Act
            rerender(<AiChat adapter={adapterController!.adapter} personaOptions={newPersonaOptions}/>);
            await waitForReactRenderCycle();

            textArea = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            textArea.focus();
            await waitForReactRenderCycle();

            await userEvent.type(textArea, 'Bonjour{enter}');
            await waitForMilliseconds(100);

            // Assert
            expect(adapterController!.getLastExtras()?.aiChatProps?.personaOptions)
                .toEqual(newPersonaOptions);
        });
    });
});
