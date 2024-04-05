import {className as chatPersonaPictureClassName} from '@nlux-dev/core/src/comp/Avatar/create';
import {createConvItemDom} from '@nlux-dev/core/src/comp/ConversationItem/create';
import {ConvItemProps} from '@nlux-dev/core/src/comp/ConversationItem/props';
import {updateConvItemDom} from '@nlux-dev/core/src/comp/ConversationItem/update';
import {describe, expect, it} from 'vitest';

describe('When a conversation item component is rendered in outgoing direction', () => {
    describe('when the profile picture is updated', () => {
        it('should update the profile picture', () => {
            // Given
            const props: ConvItemProps = {
                direction: 'outgoing',
                status: 'rendered',
                message: 'Hello, World!',
                name: 'John Doe',
                picture: 'https://example.com/john-doe.jpg',
            };
            const conversationItem = createConvItemDom(props);
            const persona = conversationItem.querySelector(
                `.${chatPersonaPictureClassName}`,
            ) as HTMLElement;

            // When
            updateConvItemDom(conversationItem, props, {
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
            const props: ConvItemProps = {
                direction: 'outgoing',
                status: 'rendered',
                message: 'Hello, World!',
                name: 'John Doe',
                picture: 'https://example.com/john-doe.jpg',
            };
            const conversationItem = createConvItemDom(props);
            const persona = conversationItem.querySelector(
                `.${chatPersonaPictureClassName}`,
            ) as HTMLElement;

            // When
            updateConvItemDom(conversationItem, props, {
                ...props,
                name: 'Jane Doe',
            });

            // Then
            expect(persona.outerHTML).toEqual(expect.stringContaining('Jane Doe'));
        });
    });
});
