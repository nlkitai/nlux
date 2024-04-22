import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('<AiChat /> + prop promptBox + focus', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When the AiChat is created without autoFocus', () => {
        it('The prompt box should not be focused', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForRenderCycle();

            // Act
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Assert
            expect(document.activeElement).not.toBe(textArea);
        });
    });

    describe('When a message is sent then focus is lost', () => {
        it('The prompt box should not be focused when a response is received', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            adapterController?.resolve('Response');
            textArea.blur();
            await waitForRenderCycle();

            // Assert
            expect(document.activeElement).not.toBe(textArea);
        });
    });

    describe('When the AiChat is created with autoFocus', () => {
        it('The prompt box should be focused', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter} promptBoxOptions={{
                autoFocus: true,
            }}/>;
            const {container} = render(aiChat);
            await waitForRenderCycle();

            // Act
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Assert
            expect(document.activeElement).toBe(textArea);
        });

        describe('When a message is sent then focus is lost', () => {
            it('The prompt box should be re-focused when a response is received', async () => {
                // Arrange
                const aiChat = <AiChat adapter={adapterController!.adapter} promptBoxOptions={{
                    autoFocus: true,
                }}/>;
                const {container} = render(aiChat);
                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

                // Act
                textArea.focus();
                await waitForRenderCycle();

                // Assert
                expect(document.activeElement).toBe(textArea);
            });

            it('The prompt box should be re-focused after submission error', async () => {
                // Arrange
                const aiChat = <AiChat adapter={adapterController!.adapter} promptBoxOptions={{
                    autoFocus: true,
                }}/>;
                const {container} = render(aiChat);
                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                textArea.blur();

                // Act
                await userEvent.type(textArea, 'Hello{enter}');
                adapterController?.reject('Error message');
                await waitForRenderCycle();

                // Assert
                expect(document.activeElement).toBe(textArea);
            });
        });
    });
});
