import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {NLErrors} from '@shared/types/exceptions/errors';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + theme', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withBatchText().create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When an exception is thrown by the adapter', () => {
        it('The exception should be displayed in the exception box', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');

            // Act
            adapterController!.reject('Error message');
            await waitForReactRenderCycle();

            // Assert
            const exceptionBox = container.querySelector('.nlux-comp-exceptionBox')!;
            expect(exceptionBox).not.toBeNull();
            expect(exceptionBox.textContent).toEqual(NLErrors['failed-to-load-content']);
        });
    });
});
