import {ComposerOptions} from '@nlux-dev/core/src';
import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + composer + submitShortcut', () => {
    let adapterController: AdapterController | undefined;
    let rootElement: HTMLElement;

    beforeEach(() => {
        adapterController = adapterBuilder().withBatchText().create();
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        adapterController = undefined;
        rootElement?.remove();
    });

    describe('When no submitShortcut option is initially provided', () => {
        it('The prompt should be submitted when the user presses the Enter key', async () => {
            // Arrange
            const composerOptions: ComposerOptions = {placeholder: 'My composer'};
            const {container} = render(
                <AiChat adapter={adapterController!.adapter} composerOptions={composerOptions}/>,
            );
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello, World!');
            await waitForRenderCycle();

            // Act
            await userEvent.type(textArea, '{enter}');
            await waitForRenderCycle();

            // Assert
            expect(adapterController!.batchTextMock).toHaveBeenCalledWith('Hello, World!');
        });

        it('The prompt should not be submitted when the textarea is empty and the user presses the Enter key',
            async () => {
                // Arrange
                const composerOptions: ComposerOptions = {placeholder: 'My composer'};
                const {container} = render(
                    <AiChat adapter={adapterController!.adapter} composerOptions={composerOptions}/>,
                );
                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, '{enter}');
                await waitForRenderCycle();

                // Assert
                expect(adapterController!.batchTextMock).not.toHaveBeenCalled();
            },
        );

        it('The prompt should not be submitted when the user presses the Ctrl+Enter key', async () => {
            // Arrange
            const composerOptions: ComposerOptions = {placeholder: 'My composer'};
            const {container} = render(
                <AiChat adapter={adapterController!.adapter} composerOptions={composerOptions}/>,
            );
            const composer: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(composer, 'Hello, World!');
            await waitForRenderCycle();

            // Act
            await userEvent.type(composer, '{Control>}{Enter}');
            await waitForRenderCycle();

            // Assert
            expect(adapterController!.batchTextMock).not.toHaveBeenCalled();
        });

        it('The prompt should not be submitted when the user presses the Meta+Enter key', async () => {
            // Arrange
            const composerOptions: ComposerOptions = {placeholder: 'My composer'};
            const {container} = render(
                <AiChat adapter={adapterController!.adapter} composerOptions={composerOptions}/>,
            );
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello, World!');
            await waitForRenderCycle();

            // Act
            await userEvent.type(textArea, '{Meta>}{Enter}');
            await waitForRenderCycle();

            // Assert
            expect(adapterController!.batchTextMock).not.toHaveBeenCalled();
        });

        describe('When submitShortcut option is set to CommandEnter after initial render', () => {
            it('The prompt should not be submitted when the user presses the Enter key', async () => {
                // Arrange
                const composerOptions: ComposerOptions = {placeholder: 'My composer'};
                const {container, rerender} = render(
                    <AiChat adapter={adapterController!.adapter} composerOptions={composerOptions}/>,
                );

                const composer: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(composer, 'Hello, World!');
                await waitForRenderCycle();

                // Act
                rerender(
                    <AiChat adapter={adapterController!.adapter} composerOptions={{submitShortcut: 'CommandEnter'}}/>,
                );
                await userEvent.type(composer, '{enter}');
                await waitForRenderCycle();

                // Assert
                expect(adapterController!.batchTextMock).not.toHaveBeenCalled();
            });

            it('The prompt should be submitted when the user presses the Ctrl+Enter key', async () => {
                // Arrange
                const composerOptions: ComposerOptions = {placeholder: 'My composer'};
                const {container, rerender} = render(
                    <AiChat adapter={adapterController!.adapter} composerOptions={composerOptions}/>,
                );

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();

                // Act
                rerender(
                    <AiChat adapter={adapterController!.adapter} composerOptions={{submitShortcut: 'CommandEnter'}}/>,
                );
                await userEvent.type(textArea, '{Control>}{Enter}');
                await waitForRenderCycle();

                // Assert
                expect(adapterController!.batchTextMock).toHaveBeenCalledWith('Hello, World!');
            });

            it('The prompt should be submitted when the user presses the Meta+Enter key', async () => {
                // Arrange
                const composerOptions: ComposerOptions = {placeholder: 'My composer'};
                const {container, rerender} = render(
                    <AiChat adapter={adapterController!.adapter} composerOptions={composerOptions}/>,
                );

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();

                // Act
                rerender(
                    <AiChat adapter={adapterController!.adapter} composerOptions={{submitShortcut: 'CommandEnter'}}/>,
                );

                await userEvent.type(textArea, '{Meta>}{Enter}');
                await waitForRenderCycle();

                // Assert
                expect(adapterController!.batchTextMock).toHaveBeenCalledWith('Hello, World!');
            });
        });
    });

    describe('When submitShortcut option is initially set to CommandEnter', () => {
        it('The prompt should not be submitted when the user presses the Enter key', async () => {
            // Arrange
            const composerOptions: ComposerOptions = {submitShortcut: 'CommandEnter'};
            const {container} = render(
                <AiChat adapter={adapterController!.adapter} composerOptions={composerOptions}/>,
            );

            const composer: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(composer, 'Hello, World!');
            await waitForRenderCycle();

            // Act
            await userEvent.type(composer, '{enter}');
            await waitForRenderCycle();

            // Assert
            expect(adapterController!.batchTextMock).not.toHaveBeenCalled();
        });

        it('The prompt should be submitted when the user presses the Ctrl+Enter key', async () => {
            // Arrange
            const composerOptions: ComposerOptions = {submitShortcut: 'CommandEnter'};
            const {container} = render(
                <AiChat adapter={adapterController!.adapter} composerOptions={composerOptions}/>,
            );

            const composer: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(composer, 'Hello, World!');
            await waitForRenderCycle();

            // Act
            await userEvent.type(composer, '{Control>}{Enter}');
            await waitForRenderCycle();

            // Assert
            expect(adapterController!.batchTextMock).toHaveBeenCalledWith('Hello, World!');
        });

        it('The prompt should be submitted when the user presses the Meta+Enter key', async () => {
            // Arrange
            const composerOptions: ComposerOptions = {submitShortcut: 'CommandEnter'};
            const {container} = render(
                <AiChat adapter={adapterController!.adapter} composerOptions={composerOptions}/>,
            );

            const composer: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(composer, 'Hello, World!');
            await waitForRenderCycle();

            // Act
            await userEvent.type(composer, '{Meta>}{Enter}');
            await waitForRenderCycle();

            // Assert
            expect(adapterController!.batchTextMock).toHaveBeenCalledWith('Hello, World!');
        });

        describe('When submitShortcut option is set to Enter after initial render', () => {
            it('The prompt should be submitted when the user presses the Enter key', async () => {
                // Arrange
                const composerOptions: ComposerOptions = {submitShortcut: 'CommandEnter'};
                const {container, rerender} = render(
                    <AiChat adapter={adapterController!.adapter} composerOptions={composerOptions}/>,
                );

                const composer: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(composer, 'Hello, World!');
                await waitForRenderCycle();

                // Act
                rerender(
                    <AiChat adapter={adapterController!.adapter} composerOptions={{submitShortcut: 'Enter'}}/>,
                );
                await userEvent.type(composer, '{enter}');
                await waitForRenderCycle();

                // Assert
                expect(adapterController!.batchTextMock).toHaveBeenCalledWith('Hello, World!');
            });

            it('The prompt should not be submitted when the user presses the Ctrl+Enter key', async () => {
                // Arrange
                const composerOptions: ComposerOptions = {submitShortcut: 'CommandEnter'};
                const {container, rerender} = render(
                    <AiChat adapter={adapterController!.adapter} composerOptions={composerOptions}/>,
                );

                const composer: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(composer, 'Hello, World!');
                await waitForRenderCycle();

                // Act
                rerender(
                    <AiChat adapter={adapterController!.adapter} composerOptions={{submitShortcut: 'Enter'}}/>,
                );
                await userEvent.type(composer, '{Control>}{Enter}');
                await waitForRenderCycle();

                // Assert
                expect(adapterController!.batchTextMock).not.toHaveBeenCalled();
            });

            it('The prompt should not be submitted when the user presses the Meta+Enter key', async () => {
                // Arrange
                const composerOptions: ComposerOptions = {submitShortcut: 'CommandEnter'};
                const {container, rerender} = render(
                    <AiChat adapter={adapterController!.adapter} composerOptions={composerOptions}/>,
                );

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();

                // Act
                rerender(
                    <AiChat adapter={adapterController!.adapter} composerOptions={{submitShortcut: 'Enter'}}/>,
                );
                await userEvent.type(textArea, '{Meta>}{Enter}');
                await waitForRenderCycle();

                // Assert
                expect(adapterController!.batchTextMock).not.toHaveBeenCalled();
            });
        });

        describe('When submitShortcut option is removed after the initial render', () => {
            it('The prompt should be submitted when the user presses the Enter key', async () => {
                // Arrange
                const composerOptions: ComposerOptions = {submitShortcut: 'CommandEnter'};
                const {container, rerender} = render(
                    <AiChat adapter={adapterController!.adapter} composerOptions={composerOptions}/>,
                );

                const composer: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(composer, 'Hello, World!');
                await waitForRenderCycle();

                // Act
                rerender(<AiChat adapter={adapterController!.adapter} composerOptions={{}}/>);
                await userEvent.type(composer, '{enter}');
                await waitForRenderCycle();

                // Assert
                expect(adapterController!.batchTextMock).toHaveBeenCalledWith('Hello, World!');
            });

            it('The prompt should not be submitted when the user presses the Ctrl+Enter key', async () => {
                // Arrange
                const composerOptions: ComposerOptions = {submitShortcut: 'CommandEnter'};
                const {container, rerender} = render(
                    <AiChat adapter={adapterController!.adapter} composerOptions={composerOptions}/>,
                );

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();

                // Act
                rerender(<AiChat adapter={adapterController!.adapter} composerOptions={{}}/>);
                await userEvent.type(textArea, '{Control>}{Enter}');
                await waitForRenderCycle();

                // Assert
                expect(adapterController!.batchTextMock).not.toHaveBeenCalled();
            });

            it('The prompt should not be submitted when the user presses the Meta+Enter key', async () => {
                // Arrange
                const composerOptions: ComposerOptions = {submitShortcut: 'CommandEnter'};
                const {container, rerender} = render(
                    <AiChat adapter={adapterController!.adapter} composerOptions={composerOptions}/>,
                );

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();

                // Act
                rerender(<AiChat adapter={adapterController!.adapter} composerOptions={{}}/>);
                await userEvent.type(textArea, '{Meta>}{Enter}');
                await waitForRenderCycle();

                // Assert
                expect(adapterController!.batchTextMock).not.toHaveBeenCalled();
            });
        });
    });
});
