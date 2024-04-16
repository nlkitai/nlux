import {describe, expect, it} from 'vitest';
import {createChatItemDom} from '../../../../../packages/shared/src/ui/ChatItem/create';
import {ChatItemProps} from '../../../../../packages/shared/src/ui/ChatItem/props';
import {updateChatItemDom} from '../../../../../packages/shared/src/ui/ChatItem/update';

describe('When a chat item component is rendered in incoming direction', () => {
    it('Should render the item with the right direction class', () => {
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

    it('Should render message with the right direction class', () => {
        // Given
        const props: ChatItemProps = {
            direction: 'incoming',
            status: 'rendered',
            message: 'Hello, World!',
        };
        const chatItem = createChatItemDom(props);

        // When
        const message = chatItem.querySelector('.nlux-comp-msg') as HTMLElement;

        // Then
        expect(message.classList.contains('nlux_msg_incoming')).toBe(true);
    });

    it('Should render profile picture', () => {
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
        const persona = chatItem.querySelector('.nlux-comp-avtr') as HTMLElement;

        // Then
        expect(persona).not.toBeNull();
        expect(persona.outerHTML).toEqual(expect.stringContaining('url(https://example.com/john-doe.jpg)'));
        expect(persona.outerHTML).toEqual(expect.stringContaining('John Doe'));
    });

    describe('When the direction changes to outgoing', () => {
        it('Should render the item with the outgoing class', () => {
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

        it('Should render message with the outgoing class', () => {
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
            const message = chatItem.querySelector('.nlux-comp-msg') as HTMLElement;
            expect(message.classList.contains('nlux_msg_incoming')).toBe(false);
            expect(message.classList.contains('nlux_msg_outgoing')).toBe(true);
        });
    });
});
