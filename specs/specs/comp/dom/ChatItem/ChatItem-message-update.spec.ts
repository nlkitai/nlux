import {createChatItemDom} from '@nlux-dev/core/src/ui/ChatItem/create';
import {ChatItemProps} from '@nlux-dev/core/src/ui/ChatItem/props';
import {updateChatItemDom} from '@nlux-dev/core/src/ui/ChatItem/update';
import {describe, expect, it} from 'vitest';

describe('When a chat item component is rendered in incoming direction', () => {
    describe('and the message is updated', () => {
        it('should update the message', () => {
            // Given
            const props: ChatItemProps = {
                direction: 'incoming',
                status: 'rendered',
                message: 'Hello, World!',
            };
            const chatItem = createChatItemDom(props);
            const message = chatItem.querySelector('.nlux_comp_msg') as HTMLElement;

            // When
            updateChatItemDom(chatItem, props, {
                ...props,
                message: 'Hello, Universe!',
            });

            // Then
            expect(message.textContent).toBe('Hello, Universe!');
        });
    });

    describe('and the status is updated', () => {
        it('should update the message status', () => {
            // Given
            const props: ChatItemProps = {
                direction: 'incoming',
                status: 'rendered',
                message: 'Hello, World!',
            };
            const chatItem = createChatItemDom(props);
            const message = chatItem.querySelector('.nlux_comp_msg') as HTMLElement;

            // When
            updateChatItemDom(chatItem, props, {
                ...props,
                status: 'loading',
            });

            // Then
            expect(message.classList.contains('nlux_msg_loading')).toBe(true);
        });
    });

    describe('and the loader is updated', () => {
        it('should update the message loader', () => {
            // Given
            const props: ChatItemProps = {
                direction: 'incoming',
                status: 'loading',
                message: 'Hello, World!',
                loader: undefined,
            };
            const chatItem = createChatItemDom(props);
            const message = chatItem.querySelector('.nlux_comp_msg') as HTMLElement;

            // When
            const newLoader = document.createElement('div');
            newLoader.innerHTML = 'Loading...';
            updateChatItemDom(chatItem, props, {
                ...props,
                loader: newLoader,
            });

            // Then
            expect(message.innerHTML).toEqual(expect.stringContaining('Loading...'));
        });
    });
});
