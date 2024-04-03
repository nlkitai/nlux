import {createConversationItemDom} from '@nlux-dev/core/src/comp/ConversationItem/create';
import {ConversationItemProps} from '@nlux-dev/core/src/comp/ConversationItem/props';
import {updateConversationItemDom} from '@nlux-dev/core/src/comp/ConversationItem/update';
import {describe, expect, it} from 'vitest';

describe('When a conversation item component is rendered in incoming direction', () => {
    describe('and the message is updated', () => {
        it('should update the message', () => {
            // Given
            const props: ConversationItemProps = {
                direction: 'incoming',
                status: 'rendered',
                message: 'Hello, World!',
            };
            const conversationItem = createConversationItemDom(props);
            const message = conversationItem.querySelector('.nlux_comp_msg') as HTMLElement;

            // When
            updateConversationItemDom(conversationItem, props, {
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
            const props: ConversationItemProps = {
                direction: 'incoming',
                status: 'rendered',
                message: 'Hello, World!',
            };
            const conversationItem = createConversationItemDom(props);
            const message = conversationItem.querySelector('.nlux_comp_msg') as HTMLElement;

            // When
            updateConversationItemDom(conversationItem, props, {
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
            const props: ConversationItemProps = {
                direction: 'incoming',
                status: 'loading',
                message: 'Hello, World!',
                loader: undefined,
            };
            const conversationItem = createConversationItemDom(props);
            const message = conversationItem.querySelector('.nlux_comp_msg') as HTMLElement;

            // When
            const newLoader = document.createElement('div');
            newLoader.innerHTML = 'Loading...';
            updateConversationItemDom(conversationItem, props, {
                ...props,
                loader: newLoader,
            });

            // Then
            expect(message.innerHTML).toEqual(expect.stringContaining('Loading...'));
        });
    });
});
