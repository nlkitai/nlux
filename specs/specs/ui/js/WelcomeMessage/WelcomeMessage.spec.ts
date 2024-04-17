import {describe, expect, it} from 'vitest';
import {createWelcomeMessageDom} from '../../../../../packages/shared/src/ui/WelcomeMessage/create';
import {WelcomeMessageProps} from '../../../../../packages/shared/src/ui/WelcomeMessage/props';

describe('When welcome message is rendered', () => {
    it('Should render the message with the incoming class', () => {
        // Arrange
        const props: WelcomeMessageProps = {
            name: 'John Doe',
            picture: 'https://example.com/avatar.jpg',
            message: 'Hello, World!',
        };

        // Act
        const welcomeMessage = createWelcomeMessageDom(props);

        // Assert
        expect(welcomeMessage.classList.contains('nlux-comp-wlc_msg')).toBe(true);
    });

    it('Should render the welcome message with the name', () => {
        // Arrange
        const props: WelcomeMessageProps = {
            name: 'John Doe',
            picture: 'https://example.com/avatar.jpg',
        };

        // Act
        const welcomeMessage = createWelcomeMessageDom(props);
        const name = welcomeMessage.querySelector('.nlux-comp-wlc_msg_prs_nm')!.textContent;

        // Assert
        expect(name).toBe(props.name);
    });

    it('Should render the welcome message with the picture', () => {
        // Arrange
        const props: WelcomeMessageProps = {
            name: 'John Doe',
            picture: 'https://example.com/avatar.jpg',
        };

        // Act
        const welcomeMessage = createWelcomeMessageDom(props);
        const personaPicture = welcomeMessage.querySelector('.nlux-comp-avtr') as HTMLImageElement;

        // Assert
        expect(personaPicture).not.toBeNull();
        expect(personaPicture.outerHTML).toEqual(
            expect.stringContaining('url(https://example.com/avatar.jpg)'),
        );
    });

    it('Should render the welcome message with the message', () => {
        // Arrange
        const props: WelcomeMessageProps = {
            name: 'John Doe',
            picture: 'https://example.com/avatar.jpg',
            message: 'Hello, World!',
        };

        // Act
        const welcomeMessageElement = createWelcomeMessageDom(props);
        const welcomeMessage = welcomeMessageElement.querySelector('.nlux-comp-wlc_msg_txt')!.textContent;

        // Assert
        expect(welcomeMessage).toBe('Hello, World!');
    });
});
