import {AiChat, ComposerOptions} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';

describe('<AiChat /> + composer + placeholder', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When no placeholder option is initially provided', () => {
        it('The composer should be rendered without a placeholder', async () => {
            // Arrange
            const {container} = render(<AiChat adapter={adapterController!.adapter}/>);

            // Act
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Assert
            expect(textArea.placeholder).toBe('');
        });

        describe('When a placeholder option is added', () => {
            it('The composer should be rendered with a placeholder', async () => {
                // Arrange
                const {container, rerender} = render(<AiChat adapter={adapterController!.adapter}/>);

                // Act
                rerender(<AiChat
                    adapter={adapterController!.adapter}
                    composerOptions={{placeholder: 'My composer'}}
                />);
                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

                // Assert
                expect(textArea.placeholder).toBe('My composer');
            });
        });
    });

    describe('When the component is created with placeholder option', () => {
        it('The composer should be rendered with a placeholder', async () => {
            // Arrange
            const composerOptions: ComposerOptions = {placeholder: 'My composer'};
            const {container} = render(
                <AiChat adapter={adapterController!.adapter} composerOptions={composerOptions}/>,
            );

            // Act
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Assert
            expect(textArea.placeholder).toBe('My composer');
        });
    });
});
