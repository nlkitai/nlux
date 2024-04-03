import {createChatPictureDom} from '@nlux-dev/core/src/comp/ChatPicture/create';
import {ChatPictureProps} from '@nlux-dev/core/src/comp/ChatPicture/props';
import {describe, expect, it} from 'vitest';

describe('When a chat picture component is rendered with url as picture', () => {
    it('should render the photo container with the photo in the foreground', () => {
        // Given
        const url = 'https://example.com/photo.jpg';
        const name = 'John Doe';
        const picture = url;
        const props: ChatPictureProps = {name, picture};

        // When
        const element = createChatPictureDom(props);

        // Then
        expect(element.outerHTML).toBe(
            `<div class="nlux_comp_cht_pic" title="${name}"><div class="cht_pic_ctn">` +
            `<span class="cht_pic_ltr">J</span>` +
            `<div class="cht_pic_img" style="background-image: url(https://example.com/photo.jpg);"></div>` +
            `</div></div>`,
        );
    });
});
