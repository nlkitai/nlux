import {describe, expect, it} from 'vitest';
import {
    createChatItemDom,
    participantInfoContainerClassName,
    participantNameClassName,
} from '../../../../../packages/shared/src/ui/ChatItem/create';
import {ChatItemProps} from '../../../../../packages/shared/src/ui/ChatItem/props';
import {updateChatItemDom} from '../../../../../packages/shared/src/ui/ChatItem/update';

describe('When a chat item component is created', () => {
    it('The participant name should be displayed', () => {
        // Arrange
        const props: ChatItemProps = {
            name: 'John Doe',
            direction: 'incoming',
            layout: 'bubbles',
            status: 'complete',
            message: 'Hello, World!',
        };
        const chatItem = createChatItemDom(props);
        const participantName = chatItem.querySelector(`.${participantInfoContainerClassName} > .${participantNameClassName}`);

        // Act
        updateChatItemDom(chatItem, props, {
            ...props,
            message: 'Hello, Universe!',
        });

        // Assert
        participantName && expect(participantName.textContent).toBe('John Doe');
    });

    describe('When the participant name is updated', () => {
        it('Should update the participant name', () => {
            // Arrange
            const props: ChatItemProps = {
                name: 'John Doe',
                direction: 'incoming',
                layout: 'bubbles',
                status: 'complete',
                message: 'Hello, World!',
            };
            const chatItem = createChatItemDom(props);
            const participantName = chatItem.querySelector(`.${participantInfoContainerClassName} > .${participantNameClassName}`);

            // Act
            updateChatItemDom(chatItem, props, {
                ...props,
                name: 'Alice Poe',
            });

            // Assert
            participantName && expect(participantName.textContent).toBe('Alice Poe');
        });
    });
});
