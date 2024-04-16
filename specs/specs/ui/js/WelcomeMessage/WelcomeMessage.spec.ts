import {describe, expect, it} from 'vitest';
import {createWelcomeMessageDom} from '../../../../../packages/shared/src/ui/WelcomeMessage/create';
import {WelcomeMessageProps} from '../../../../../packages/shared/src/ui/WelcomeMessage/props';

describe('When welcome message is rendered', () => {
    it('Should render the message with the incoming class', () => {
        // Given
        const props: WelcomeMessageProps = {
            name: 'John Doe',
            picture: 'https://example.com/avatar.jpg',
            message: 'Hello, World!',
        };

        // When
        const welcomeMessage = createWelcomeMessageDom(props);

        // Then
        expect(welcomeMessage.classList.contains('nlux-comp-wlc_msg')).toBe(true);
    });

    it('Should render the welcome message with the name', () => {
        // Given
        const props: WelcomeMessageProps = {
            name: 'John Doe',
            picture: 'https://example.com/avatar.jpg',
        };

        // When
        const welcomeMessage = createWelcomeMessageDom(props);
        const name = welcomeMessage.querySelector('.nlux-comp-wlc_msg_prs_nm')!.textContent;

        // Then
        expect(name).toBe(props.name);
    });

    it('Should render the welcome message with the picture', () => {
        // Given
        const props: WelcomeMessageProps = {
            name: 'John Doe',
            picture: 'https://example.com/avatar.jpg',
        };

        // When
        const welcomeMessage = createWelcomeMessageDom(props);
        const personaPicture = welcomeMessage.querySelector('.nlux-comp-avtr') as HTMLImageElement;

        // Then
        expect(personaPicture).not.toBeNull();
        expect(personaPicture.outerHTML).toEqual(
            expect.stringContaining('url(https://example.com/avatar.jpg)'),
        );
    });

    it('Should render the welcome message with the message', () => {
        // Given
        const props: WelcomeMessageProps = {
            name: 'John Doe',
            picture: 'https://example.com/avatar.jpg',
            message: 'Hello, World!',
        };

        // When
        const welcomeMessageElement = createWelcomeMessageDom(props);
        const welcomeMessage = welcomeMessageElement.querySelector('.nlux-comp-wlc_msg_txt')!.textContent;

        // Then
        expect(welcomeMessage).toBe('Hello, World!');
    });
});
