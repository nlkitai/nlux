import {createConversationItemDom} from '@nlux-dev/core/src/comp/ConversationItem/create';
import {ConversationItemProps} from '@nlux-dev/core/src/comp/ConversationItem/props';
import {updateConversationItemDom} from '@nlux-dev/core/src/comp/ConversationItem/update';
import {describe, expect, it} from 'vitest';

describe('When a conversation item component is rendered in incoming direction', () => {
    it('should render the item with the right direction class', () => {
        // Given
        const props: ConversationItemProps = {
            direction: 'incoming',
            status: 'rendered',
            message: 'Hello, World!',
        };

        // When
        const conversationItem = createConversationItemDom(props);

        // Then
        expect(conversationItem.classList.contains('nlux_cnv_itm_incoming')).toBe(true);
    });

    it('should render message with the right direction class', () => {
        // Given
        const props: ConversationItemProps = {
            direction: 'incoming',
            status: 'rendered',
            message: 'Hello, World!',
        };
        const conversationItem = createConversationItemDom(props);

        // When
        const message = conversationItem.querySelector('.nlux_comp_msg') as HTMLElement;

        // Then
        expect(message.classList.contains('nlux_msg_incoming')).toBe(true);
    });

    it('should render profile picture', () => {
        // Given
        const props: ConversationItemProps = {
            direction: 'incoming',
            status: 'rendered',
            message: 'Hello, World!',
            name: 'John Doe',
            picture: 'https://example.com/john-doe.jpg',
        };
        const conversationItem = createConversationItemDom(props);

        // When
        const persona = conversationItem.querySelector('.nlux_comp_cht_pic') as HTMLElement;

        // Then
        expect(persona).not.toBeNull();
        expect(persona.outerHTML).toEqual(expect.stringContaining('url(https://example.com/john-doe.jpg)'));
        expect(persona.outerHTML).toEqual(expect.stringContaining('John Doe'));
    });

    describe('and the direction changes to outgoing', () => {
        it('should render the item with the outgoing class', () => {
            // Given
            const props: ConversationItemProps = {
                direction: 'incoming',
                status: 'rendered',
                message: 'Hello, World!',
            };
            const conversationItem = createConversationItemDom(props);

            // When
            const newProps: ConversationItemProps = {
                ...props,
                direction: 'outgoing',
            };
            updateConversationItemDom(conversationItem, props, newProps);

            // Then
            expect(conversationItem.classList.contains('nlux_cnv_itm_incoming')).toBe(false);
            expect(conversationItem.classList.contains('nlux_cnv_itm_outgoing')).toBe(true);
        });

        it('should render message with the outgoing class', () => {
            // Given
            const props: ConversationItemProps = {
                direction: 'incoming',
                status: 'rendered',
                message: 'Hello, World!',
            };
            const conversationItem = createConversationItemDom(props);

            // When
            const newProps: ConversationItemProps = {
                ...props,
                direction: 'outgoing',
            };
            updateConversationItemDom(conversationItem, props, newProps);

            // Then
            const message = conversationItem.querySelector('.nlux_comp_msg') as HTMLElement;
            expect(message.classList.contains('nlux_msg_incoming')).toBe(false);
            expect(message.classList.contains('nlux_msg_outgoing')).toBe(true);
        });
    });
});
