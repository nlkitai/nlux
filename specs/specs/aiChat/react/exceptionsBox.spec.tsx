import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('<AiChat /> + theme', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When an exception is thrown by the adapter', () => {
        it('The exception should be displayed in the exception box', async () => {
            // Given
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');

            // When
            adapterController!.reject('Error message');
            await waitForRenderCycle();

            // Then
            const exceptionBox = container.querySelector('.nlux-comp-exp_box')!;
            expect(exceptionBox).not.toBeNull();
            expect(exceptionBox.textContent).toEqual(expect.stringContaining('Failed to load content'));
        });
    });
});
