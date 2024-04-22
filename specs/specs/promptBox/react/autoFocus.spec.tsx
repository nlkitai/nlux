import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';

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
            it('The textarea should be rendered with autoFocus', async () => {
                // Given
                const {container, rerender} = render(<AiChat adapter={adapterController!.adapter}/>);

                // When
                rerender(<AiChat adapter={adapterController!.adapter} promptBoxOptions={{autoFocus: true}}/>);
                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

                // Then
                // On re-render, React rather adds the autofocus attribute to the element!
                expect(textArea.autofocus).toBe(true);
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
