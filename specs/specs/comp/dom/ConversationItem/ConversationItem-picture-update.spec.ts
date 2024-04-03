import {className as chatPersonaPictureClassName} from '@nlux-dev/core/src/comp/ChatPicture/create';
import {createConversationItemDom} from '@nlux-dev/core/src/comp/ConversationItem/create';
import {ConversationItemProps} from '@nlux-dev/core/src/comp/ConversationItem/props';
import {updateConversationItemDom} from '@nlux-dev/core/src/comp/ConversationItem/update';
import {describe, expect, it} from 'vitest';

describe('When a conversation item component is rendered in outgoing direction', () => {
    describe('when the profile picture is updated', () => {
        it('should update the profile picture', () => {
            // Given
            const props: ConversationItemProps = {
                direction: 'outgoing',
                status: 'rendered',
                message: 'Hello, World!',
                name: 'John Doe',
                picture: 'https://example.com/john-doe.jpg',
            };
            const conversationItem = createConversationItemDom(props);
            const persona = conversationItem.querySelector(
                `.${chatPersonaPictureClassName}`,
            ) as HTMLElement;

            // When
            updateConversationItemDom(conversationItem, props, {
                ...props,
                picture: 'https://example.com/jane-doe.jpg',
            });

            // Then
            expect(persona.outerHTML).toEqual(expect.stringContaining('url(https://example.com/jane-doe.jpg)'));
        });
    });

    describe('when the profile name is updated', () => {
        it('should update the profile name', () => {
            // Given
            const props: ConversationItemProps = {
                direction: 'outgoing',
                status: 'rendered',
                message: 'Hello, World!',
                name: 'John Doe',
                picture: 'https://example.com/john-doe.jpg',
            };
            const conversationItem = createConversationItemDom(props);
            const persona = conversationItem.querySelector(
                `.${chatPersonaPictureClassName}`,
            ) as HTMLElement;

            // When
            updateConversationItemDom(conversationItem, props, {
                ...props,
                name: 'Jane Doe',
            });

            // Then
            expect(persona.outerHTML).toEqual(expect.stringContaining('Jane Doe'));
        });
    });
});
