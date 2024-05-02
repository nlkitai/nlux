import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForMdStreamToComplete, waitForRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + fetch adapter + markdown', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withFetchText(true)
            .withStreamText(false)
            .create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When markdown is being fetched', () => {
        it('Should be rendered correctly', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('**Hello Human!**');
            await waitForMdStreamToComplete();

            // Assert
            const markdownContainer = container.querySelector('.nlux-md-cntr');
            expect(markdownContainer).toBeInTheDocument();
            expect(markdownContainer!.innerHTML).toEqual(
                expect.stringContaining('<strong>Hello Human!</strong>'),
            );
        });
    });
});
