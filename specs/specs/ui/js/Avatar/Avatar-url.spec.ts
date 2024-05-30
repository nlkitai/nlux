import {describe, expect, it} from 'vitest';
import {createAvatarDom} from '../../../../../packages/shared/src/ui/Avatar/create';
import {AvatarProps} from '../../../../../packages/shared/src/ui/Avatar/props';

describe('When an avatar component is rendered with url as avatar', () => {
    it('Should render the photo container with the photo in the foreground', () => {
        // Arrange
        const url = 'https://example.com/photo.jpg';
        const name = 'John Doe';
        const avatar = url;
        const props: AvatarProps = {name, avatar};

        // Act
        const element = createAvatarDom(props);

        // Assert
        expect(element.outerHTML).toBe(
            `<div class="nlux-comp-avtr" title="${name}"><div class="avtr_ctn">` +
            `<div class="avtr_img" style="background-image: url(https://example.com/photo.jpg);"></div>` +
            `</div></div>`,
        );
    });
});
