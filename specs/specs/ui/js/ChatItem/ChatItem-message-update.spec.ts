import {describe, expect, it} from 'vitest';
import {createChatItemDom} from '../../../../../packages/shared/src/ui/ChatItem/create';
import {ChatItemProps} from '../../../../../packages/shared/src/ui/ChatItem/props';
import {updateChatItemDom} from '../../../../../packages/shared/src/ui/ChatItem/update';

describe('When a chat item component is complete in incoming direction', () => {
    describe('When the message is updated', () => {
        it('Should update the message', () => {
            // Arrange
            const props: ChatItemProps = {
                direction: 'incoming',
                status: 'complete',
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
                status: 'complete',
                message: 'Hello, World!',
            };
            const chatItem = createChatItemDom(props);
            const message = chatItem.querySelector('.nlux-comp-msg') as HTMLElement;

            // Act
            updateChatItemDom(chatItem, props, {
                ...props,
                status: 'streaming',
            });

            // Assert
            expect(message.classList.contains('nlux_msg_streaming')).toBe(true);
        });
    });
});
