import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + composerOptions + autoFocus', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withBatchText().create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When the AiChat is created without autoFocus', () => {
        it('The composer should not be focused', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            // Act
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Assert
            expect(document.activeElement).not.toBe(textArea);
        });
    });

    describe('When a message is sent then focus is lost', () => {
        it('The composer should not be focused when a response is received', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            adapterController?.resolve('Response');
            textArea.blur();
            await waitForReactRenderCycle();

            // Assert
            expect(document.activeElement).not.toBe(textArea);
        });
    });

    describe('When the AiChat is created with autoFocus', () => {
        it('The composer should be focused', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter} composerOptions={{
                autoFocus: true,
            }}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            // Act
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Assert
            expect(document.activeElement).toBe(textArea);
        });

        describe('When a message is sent then focus is lost', () => {
            it('The composer should be re-focused when a response is received', async () => {
                // Arrange
                const aiChat = <AiChat adapter={adapterController!.adapter} composerOptions={{
                    autoFocus: true,
                }}/>;
                const {container} = render(aiChat);
                await waitForReactRenderCycle();
                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

                // Act
                textArea.focus();
                await waitForReactRenderCycle();

                // Assert
                expect(document.activeElement).toBe(textArea);
            });

            it('The composer should be re-focused after submission error', async () => {
                // Arrange
                const aiChat = <AiChat adapter={adapterController!.adapter} composerOptions={{
                    autoFocus: true,
                }}/>;
                const {container} = render(aiChat);
                await waitForReactRenderCycle();
                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
                textArea.blur();

                // Act
                await userEvent.type(textArea, 'Hello{enter}');
                adapterController?.reject('Error message');
                await waitForReactRenderCycle();

                // Assert
                expect(document.activeElement).toBe(textArea);
            });
        });
    });
});
