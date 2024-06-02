import {describe, expect, it} from 'vitest';
import {createChatItemDom} from '@shared/components/ChatItem/create';
import {ChatItemProps} from '@shared/components/ChatItem/props';
import {updateChatItemDom} from '@shared/components/ChatItem/update';

describe('When a chat item component is complete in received direction', () => {
    it('Should render the item with the right direction class', () => {
        // Arrange
        const props: ChatItemProps = {
            name: 'John Doe',
            direction: 'received',
            layout: 'bubbles',
            status: 'complete',
            message: 'Hello, World!',
        };

        // Act
        const chatItem = createChatItemDom(props);

        // Assert
        expect(chatItem.classList.contains('nlux-comp-chatItem--received')).toBe(true);
    });

    describe('When the display mode is set to bubbles', () => {
        it('Should render the item with the right display mode class', () => {
            // Arrange
            const props: ChatItemProps = {
                name: 'John Doe',
                direction: 'received',
                layout: 'bubbles',
                status: 'complete',
                message: 'Hello, World!',
            };

            // Act
            const chatItem = createChatItemDom(props);

            // Assert
            expect(chatItem.classList.contains('nlux-comp-chatItem--bubblesLayout')).toBe(true);
        });
    });

    describe('When the display mode is set to list', () => {
        it('Should render the item with the right display mode class', () => {
            // Arrange
            const props: ChatItemProps = {
                name: 'John Doe',
                direction: 'received',
                layout: 'list',
                status: 'complete',
                message: 'Hello, World!',
            };

            // Act
            const chatItem = createChatItemDom(props);

            // Assert
            expect(chatItem.classList.contains('nlux-comp-chatItem--listLayout')).toBe(true);
        });
    });

    it('Should render message with the right direction class', () => {
        // Arrange
        const props: ChatItemProps = {
            name: 'John Doe',
            direction: 'received',
            layout: 'bubbles',
            status: 'complete',
            message: 'Hello, World!',
        };
        const chatItem = createChatItemDom(props);

        // Act
        const message = chatItem.querySelector('.nlux-comp-message') as HTMLElement;

        // Assert
        expect(message.classList.contains('nlux_msg_received')).toBe(true);
    });

    it('Should render avatar', () => {
        // Arrange
        const props: ChatItemProps = {
            name: 'John Doe',
            direction: 'received',
            layout: 'bubbles',
            status: 'complete',
            message: 'Hello, World!',
            avatar: 'https://example.com/john-doe.jpg',
        };
        const chatItem = createChatItemDom(props);

        // Act
        const avatar = chatItem.querySelector('.nlux-comp-avatar') as HTMLElement;

        // Assert
        expect(avatar).not.toBeNull();
        expect(avatar.outerHTML).toEqual(expect.stringContaining('url(https://example.com/john-doe.jpg)'));
        expect(avatar.outerHTML).toEqual(expect.stringContaining('John Doe'));
    });

    describe('When the direction changes to sent', () => {
        it('Should render the item with the sent class', () => {
            // Arrange
            const props: ChatItemProps = {
                name: 'John Doe',
                direction: 'received',
                layout: 'bubbles',
                status: 'complete',
                message: 'Hello, World!',
            };
            const chatItem = createChatItemDom(props);

            // Act
            const newProps: ChatItemProps = {
                ...props,
                direction: 'sent',
            };
            updateChatItemDom(chatItem, props, newProps);

            // Assert
            expect(chatItem.classList.contains('nlux-comp-chatItem--received')).toBe(false);
            expect(chatItem.classList.contains('nlux-comp-chatItem--sent')).toBe(true);
        });

        it('Should render message with the sent class', () => {
            // Arrange
            const props: ChatItemProps = {
                name: 'John Doe',
                direction: 'received',
                layout: 'bubbles',
                status: 'complete',
                message: 'Hello, World!',
            };
            const chatItem = createChatItemDom(props);

            // Act
            const newProps: ChatItemProps = {
                ...props,
                direction: 'sent',
            };
            updateChatItemDom(chatItem, props, newProps);

            // Assert
            const message = chatItem.querySelector('.nlux-comp-message') as HTMLElement;
            expect(message.classList.contains('nlux_msg_received')).toBe(false);
            expect(message.classList.contains('nlux_msg_sent')).toBe(true);
        });
    });
});
