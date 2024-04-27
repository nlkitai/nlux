import {createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + exceptionBox', () => {
    describe('When an exception is thrown by the adapter', () => {
        it('The exception should be displayed in the exception box', async () => {
            // Arrange
            const adapterController = adapterBuilder().withFetchText().create();
            const rootElement = document.createElement('div');
            document.body.append(rootElement);

            const aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');

            // Act
            adapterController.reject('Error message');
            await waitForRenderCycle();

            // Assert
            const exceptionBox = rootElement.querySelector('.nlux-comp-exp_box')!;
            expect(exceptionBox).not.toBeNull();
            expect(exceptionBox.textContent).toEqual(expect.stringContaining('Failed to load content'));
        });
    });
});
