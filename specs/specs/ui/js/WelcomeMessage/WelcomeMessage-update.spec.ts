import {describe, expect, it} from 'vitest';
import {createWelcomeMessageDom} from '../../../../../packages/shared/src/ui/WelcomeMessage/create';
import {WelcomeMessageProps} from '../../../../../packages/shared/src/ui/WelcomeMessage/props';
import {updateWelcomeMessageDom} from '../../../../../packages/shared/src/ui/WelcomeMessage/update';

describe('When welcome message is rendered for update', () => {
    describe('When the message is updated', () => {
        it('Should update the message with the new message', () => {
            // Arrange
            const props: WelcomeMessageProps = {
                name: 'John Doe',
                picture: 'https://example.com/avatar.jpg',
                message: 'Hello, World!',
            };

            const welcomeMessage = createWelcomeMessageDom(props);
            const newMessage = 'Goodbye, World!';

            // Act
            updateWelcomeMessageDom(welcomeMessage, props, {...props, message: newMessage});

            // Assert
            expect(welcomeMessage.querySelector('.nlux-comp-wlc_msg_txt')!.textContent).toBe(newMessage);
        });
    });

    describe('When the name is updated', () => {
        it('Should update the message with the new name', () => {
            // Arrange
            const props: WelcomeMessageProps = {
                name: 'John Doe',
                picture: 'https://example.com/avatar.jpg',
                message: 'Hello, World!',
            };

            const welcomeMessage = createWelcomeMessageDom(props);
            const newName = 'Jane Doe';

            // Act
            updateWelcomeMessageDom(welcomeMessage, props, {...props, name: newName});
            const name = welcomeMessage.querySelector('.nlux-comp-wlc_msg_prs_nm')!.textContent;

            // Assert
            expect(name).toBe(newName);
        });
    });

    describe('When the picture URL is updated', () => {
        it('Should update the message with the new picture', () => {
            // Arrange
            const props: WelcomeMessageProps = {
                name: 'John Doe',
                picture: 'https://example.com/avatar.jpg',
                message: 'Hello, World!',
            };

            const welcomeMessage = createWelcomeMessageDom(props);
            const newPicture = 'https://example.com/new-avatar.jpg';

            // Act
            updateWelcomeMessageDom(welcomeMessage, props, {...props, picture: newPicture});
            const personaPicture = welcomeMessage.querySelector('.nlux-comp-avtr') as HTMLImageElement;

            // Assert
            expect(personaPicture).not.toBeNull();
            expect(personaPicture.outerHTML).toEqual(
                expect.stringContaining('url(https://example.com/new-avatar.jpg)'),
            );
        });
    });
});
