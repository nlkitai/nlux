import {describe, expect, it} from 'vitest';
import {createWelcomeMessageDom} from '@shared/components/WelcomeMessage/create';
import {WelcomeMessageProps} from '@shared/components/WelcomeMessage/props';
import {updateWelcomeMessageDom} from '@shared/components/WelcomeMessage/update';

describe('When welcome message is rendered for update', () => {
    describe('When the message is updated', () => {
        it('Should update the message with the new message', () => {
            // Arrange
            const props: WelcomeMessageProps = {
                name: 'John Doe',
                avatar: 'https://example.com/avatar.jpg',
                message: 'Hello, World!',
            };

            const welcomeMessage = createWelcomeMessageDom(props);
            const newMessage = 'Goodbye, World!';

            // Act
            updateWelcomeMessageDom(welcomeMessage, props, {...props, message: newMessage});

            // Assert
            expect(welcomeMessage.querySelector('.nlux-comp-welcomeMessage-text')!.textContent).toBe(newMessage);
        });
    });

    describe('When the name is updated', () => {
        it('Should update the message with the new name', () => {
            // Arrange
            const props: WelcomeMessageProps = {
                name: 'John Doe',
                avatar: 'https://example.com/avatar.jpg',
                message: 'Hello, World!',
            };

            const welcomeMessage = createWelcomeMessageDom(props);
            const newName = 'Jane Doe';

            // Act
            updateWelcomeMessageDom(welcomeMessage, props, {...props, name: newName});
            const name = welcomeMessage.querySelector('.nlux-comp-welcomeMessage-personaName')!.textContent;

            // Assert
            expect(name).toBe(newName);
        });
    });

    describe('When the avatar URL is updated', () => {
        it('Should update the message with the new avatar', () => {
            // Arrange
            const props: WelcomeMessageProps = {
                name: 'John Doe',
                avatar: 'https://example.com/avatar.jpg',
                message: 'Hello, World!',
            };

            const welcomeMessage = createWelcomeMessageDom(props);
            const newAvatar = 'https://example.com/new-avatar.jpg';

            // Act
            updateWelcomeMessageDom(welcomeMessage, props, {...props, avatar: newAvatar});
            const personaAvatar = welcomeMessage.querySelector('.nlux-comp-avatar') as HTMLImageElement;

            // Assert
            expect(personaAvatar).not.toBeNull();
            expect(personaAvatar.outerHTML).toEqual(
                expect.stringContaining('url(https://example.com/new-avatar.jpg)'),
            );
        });
    });
});
