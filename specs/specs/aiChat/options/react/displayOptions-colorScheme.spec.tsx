import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, Mock, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + displayOptions + colorScheme', () => {
    let adapterController: AdapterController | undefined;
    let matchMedia: Mock;
    let matchMediaNative: typeof window.matchMedia;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
        matchMedia = vi.fn(() => ({matches: true}));
        matchMediaNative = window.matchMedia;
        (window as unknown as Record<string, unknown>).matchMedia = matchMedia;
    });

    afterEach(() => {
        adapterController = undefined;
        (window as unknown as Record<string, unknown>).matchMedia = matchMediaNative;
    });

    describe('When the component is created without a color scheme option', () => {
        describe('When the system default color scheme is light', () => {
            it('The system default light theme scheme should be used', async () => {
                // Arrange
                matchMedia.mockReturnValue({matches: false}); // light
                const aiChat = <AiChat adapter={adapterController!.adapter}/>;
                render(aiChat);
                await waitForReactRenderCycle();

                // Act
                const aiChatDom = document.querySelector('.nlux-AiChat-root')!;

                // Assert
                expect(aiChatDom.className).toContain('nlux-colorScheme-light');
            });
        });

        describe('When the system default color scheme is dark', () => {
            it('The system default dark theme scheme should be used', async () => {
                // Arrange
                matchMedia.mockReturnValue({matches: true}); // dark
                const aiChat = <AiChat adapter={adapterController!.adapter}/>;
                render(aiChat);
                await waitForReactRenderCycle();

                // Act
                const aiChatDom = document.querySelector('.nlux-AiChat-root')!;

                // Assert
                expect(aiChatDom.className).toContain('nlux-colorScheme-dark');
            });
        });
    });

    describe('When a color scheme option is set to light', () => {
        it('The light theme scheme should be used', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter} displayOptions={{colorScheme: 'light'}}/>;
            render(aiChat);
            await waitForReactRenderCycle();

            // Act
            const aiChatDom = document.querySelector('.nlux-AiChat-root')!;

            // Assert
            expect(aiChatDom.className).toContain('nlux-colorScheme-light');
        });

        describe('When the color scheme is updated after the component is created', () => {
            it('The new color scheme should be used', async () => {
                // Arrange
                const aiChat = <AiChat adapter={adapterController!.adapter} displayOptions={{colorScheme: 'light'}}/>;
                const {rerender} = render(aiChat);
                await waitForReactRenderCycle();

                // Act
                rerender(<AiChat adapter={adapterController!.adapter} displayOptions={{colorScheme: 'dark'}}/>);
                await waitForReactRenderCycle();

                // Assert
                const aiChatDom = document.querySelector('.nlux-AiChat-root')!;
                expect(aiChatDom.className).toContain('nlux-colorScheme-dark');
            });
        });
    });

    describe('When a color scheme option is unset after the component is created', () => {
        it('The system default color scheme should be used', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter} displayOptions={{colorScheme: 'light'}}/>;
            const {rerender} = render(aiChat);
            await waitForReactRenderCycle();

            // Act
            rerender(<AiChat adapter={adapterController!.adapter} displayOptions={{}}/>);
            await waitForReactRenderCycle();

            // Assert
            const aiChatDom = document.querySelector('.nlux-AiChat-root')!;
            expect(aiChatDom.className).toContain('nlux-colorScheme-dark');
        });
    });

    describe('When the displayOptions are unset after the component is created', () => {
        it('The system default color scheme should be used', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter} displayOptions={{colorScheme: 'light'}}/>;
            const {rerender} = render(aiChat);
            await waitForReactRenderCycle();

            // Act
            rerender(<AiChat adapter={adapterController!.adapter}/>);
            await waitForReactRenderCycle();

            // Assert
            const aiChatDom = document.querySelector('.nlux-AiChat-root')!;
            expect(aiChatDom.className).toContain('nlux-colorScheme-dark');
        });
    });
});
