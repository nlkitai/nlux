import {createChatItemDom} from '@nlux-dev/core/src/ui/ChatItem/create';
import {ChatItemProps} from '@nlux-dev/core/src/ui/ChatItem/props';
import {updateChatItemDom} from '@nlux-dev/core/src/ui/ChatItem/update';
import {describe, expect, it} from 'vitest';

describe('When a chat item component is rendered in incoming direction', () => {
    it('should render the item with the right direction class', () => {
        // Given
        const props: ChatItemProps = {
            direction: 'incoming',
            status: 'rendered',
            message: 'Hello, World!',
        };

        // When
        const chatItem = createChatItemDom(props);

        // Then
        expect(chatItem.classList.contains('nlux_cht_itm_incoming')).toBe(true);
    });

    it('should render message with the right direction class', () => {
        // Given
        const props: ChatItemProps = {
            direction: 'incoming',
            status: 'rendered',
            message: 'Hello, World!',
        };
        const chatItem = createChatItemDom(props);

        // When
        const message = chatItem.querySelector('.nlux_comp_msg') as HTMLElement;

        // Then
        expect(message.classList.contains('nlux_msg_incoming')).toBe(true);
    });

    it('should render profile picture', () => {
        // Given
        const props: ChatItemProps = {
            direction: 'incoming',
            status: 'rendered',
            message: 'Hello, World!',
            name: 'John Doe',
            picture: 'https://example.com/john-doe.jpg',
        };
        const chatItem = createChatItemDom(props);

        // When
        const persona = chatItem.querySelector('.nlux_comp_avtr') as HTMLElement;

        // Then
        expect(persona).not.toBeNull();
        expect(persona.outerHTML).toEqual(expect.stringContaining('url(https://example.com/john-doe.jpg)'));
        expect(persona.outerHTML).toEqual(expect.stringContaining('John Doe'));
    });

    describe('and the direction changes to outgoing', () => {
        it('should render the item with the outgoing class', () => {
            // Given
            const props: ChatItemProps = {
                direction: 'incoming',
                status: 'rendered',
                message: 'Hello, World!',
            };
            const chatItem = createChatItemDom(props);

            // When
            const newProps: ChatItemProps = {
                ...props,
                direction: 'outgoing',
            };
            updateChatItemDom(chatItem, props, newProps);

            // Then
            expect(chatItem.classList.contains('nlux_cht_itm_incoming')).toBe(false);
            expect(chatItem.classList.contains('nlux_cht_itm_outgoing')).toBe(true);
        });

        it('should render message with the outgoing class', () => {
            // Given
            const props: ChatItemProps = {
                direction: 'incoming',
                status: 'rendered',
                message: 'Hello, World!',
            };
            const chatItem = createChatItemDom(props);

            // When
            const newProps: ChatItemProps = {
                ...props,
                direction: 'outgoing',
            };
            updateChatItemDom(chatItem, props, newProps);

            // Then
            const message = chatItem.querySelector('.nlux_comp_msg') as HTMLElement;
            expect(message.classList.contains('nlux_msg_incoming')).toBe(false);
            expect(message.classList.contains('nlux_msg_outgoing')).toBe(true);
        });
    });
});
