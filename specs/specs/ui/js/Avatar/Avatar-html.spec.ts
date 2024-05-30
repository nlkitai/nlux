import {describe, expect, it} from 'vitest';
import {createAvatarDom} from '../../../../../packages/shared/src/ui/Avatar/create';
import {AvatarProps} from '../../../../../packages/shared/src/ui/Avatar/props';
import {updateAvatarDom} from '../../../../../packages/shared/src/ui/Avatar/update';

describe('When an avatar component is rendered with HTML element the avatar', () => {
    it('Should render the avatar as is', () => {
        // Arrange
        const name = 'John Doe';
        const avatar = document.createElement('img');
        avatar.src = 'https://example.com/photo.jpg';
        const props: AvatarProps = {name, avatar};

        // Act
        const element = createAvatarDom(props);

        // Assert
        expect(element.outerHTML).toBe(
            `<div class="nlux-comp-avtr" title="${name}"><img src="https://example.com/photo.jpg"></div>`,
        );
    });

    describe('When no avatar or name is provided', () => {
        it('Should render an empty div', () => {
            // Arrange
            const props: AvatarProps = {};

            // Act
            const element = createAvatarDom(props);

            // Assert
            expect(element.outerHTML).toBe('<div class="nlux-comp-avtr"></div>');
        });
    });

    describe('When only name is provided', () => {
        it('Should render an empty div with the name as title', () => {
            // Arrange
            const name = 'John Doe';
            const props: AvatarProps = {name};

            // Act
            const element = createAvatarDom(props);

            // Assert
            expect(element.outerHTML).toBe(
                `<div class="nlux-comp-avtr" title="John Doe"><div class="avtr_ctn"></div></div>`,
            );
        });
    });

    describe('When the avatar element is updated', () => {
        it('Should render the new avatar as is', () => {
            // Arrange
            const name = 'John Doe';
            const picture1 = document.createElement('img');
            picture1.src = 'https://example.com/photo1.jpg';
            const props: AvatarProps = {name, avatar: picture1};
            const picture2 = document.createElement('img');
            picture2.src = 'https://example.com/photo2.jpg';
            const element = createAvatarDom(props);

            // Act
            updateAvatarDom(
                element,
                props,
                {...props, avatar: picture2},
            );

            // Assert
            expect(element.outerHTML).toBe(
                `<div class="nlux-comp-avtr" title="${name}"><img src="https://example.com/photo2.jpg"></div>`,
            );
        });

        describe('When the new avatar is a string', () => {
            it('Should render the new avatar as URL', () => {
                // Arrange
                const name = 'John Doe';
                const picture1 = document.createElement('img');
                picture1.src = 'https://example.com/photo1.jpg';
                const props: AvatarProps = {
                    name,
                    avatar: picture1,
                };
                const newProps: AvatarProps = {
                    name,
                    avatar: 'https://example.com/photo2.jpg',
                };
                const picture2 = 'https://example.com/photo2.jpg';
                const element = createAvatarDom(props);

                // Act
                updateAvatarDom(
                    element,
                    props,
                    newProps,
                );

                // Assert
                expect(element.outerHTML).toBe(
                    `<div class="nlux-comp-avtr" title="John Doe"><div class="avtr_ctn">` +
                    `<div class="avtr_img" style="background-image: url(https://example.com/photo2.jpg);"></div>` +
                    `</div></div>`,
                );
            });

            it('Should render the new avatar as URL and change name', () => {
                // Arrange
                const name = 'John Doe';
                const picture1 = document.createElement('img');
                picture1.src = 'https://example.com/photo1.jpg';
                const props: AvatarProps = {name, avatar: picture1};
                const newProps: AvatarProps = {
                    name: 'Alex Doe',
                    avatar: 'https://example.com/photo2.jpg',
                };
                const picture2 = 'https://example.com/photo2.jpg';
                const element = createAvatarDom(props);

                // Act
                updateAvatarDom(
                    element,
                    props,
                    newProps,
                );

                // Assert
                expect(element.outerHTML).toBe(
                    `<div class="nlux-comp-avtr" title="Alex Doe"><div class="avtr_ctn">` +
                    `<div class="avtr_img" style="background-image: url(https://example.com/photo2.jpg);"></div>` +
                    `</div></div>`,
                );
            });
        });
    });
});
