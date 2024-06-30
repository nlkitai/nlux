import {describe, expect, it} from 'vitest';
import {createGreetingDom} from '@shared/components/Greeting/create';
import {GreetingProps} from '@shared/components/Greeting/props';

describe('When a greeting message is rendered', () => {
    it('Should render the message with the received class', () => {
        // Arrange
        const props: GreetingProps = {
            name: 'John Doe',
            avatar: 'https://example.com/avatar.jpg',
            message: 'Hello, World!',
        };

        // Act
        const greeting = createGreetingDom(props);

        // Assert
        expect(greeting.classList.contains('nlux-comp-welcomeMessage')).toBe(true);
    });

    it('Should render the greetin message with the name', () => {
        // Arrange
        const props: GreetingProps = {
            name: 'John Doe',
            avatar: 'https://example.com/avatar.jpg',
        };

        // Act
        const greeting = createGreetingDom(props);
        const name = greeting.querySelector('.nlux-comp-welcomeMessage-personaName')!.textContent;

        // Assert
        expect(name).toBe(props.name);
    });

    it('Should render the greeting with the avatar', () => {
        // Arrange
        const props: GreetingProps = {
            name: 'John Doe',
            avatar: 'https://example.com/avatar.jpg',
        };

        // Act
        const greeting = createGreetingDom(props);
        const personaAvatar = greeting.querySelector('.nlux-comp-avatar') as HTMLImageElement;

        // Assert
        expect(personaAvatar).not.toBeNull();
        expect(personaAvatar.outerHTML).toEqual(
            expect.stringContaining('url(https://example.com/avatar.jpg)'),
        );
    });

    it('Should render the greeting with the message', () => {
        // Arrange
        const props: GreetingProps = {
            name: 'John Doe',
            avatar: 'https://example.com/avatar.jpg',
            message: 'Hello, World!',
        };

        // Act
        const greetingElement = createGreetingDom(props);
        const greeting = greetingElement.querySelector('.nlux-comp-welcomeMessage-text')!.textContent;

        // Assert
        expect(greeting).toBe('Hello, World!');
    });
});
