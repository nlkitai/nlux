import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + displayOptions + themeId', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When the component is created without a theme option', () => {
        it('The default theme should be used', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            render(aiChat);
            await waitForReactRenderCycle();

            // Act
            const aiChatDom = document.querySelector('.nlux-AiChat-root')!;

            // Assert
            expect(aiChatDom.className).toContain('nlux-theme-luna');
        });
    });

    describe('When the component is created with a theme option', () => {
        it('The theme should be used', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter} displayOptions={{themeId: 'vienna'}}/>;
            render(aiChat);

            // Act
            const aiChatDom = document.querySelector('.nlux-AiChat-root')!;

            // Assert
            expect(aiChatDom.className).toContain('nlux-theme-vienna');
        });

        describe('When a different theme is set', () => {
            it('The new theme should be used', async () => {
                // Arrange
                const aiChat = <AiChat adapter={adapterController!.adapter} displayOptions={{themeId: 'aliba'}}/>;
                const {rerender} = render(aiChat);
                const aiChatDom = document.querySelector('.nlux-AiChat-root')!;

                // Act
                rerender(<AiChat adapter={adapterController!.adapter} displayOptions={{themeId: 'vienna'}}/>);
                await waitForReactRenderCycle();

                // Assert
                expect(aiChatDom.className).toContain('nlux-theme-vienna');
            });
        });

        describe('When the theme is removed', () => {
            it('The default theme should be used', async () => {
                // Arrange
                const aiChat = <AiChat adapter={adapterController!.adapter} displayOptions={{themeId: 'aliba'}}/>;
                const {rerender} = render(aiChat);
                const aiChatDom = document.querySelector('.nlux-AiChat-root')!;

                // Act
                rerender(<AiChat adapter={adapterController!.adapter}/>);
                await waitForReactRenderCycle();

                // Assert
                expect(aiChatDom.className).toContain('nlux-theme-luna');
            });
        });
    });
});
