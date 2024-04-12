import {AiChat} from '@nlux-dev/react/src';
import {PromptBoxOptions} from '@nlux/core';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + promptBox + submitShortcut', () => {
    let adapterController: AdapterController | undefined;
    let rootElement: HTMLElement;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        adapterController = undefined;
        rootElement?.remove();
    });

    describe('When no submitShortcut option is initially provided', () => {
        it('The prompt should be submitted when the user presses the Enter key', async () => {
            // Given
            const promptBoxOptions: PromptBoxOptions = {placeholder: 'My prompt-box'};
            const {container} = render(
                <AiChat adapter={adapterController!.adapter} promptBoxOptions={promptBoxOptions}/>,
            );
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello, World!');
            await waitForRenderCycle();

            // When
            await userEvent.type(textArea, '{enter}');
            await waitForRenderCycle();

            // Then
            expect(adapterController!.fetchTextMock).toHaveBeenCalledWith('Hello, World!');
        });

        it('The prompt should not be submitted when the user presses the Ctrl+Enter key', async () => {
            // Given
            const promptBoxOptions: PromptBoxOptions = {placeholder: 'My prompt-box'};
            const {container} = render(
                <AiChat adapter={adapterController!.adapter} promptBoxOptions={promptBoxOptions}/>,
            );
            const promptBox: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(promptBox, 'Hello, World!');
            await waitForRenderCycle();

            // When
            await userEvent.type(promptBox, '{Control>}{Enter}');
            await waitForRenderCycle();

            // Then
            expect(adapterController!.fetchTextMock).not.toHaveBeenCalled();
        });

        it('The prompt should not be submitted when the user presses the Meta+Enter key', async () => {
            // Given
            const promptBoxOptions: PromptBoxOptions = {placeholder: 'My prompt-box'};
            const {container} = render(
                <AiChat adapter={adapterController!.adapter} promptBoxOptions={promptBoxOptions}/>,
            );
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello, World!');
            await waitForRenderCycle();

            // When
            await userEvent.type(textArea, '{Meta>}{Enter}');
            await waitForRenderCycle();

            // Then
            expect(adapterController!.fetchTextMock).not.toHaveBeenCalled();
        });

        describe('When submitShortcut option is set to CommandEnter after initial render', () => {
            it('The prompt should not be submitted when the user presses the Enter key', async () => {
                // Given
                const promptBoxOptions: PromptBoxOptions = {placeholder: 'My prompt-box'};
                const {container, rerender} = render(
                    <AiChat adapter={adapterController!.adapter} promptBoxOptions={promptBoxOptions}/>,
                );

                const promptBox: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(promptBox, 'Hello, World!');
                await waitForRenderCycle();

                // When
                rerender(
                    <AiChat adapter={adapterController!.adapter} promptBoxOptions={{submitShortcut: 'CommandEnter'}}/>,
                );
                await userEvent.type(promptBox, '{enter}');
                await waitForRenderCycle();

                // Then
                expect(adapterController!.fetchTextMock).not.toHaveBeenCalled();
            });

            it('The prompt should be submitted when the user presses the Ctrl+Enter key', async () => {
                // Given
                const promptBoxOptions: PromptBoxOptions = {placeholder: 'My prompt-box'};
                const {container, rerender} = render(
                    <AiChat adapter={adapterController!.adapter} promptBoxOptions={promptBoxOptions}/>,
                );

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();

                // When
                rerender(
                    <AiChat adapter={adapterController!.adapter} promptBoxOptions={{submitShortcut: 'CommandEnter'}}/>,
                );
                await userEvent.type(textArea, '{Control>}{Enter}');
                await waitForRenderCycle();

                // Then
                expect(adapterController!.fetchTextMock).toHaveBeenCalledWith('Hello, World!');
            });

            it('The prompt should be submitted when the user presses the Meta+Enter key', async () => {
                // Given
                const promptBoxOptions: PromptBoxOptions = {placeholder: 'My prompt-box'};
                const {container, rerender} = render(
                    <AiChat adapter={adapterController!.adapter} promptBoxOptions={promptBoxOptions}/>,
                );

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();

                // When
                rerender(
                    <AiChat adapter={adapterController!.adapter} promptBoxOptions={{submitShortcut: 'CommandEnter'}}/>,
                );

                await userEvent.type(textArea, '{Meta>}{Enter}');
                await waitForRenderCycle();

                // Then
                expect(adapterController!.fetchTextMock).toHaveBeenCalledWith('Hello, World!');
            });
        });
    });

    describe('When submitShortcut option is initially set to CommandEnter', () => {
        it('The prompt should not be submitted when the user presses the Enter key', async () => {
            // Given
            const promptBoxOptions: PromptBoxOptions = {submitShortcut: 'CommandEnter'};
            const {container} = render(
                <AiChat adapter={adapterController!.adapter} promptBoxOptions={promptBoxOptions}/>,
            );

            const promptBox: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(promptBox, 'Hello, World!');
            await waitForRenderCycle();

            // When
            await userEvent.type(promptBox, '{enter}');
            await waitForRenderCycle();

            // Then
            expect(adapterController!.fetchTextMock).not.toHaveBeenCalled();
        });

        it('The prompt should be submitted when the user presses the Ctrl+Enter key', async () => {
            // Given
            const promptBoxOptions: PromptBoxOptions = {submitShortcut: 'CommandEnter'};
            const {container} = render(
                <AiChat adapter={adapterController!.adapter} promptBoxOptions={promptBoxOptions}/>,
            );

            const promptBox: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(promptBox, 'Hello, World!');
            await waitForRenderCycle();

            // When
            await userEvent.type(promptBox, '{Control>}{Enter}');
            await waitForRenderCycle();

            // Then
            expect(adapterController!.fetchTextMock).toHaveBeenCalledWith('Hello, World!');
        });

        it('The prompt should be submitted when the user presses the Meta+Enter key', async () => {
            // Given
            const promptBoxOptions: PromptBoxOptions = {submitShortcut: 'CommandEnter'};
            const {container} = render(
                <AiChat adapter={adapterController!.adapter} promptBoxOptions={promptBoxOptions}/>,
            );

            const promptBox: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(promptBox, 'Hello, World!');
            await waitForRenderCycle();

            // When
            await userEvent.type(promptBox, '{Meta>}{Enter}');
            await waitForRenderCycle();

            // Then
            expect(adapterController!.fetchTextMock).toHaveBeenCalledWith('Hello, World!');
        });

        describe('When submitShortcut option is set to Enter after initial render', () => {
            it('The prompt should be submitted when the user presses the Enter key', async () => {
                // Given
                const promptBoxOptions: PromptBoxOptions = {submitShortcut: 'CommandEnter'};
                const {container, rerender} = render(
                    <AiChat adapter={adapterController!.adapter} promptBoxOptions={promptBoxOptions}/>,
                );

                const promptBox: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(promptBox, 'Hello, World!');
                await waitForRenderCycle();

                // When
                rerender(
                    <AiChat adapter={adapterController!.adapter} promptBoxOptions={{submitShortcut: 'Enter'}}/>,
                );
                await userEvent.type(promptBox, '{enter}');
                await waitForRenderCycle();

                // Then
                expect(adapterController!.fetchTextMock).toHaveBeenCalledWith('Hello, World!');
            });

            it('The prompt should not be submitted when the user presses the Ctrl+Enter key', async () => {
                // Given
                const promptBoxOptions: PromptBoxOptions = {submitShortcut: 'CommandEnter'};
                const {container, rerender} = render(
                    <AiChat adapter={adapterController!.adapter} promptBoxOptions={promptBoxOptions}/>,
                );

                const promptBox: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(promptBox, 'Hello, World!');
                await waitForRenderCycle();

                // When
                rerender(
                    <AiChat adapter={adapterController!.adapter} promptBoxOptions={{submitShortcut: 'Enter'}}/>,
                );
                await userEvent.type(promptBox, '{Control>}{Enter}');
                await waitForRenderCycle();

                // Then
                expect(adapterController!.fetchTextMock).not.toHaveBeenCalled();
            });

            it('The prompt should not be submitted when the user presses the Meta+Enter key', async () => {
                // Given
                const promptBoxOptions: PromptBoxOptions = {submitShortcut: 'CommandEnter'};
                const {container, rerender} = render(
                    <AiChat adapter={adapterController!.adapter} promptBoxOptions={promptBoxOptions}/>,
                );

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();

                // When
                rerender(
                    <AiChat adapter={adapterController!.adapter} promptBoxOptions={{submitShortcut: 'Enter'}}/>,
                );
                await userEvent.type(textArea, '{Meta>}{Enter}');
                await waitForRenderCycle();

                // Then
                expect(adapterController!.fetchTextMock).not.toHaveBeenCalled();
            });
        });

        describe('When submitShortcut option is removed after the initial render', () => {
            it('The prompt should be submitted when the user presses the Enter key', async () => {
                // Given
                const promptBoxOptions: PromptBoxOptions = {submitShortcut: 'CommandEnter'};
                const {container, rerender} = render(
                    <AiChat adapter={adapterController!.adapter} promptBoxOptions={promptBoxOptions}/>,
                );

                const promptBox: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(promptBox, 'Hello, World!');
                await waitForRenderCycle();

                // When
                rerender(<AiChat adapter={adapterController!.adapter} promptBoxOptions={{}}/>);
                await userEvent.type(promptBox, '{enter}');
                await waitForRenderCycle();

                // Then
                expect(adapterController!.fetchTextMock).toHaveBeenCalledWith('Hello, World!');
            });

            it('The prompt should not be submitted when the user presses the Ctrl+Enter key', async () => {
                // Given
                const promptBoxOptions: PromptBoxOptions = {submitShortcut: 'CommandEnter'};
                const {container, rerender} = render(
                    <AiChat adapter={adapterController!.adapter} promptBoxOptions={promptBoxOptions}/>,
                );

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();

                // When
                rerender(<AiChat adapter={adapterController!.adapter} promptBoxOptions={{}}/>);
                await userEvent.type(textArea, '{Control>}{Enter}');
                await waitForRenderCycle();

                // Then
                expect(adapterController!.fetchTextMock).not.toHaveBeenCalled();
            });

            it('The prompt should not be submitted when the user presses the Meta+Enter key', async () => {
                // Given
                const promptBoxOptions: PromptBoxOptions = {submitShortcut: 'CommandEnter'};
                const {container, rerender} = render(
                    <AiChat adapter={adapterController!.adapter} promptBoxOptions={promptBoxOptions}/>,
                );

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await userEvent.type(textArea, 'Hello, World!');
                await waitForRenderCycle();

                // When
                rerender(<AiChat adapter={adapterController!.adapter} promptBoxOptions={{}}/>);
                await userEvent.type(textArea, '{Meta>}{Enter}');
                await waitForRenderCycle();

                // Then
                expect(adapterController!.fetchTextMock).not.toHaveBeenCalled();
            });
        });
    });
});
