import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + displayOptions + width', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withBatchText().create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When the component is created without a width', () => {
        it('No width should be set at the root element', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            // Act
            const aiChatDom: HTMLElement = container.querySelector('.nlux-AiChat-root')!;

            // Assert
            expect(aiChatDom.style.width).toBe('');
        });
    });

    describe('When a width is set after the component is created', () => {
        it('The width should be set with as a number at the root element', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {rerender, container} = render(aiChat);
            await waitForReactRenderCycle();

            // Act
            rerender(<AiChat adapter={adapterController!.adapter} displayOptions={{width: 500}}/>);
            await waitForReactRenderCycle();
            const aiChatDom: HTMLElement = container.querySelector('.nlux-AiChat-root')!;

            // Assert
            expect(aiChatDom.style.width).toBe('500px');
        });

        it('The width should be set with as a string at the root element', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {rerender, container} = render(aiChat);
            await waitForReactRenderCycle();

            // Act
            rerender(<AiChat adapter={adapterController!.adapter} displayOptions={{width: '500px'}}/>);
            await waitForReactRenderCycle();
            const aiChatDom: HTMLElement = container.querySelector('.nlux-AiChat-root')!;

            // Assert
            expect(aiChatDom.style.width).toBe('500px');
        });
    });

    describe('When the component is created with a width', () => {
        it('The width should be set with as a number at the root element', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter} displayOptions={{width: 500}}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            // Act
            const aiChatDom: HTMLElement = container.querySelector('.nlux-AiChat-root')!;

            // Assert
            expect(aiChatDom.style.width).toBe('500px');
        });

        it('The width should be set with as a string at the root element', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter} displayOptions={{width: '500px'}}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            // Act
            const aiChatDom: HTMLElement = container.querySelector('.nlux-AiChat-root')!;

            // Assert
            expect(aiChatDom.style.width).toBe('500px');
        });
    });

    describe('When a width is updated after the component is created', () => {
        it('The width should be updated with as a number at the root element', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {rerender, container} = render(aiChat);
            await waitForReactRenderCycle();

            // Act
            rerender(<AiChat adapter={adapterController!.adapter} displayOptions={{width: 500}}/>);
            await waitForReactRenderCycle();
            const aiChatDom: HTMLElement = container.querySelector('.nlux-AiChat-root')!;

            // Assert
            expect(aiChatDom.style.width).toBe('500px');
        });

        it('The width should be updated with as a string at the root element', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {rerender, container} = render(aiChat);
            await waitForReactRenderCycle();

            // Act
            rerender(<AiChat adapter={adapterController!.adapter} displayOptions={{width: '500px'}}/>);
            await waitForReactRenderCycle();
            const aiChatDom: HTMLElement = container.querySelector('.nlux-AiChat-root')!;

            // Assert
            expect(aiChatDom.style.width).toBe('500px');
        });
    });

    describe('When the width is removed after the component is created', () => {
        it('No width should be set at the root element', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter} displayOptions={{width: 500}}/>;
            const {rerender, container} = render(aiChat);
            await waitForReactRenderCycle();

            // Act
            rerender(<AiChat adapter={adapterController!.adapter}/>);
            await waitForReactRenderCycle();
            const aiChatDom: HTMLElement = container.querySelector('.nlux-AiChat-root')!;

            // Assert
            expect(aiChatDom.style.width).toBe('');
        });
    });
});
