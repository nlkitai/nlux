import {className as chatPersonaPictureClassName} from '@nlux-dev/core/src/comp/Avatar/create';
import {createChatItemDom} from '@nlux-dev/core/src/comp/ChatItem/create';
import {ChatItemProps} from '@nlux-dev/core/src/comp/ChatItem/props';
import {updateChatItemDom} from '@nlux-dev/core/src/comp/ChatItem/update';
import {describe, expect, it} from 'vitest';

describe('When a chat item component is rendered in outgoing direction', () => {
    describe('when the profile picture is updated', () => {
        it('should update the profile picture', () => {
            // Given
            const props: ChatItemProps = {
                direction: 'outgoing',
                status: 'rendered',
                message: 'Hello, World!',
                name: 'John Doe',
                picture: 'https://example.com/john-doe.jpg',
            };
            const chatItem = createChatItemDom(props);
            const persona = chatItem.querySelector(
                `.${chatPersonaPictureClassName}`,
            ) as HTMLElement;

            // When
            updateChatItemDom(chatItem, props, {
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
            const props: ChatItemProps = {
                direction: 'outgoing',
                status: 'rendered',
                message: 'Hello, World!',
                name: 'John Doe',
                picture: 'https://example.com/john-doe.jpg',
            };
            const chatItem = createChatItemDom(props);
            const persona = chatItem.querySelector(
                `.${chatPersonaPictureClassName}`,
            ) as HTMLElement;

            // When
            updateChatItemDom(chatItem, props, {
                ...props,
                name: 'Jane Doe',
            });

            // Then
            expect(persona.outerHTML).toEqual(expect.stringContaining('Jane Doe'));
        });
    });
});
