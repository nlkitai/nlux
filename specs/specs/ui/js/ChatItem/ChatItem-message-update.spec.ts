import {describe, expect, it} from 'vitest';
import {createChatItemDom} from '../../../../../packages/shared/src/ui/ChatItem/create';
import {ChatItemProps} from '../../../../../packages/shared/src/ui/ChatItem/props';
import {updateChatItemDom} from '../../../../../packages/shared/src/ui/ChatItem/update';

describe('When a chat item component is rendered in incoming direction', () => {
    describe('When the message is updated', () => {
        it('Should update the message', () => {
            // Arrange
            const props: ChatItemProps = {
                direction: 'incoming',
                status: 'rendered',
                message: 'Hello, World!',
            };
            const chatItem = createChatItemDom(props);
            const message = chatItem.querySelector('.nlux-comp-msg') as HTMLElement;

            // Act
            updateChatItemDom(chatItem, props, {
                ...props,
                message: 'Hello, Universe!',
            });

            // Assert
            expect(message.textContent).toBe('Hello, Universe!');
        });
    });

    describe('When the status is updated', () => {
        it('Should update the message status', () => {
            // Arrange
            const props: ChatItemProps = {
                direction: 'incoming',
                status: 'rendered',
                message: 'Hello, World!',
            };
            const chatItem = createChatItemDom(props);
            const message = chatItem.querySelector('.nlux-comp-msg') as HTMLElement;

            // Act
            updateChatItemDom(chatItem, props, {
                ...props,
                status: 'loading',
            });

            // Assert
            expect(message.classList.contains('nlux_msg_loading')).toBe(true);
        });
    });

    describe('When the loader is updated', () => {
        it('Should update the message loader', () => {
            // Arrange
            const props: ChatItemProps = {
                direction: 'incoming',
                status: 'loading',
                message: 'Hello, World!',
                loader: undefined,
            };
            const chatItem = createChatItemDom(props);
            const message = chatItem.querySelector('.nlux-comp-msg') as HTMLElement;

            // Act
            const newLoader = document.createElement('div');
            newLoader.innerHTML = 'Loading...';
            updateChatItemDom(chatItem, props, {
                ...props,
                loader: newLoader,
            });

            // Assert
            expect(message.innerHTML).toEqual(expect.stringContaining('Loading...'));
        });
    });
});
