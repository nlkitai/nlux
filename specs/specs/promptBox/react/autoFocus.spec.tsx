import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('<AiChat /> + promptBox + autoFocus', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When no autoFocus option is initially provided', () => {
        it('The textarea should be rendered without autoFocus', async () => {
            // Given
            const {container} = render(<AiChat adapter={adapterController!.adapter}/>);

            // When
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Then
            expect(textArea.autofocus).toBe(false);
        });

        describe('When autoFocus option is set to true after initial render', () => {
            it('The textarea should be auto-focused', async () => {
                // Given
                const {container, rerender} = render(<AiChat adapter={adapterController!.adapter}/>);

                // When
                await waitForRenderCycle();
                const textArea1: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

                // Then
                expect(document.activeElement).not.toBe(textArea1);

                // When
                rerender(<AiChat adapter={adapterController!.adapter} promptBoxOptions={{autoFocus: true}}/>);
                const textArea2: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await waitForRenderCycle();

                // Then
                expect(document.activeElement).toBe(textArea2);
            });
        });
    });

    describe('When autoFocus option is initially set to true', () => {
        it('The textarea should be focused on render', async () => {
            // Given
            const {container} = render(
                <AiChat adapter={adapterController!.adapter} promptBoxOptions={{autoFocus: true}}/>,
            );

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Then
            // React doesn't render autofocus attribute but focuses the element — On initial render!
            expect(document.activeElement).toBe(textArea);
        });

        describe('When autoFocus option is set to false after initial render', () => {
            it('The textarea should be rendered without autoFocus', async () => {
                // Given
                const {container, rerender} = render(
                    <AiChat adapter={adapterController!.adapter} promptBoxOptions={{autoFocus: true}}/>,
                );

                // When
                rerender(<AiChat adapter={adapterController!.adapter} promptBoxOptions={{autoFocus: false}}/>);
                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

                // Then
                expect(textArea.autofocus).toBe(false);
            });
        });
    });
});
