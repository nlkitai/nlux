import {createAvatarDom} from '@nlux-dev/core/src/ui/Avatar/create';
import {AvatarProps} from '@nlux-dev/core/src/ui/Avatar/props';
import {describe, expect, it} from 'vitest';

describe('When an avatar component is rendered with url as picture', () => {
    it('Should render the photo container with the photo in the foreground', () => {
        // Given
        const url = 'https://example.com/photo.jpg';
        const name = 'John Doe';
        const picture = url;
        const props: AvatarProps = {name, picture};

        // When
        const element = createAvatarDom(props);

        // Then
        expect(element.outerHTML).toBe(
            `<div class="nlux-comp-avtr" title="${name}"><div class="avtr_ctn">` +
            `<span class="avtr_ltr">J</span>` +
            `<div class="avtr_img" style="background-image: url(https://example.com/photo.jpg);"></div>` +
            `</div></div>`,
        );
    });
});
