import {describe, expect, it} from 'vitest';
import {createGreetingDom} from '@shared/components/Greeting/create';
import {GreetingProps} from '@shared/components/Greeting/props';
import {updateGreetingDom} from '@shared/components/Greeting/update';

describe('When greeting message is rendered for update', () => {
    describe('When the message is updated', () => {
        it('Should update the message with the new message', () => {
            // Arrange
            const props: GreetingProps = {
                name: 'John Doe',
                avatar: 'https://example.com/avatar.jpg',
                message: 'Hello, World!',
            };

            const greeting = createGreetingDom(props);
            const newMessage = 'Goodbye, World!';

            // Act
            updateGreetingDom(greeting, props, {...props, message: newMessage});

            // Assert
            expect(greeting.querySelector('.nlux-comp-welcomeMessage-text')!.textContent).toBe(newMessage);
        });
    });

    describe('When the name is updated', () => {
        it('Should update the message with the new name', () => {
            // Arrange
            const props: GreetingProps = {
                name: 'John Doe',
                avatar: 'https://example.com/avatar.jpg',
                message: 'Hello, World!',
            };

            const greeting = createGreetingDom(props);
            const newName = 'Jane Doe';

            // Act
            updateGreetingDom(greeting, props, {...props, name: newName});
            const name = greeting.querySelector('.nlux-comp-welcomeMessage-personaName')!.textContent;

            // Assert
            expect(name).toBe(newName);
        });
    });

    describe('When the avatar URL is updated', () => {
        it('Should update the message with the new avatar', () => {
            // Arrange
            const props: GreetingProps = {
                name: 'John Doe',
                avatar: 'https://example.com/avatar.jpg',
                message: 'Hello, World!',
            };

            const greeting = createGreetingDom(props);
            const newAvatar = 'https://example.com/new-avatar.jpg';

            // Act
            updateGreetingDom(greeting, props, {...props, avatar: newAvatar});
            const personaAvatar = greeting.querySelector('.nlux-comp-avatar') as HTMLImageElement;

            // Assert
            expect(personaAvatar).not.toBeNull();
            expect(personaAvatar.outerHTML).toEqual(
                expect.stringContaining('url(https://example.com/new-avatar.jpg)'),
            );
        });
    });
});
