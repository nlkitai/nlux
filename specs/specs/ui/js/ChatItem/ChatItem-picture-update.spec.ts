import {describe, expect, it} from 'vitest';
import {className as avatarClassName} from '../../../../../packages/shared/src/components/Avatar/create';
import {
    createChatItemDom,
    participantInfoContainerClassName,
} from '../../../../../packages/shared/src/components/ChatItem/create';
import {ChatItemProps} from '../../../../../packages/shared/src/components/ChatItem/props';
import {updateChatItemDom} from '../../../../../packages/shared/src/components/ChatItem/update';

describe('When a chat item component is complete in sent direction', () => {
    describe('When the avatar is updated', () => {
        it('Should update the avatar', () => {
            // Arrange
            const props: ChatItemProps = {
                direction: 'sent',
                layout: 'bubbles',
                status: 'complete',
                message: 'Hello, World!',
                name: 'John Doe',
                avatar: 'https://example.com/john-doe.jpg',
            };
            const chatItem = createChatItemDom(props);
            const persona = chatItem.querySelector(
                `.${avatarClassName}`,
            ) as HTMLElement;

            // Act
            updateChatItemDom(chatItem, props, {
                ...props,
                avatar: 'https://example.com/jane-doe.jpg',
            });

            // Assert
            expect(persona.outerHTML).toEqual(expect.stringContaining('url(https://example.com/jane-doe.jpg)'));
        });
    });

    describe('When the profile name is updated', () => {
        it('Should update the profile name', () => {
            // Arrange
            const props: ChatItemProps = {
                direction: 'sent',
                layout: 'bubbles',
                status: 'complete',
                message: 'Hello, World!',
                name: 'John Doe',
                avatar: 'https://example.com/john-doe.jpg',
            };
            const chatItem = createChatItemDom(props);
            const avatar = chatItem.querySelector(
                `.${participantInfoContainerClassName} > .${avatarClassName}`,
            )!;

            // Act
            updateChatItemDom(chatItem, props, {
                ...props,
                name: 'Jane Doe',
            });

            // Assert
            expect(avatar.outerHTML).toEqual(expect.stringContaining('Jane Doe'));
        });
    });
});
