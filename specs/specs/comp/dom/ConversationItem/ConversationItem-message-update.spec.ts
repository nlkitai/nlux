import {createConvItemDom} from '@nlux-dev/core/src/comp/ConversationItem/create';
import {ConvItemProps} from '@nlux-dev/core/src/comp/ConversationItem/props';
import {updateConvItemDom} from '@nlux-dev/core/src/comp/ConversationItem/update';
import {describe, expect, it} from 'vitest';

describe('When a conversation item component is rendered in incoming direction', () => {
    describe('and the message is updated', () => {
        it('should update the message', () => {
            // Given
            const props: ConvItemProps = {
                direction: 'incoming',
                status: 'rendered',
                message: 'Hello, World!',
            };
            const conversationItem = createConvItemDom(props);
            const message = conversationItem.querySelector('.nlux_comp_msg') as HTMLElement;

            // When
            updateConvItemDom(conversationItem, props, {
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
            const props: ConvItemProps = {
                direction: 'incoming',
                status: 'rendered',
                message: 'Hello, World!',
            };
            const conversationItem = createConvItemDom(props);
            const message = conversationItem.querySelector('.nlux_comp_msg') as HTMLElement;

            // When
            updateConvItemDom(conversationItem, props, {
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
            const props: ConvItemProps = {
                direction: 'incoming',
                status: 'loading',
                message: 'Hello, World!',
                loader: undefined,
            };
            const conversationItem = createConvItemDom(props);
            const message = conversationItem.querySelector('.nlux_comp_msg') as HTMLElement;

            // When
            const newLoader = document.createElement('div');
            newLoader.innerHTML = 'Loading...';
            updateConvItemDom(conversationItem, props, {
                ...props,
                loader: newLoader,
            });

            // Then
            expect(message.innerHTML).toEqual(expect.stringContaining('Loading...'));
        });
    });
});
