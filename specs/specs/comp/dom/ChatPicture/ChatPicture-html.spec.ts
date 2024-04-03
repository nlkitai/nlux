import {createChatPictureDom} from '@nlux-dev/core/src/comp/ChatPicture/create';
import {ChatPictureProps} from '@nlux-dev/core/src/comp/ChatPicture/props';
import {updateChatPictureDom} from '@nlux-dev/core/src/comp/ChatPicture/update';
import {describe, expect, it} from 'vitest';

describe('When a chat picture component is rendered with HTML element as picture', () => {
    it('should render the picture as is', () => {
        // Given
        const name = 'John Doe';
        const picture = document.createElement('img');
        picture.src = 'https://example.com/photo.jpg';
        const props: ChatPictureProps = {name, picture};

        // When
        const element = createChatPictureDom(props);

        // Then
        expect(element.outerHTML).toBe(
            `<div class="nlux_comp_cht_pic" title="${name}"><img src="https://example.com/photo.jpg"></div>`,
        );
    });

    describe('When no picture or name is provided', () => {
        it('should render an empty div', () => {
            // Given
            const props: ChatPictureProps = {};

            // When
            const element = createChatPictureDom(props);

            // Then
            expect(element.outerHTML).toBe('<div class="nlux_comp_cht_pic"></div>');
        });
    });

    describe('When only name is provided', () => {
        it('should render the name first letter', () => {
            // Given
            const name = 'John Doe';
            const props: ChatPictureProps = {name};

            // When
            const element = createChatPictureDom(props);

            // Then
            expect(element.outerHTML).toBe(
                `<div class="nlux_comp_cht_pic" title="John Doe"><div class="cht_pic_ctn"><span class="cht_pic_ltr">J</span></div></div>`,
            );
        });
    });

    describe('When the picture element is updated', () => {
        it('should render the new picture as is', () => {
            // Given
            const name = 'John Doe';
            const picture1 = document.createElement('img');
            picture1.src = 'https://example.com/photo1.jpg';
            const props: ChatPictureProps = {name, picture: picture1};
            const picture2 = document.createElement('img');
            picture2.src = 'https://example.com/photo2.jpg';
            const element = createChatPictureDom(props);

            // When
            updateChatPictureDom(
                element,
                props,
                {...props, picture: picture2},
            );

            // Then
            expect(element.outerHTML).toBe(
                `<div class="nlux_comp_cht_pic" title="${name}"><img src="https://example.com/photo2.jpg"></div>`,
            );
        });

        describe('When the new picture is a string', () => {
            it('should render the new picture as URL', () => {
                // Given
                const name = 'John Doe';
                const picture1 = document.createElement('img');
                picture1.src = 'https://example.com/photo1.jpg';
                const props: ChatPictureProps = {
                    name,
                    picture: picture1,
                };
                const newProps: ChatPictureProps = {
                    name,
                    picture: 'https://example.com/photo2.jpg',
                };
                const picture2 = 'https://example.com/photo2.jpg';
                const element = createChatPictureDom(props);

                // When
                updateChatPictureDom(
                    element,
                    props,
                    newProps,
                );

                // Then
                expect(element.outerHTML).toBe(
                    `<div class="nlux_comp_cht_pic" title="John Doe"><div class="cht_pic_ctn">` +
                    `<span class="cht_pic_ltr">J</span>` +
                    `<div class="cht_pic_img" style="background-image: url(https://example.com/photo2.jpg);"></div>` +
                    `</div></div>`,
                );
            });

            it('should render the new picture as URL and change name', () => {
                // Given
                const name = 'John Doe';
                const picture1 = document.createElement('img');
                picture1.src = 'https://example.com/photo1.jpg';
                const props: ChatPictureProps = {name, picture: picture1};
                const newProps: ChatPictureProps = {
                    name: 'Alex Doe',
                    picture: 'https://example.com/photo2.jpg',
                };
                const picture2 = 'https://example.com/photo2.jpg';
                const element = createChatPictureDom(props);

                // When
                updateChatPictureDom(
                    element,
                    props,
                    newProps,
                );

                // Then
                expect(element.outerHTML).toBe(
                    `<div class="nlux_comp_cht_pic" title="Alex Doe"><div class="cht_pic_ctn">` +
                    `<span class="cht_pic_ltr">A</span>` +
                    `<div class="cht_pic_img" style="background-image: url(https://example.com/photo2.jpg);"></div>` +
                    `</div></div>`,
                );
            });
        });
    });
});
