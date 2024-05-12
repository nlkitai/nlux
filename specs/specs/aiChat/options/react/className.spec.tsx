import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + prop className', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When the component is created without a className', () => {
        it('The default className should be used', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            render(aiChat);
            await waitForReactRenderCycle();

            // Act
            const aiChatDom = document.querySelector('.nlux-AiChat-root')!;

            // Assert
            expect(aiChatDom.classList.length).toBe(2);
            expect(aiChatDom.classList[0]).toBe('nlux-AiChat-root');
            expect(aiChatDom.classList[1]).toBe('nlux-theme-luna');
        });

        describe('When a className is set', () => {
            it('The new className should be used', async () => {
                // Arrange
                const aiChat = <AiChat adapter={adapterController!.adapter}/>;
                const {rerender} = render(aiChat);
                const aiChatDom = document.querySelector('.nlux-AiChat-root')!;

                // Act
                rerender(<AiChat adapter={adapterController!.adapter} className="my-class"/>);
                await waitForReactRenderCycle();

                // Assert
                expect(aiChatDom.classList.length).toBe(3);
                expect(aiChatDom.classList[0]).toBe('nlux-AiChat-root');
                expect(aiChatDom.classList[1]).toBe('nlux-theme-luna');
                expect(aiChatDom.classList[2]).toBe('my-class');
            });
        });
    });

    describe('When the component is created with a className', () => {
        it('The className should be used', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter} className="my-class"/>;
            render(aiChat);

            // Act
            const aiChatDom = document.querySelector('.nlux-AiChat-root')!;

            // Assert
            expect(aiChatDom.classList.length).toBe(3);
            expect(aiChatDom.classList[0]).toBe('nlux-AiChat-root');
            expect(aiChatDom.classList[1]).toBe('nlux-theme-luna');
            expect(aiChatDom.classList[2]).toBe('my-class');
        });

        describe('When a different className is set', () => {
            it('The new className should be used', async () => {
                // Arrange
                const aiChat = <AiChat adapter={adapterController!.adapter} className="my-class"/>;
                const {rerender} = render(aiChat);
                const aiChatDom = document.querySelector('.nlux-AiChat-root')!;

                // Act
                rerender(<AiChat adapter={adapterController!.adapter} className="my-new-class"/>);
                await waitForReactRenderCycle();

                // Assert
                expect(aiChatDom.classList.length).toBe(3);
                expect(aiChatDom.classList[0]).toBe('nlux-AiChat-root');
                expect(aiChatDom.classList[1]).toBe('nlux-theme-luna');
                expect(aiChatDom.classList[2]).toBe('my-new-class');
            });
        });

        describe('When the className is removed', () => {
            it('The default className should be used', async () => {
                // Arrange
                const aiChat = <AiChat adapter={adapterController!.adapter} className="my-class"/>;
                const {rerender} = render(aiChat);
                const aiChatDom = document.querySelector('.nlux-AiChat-root')!;

                // Act
                rerender(<AiChat adapter={adapterController!.adapter}/>);
                await waitForReactRenderCycle();

                // Assert
                expect(aiChatDom.classList.length).toBe(2);
                expect(aiChatDom.classList[0]).toBe('nlux-AiChat-root');
                expect(aiChatDom.classList[1]).toBe('nlux-theme-luna');
            });
        });
    });
});
