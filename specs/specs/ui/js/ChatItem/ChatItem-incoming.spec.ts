import {describe, expect, it} from 'vitest';
import {createChatItemDom} from '../../../../../packages/shared/src/ui/ChatItem/create';
import {ChatItemProps} from '../../../../../packages/shared/src/ui/ChatItem/props';
import {updateChatItemDom} from '../../../../../packages/shared/src/ui/ChatItem/update';

describe('When a chat item component is complete in incoming direction', () => {
    it('Should render the item with the right direction class', () => {
        // Arrange
        const props: ChatItemProps = {
            direction: 'incoming',
            displayMode: 'bubbles',
            status: 'complete',
            message: 'Hello, World!',
        };

        // Act
        const chatItem = createChatItemDom(props);

        // Assert
        expect(chatItem.classList.contains('nlux_cht_itm_in')).toBe(true);
    });

    describe('When the display mode is set to bubbles', () => {
        it('Should render the item with the right display mode class', () => {
            // Arrange
            const props: ChatItemProps = {
                direction: 'incoming',
                displayMode: 'bubbles',
                status: 'complete',
                message: 'Hello, World!',
            };

            // Act
            const chatItem = createChatItemDom(props);

            // Assert
            expect(chatItem.classList.contains('nlux_cht_itm_bbl')).toBe(true);
        });
    });

    describe('When the display mode is set to list', () => {
        it('Should render the item with the right display mode class', () => {
            // Arrange
            const props: ChatItemProps = {
                direction: 'incoming',
                displayMode: 'list',
                status: 'complete',
                message: 'Hello, World!',
            };

            // Act
            const chatItem = createChatItemDom(props);

            // Assert
            expect(chatItem.classList.contains('nlux_cht_itm_lst')).toBe(true);
        });
    });

    it('Should render message with the right direction class', () => {
        // Arrange
        const props: ChatItemProps = {
            direction: 'incoming',
            displayMode: 'bubbles',
            status: 'complete',
            message: 'Hello, World!',
        };
        const chatItem = createChatItemDom(props);

        // Act
        const message = chatItem.querySelector('.nlux-comp-msg') as HTMLElement;

        // Assert
        expect(message.classList.contains('nlux_msg_incoming')).toBe(true);
    });

    it('Should render profile picture', () => {
        // Arrange
        const props: ChatItemProps = {
            direction: 'incoming',
            displayMode: 'bubbles',
            status: 'complete',
            message: 'Hello, World!',
            name: 'John Doe',
            picture: 'https://example.com/john-doe.jpg',
        };
        const chatItem = createChatItemDom(props);

        // Act
        const persona = chatItem.querySelector('.nlux-comp-avtr') as HTMLElement;

        // Assert
        expect(persona).not.toBeNull();
        expect(persona.outerHTML).toEqual(expect.stringContaining('url(https://example.com/john-doe.jpg)'));
        expect(persona.outerHTML).toEqual(expect.stringContaining('John Doe'));
    });

    describe('When the direction changes to outgoing', () => {
        it('Should render the item with the outgoing class', () => {
            // Arrange
            const props: ChatItemProps = {
                direction: 'incoming',
                displayMode: 'bubbles',
                status: 'complete',
                message: 'Hello, World!',
            };
            const chatItem = createChatItemDom(props);

            // Act
            const newProps: ChatItemProps = {
                ...props,
                direction: 'outgoing',
            };
            updateChatItemDom(chatItem, props, newProps);

            // Assert
            expect(chatItem.classList.contains('nlux_cht_itm_in')).toBe(false);
            expect(chatItem.classList.contains('nlux_cht_itm_out')).toBe(true);
        });

        it('Should render message with the outgoing class', () => {
            // Arrange
            const props: ChatItemProps = {
                direction: 'incoming',
                displayMode: 'bubbles',
                status: 'complete',
                message: 'Hello, World!',
            };
            const chatItem = createChatItemDom(props);

            // Act
            const newProps: ChatItemProps = {
                ...props,
                direction: 'outgoing',
            };
            updateChatItemDom(chatItem, props, newProps);

            // Assert
            const message = chatItem.querySelector('.nlux-comp-msg') as HTMLElement;
            expect(message.classList.contains('nlux_msg_incoming')).toBe(false);
            expect(message.classList.contains('nlux_msg_outgoing')).toBe(true);
        });
    });
});
