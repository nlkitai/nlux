import {createMessageDom} from '@nlux-dev/core/src/ui/Message/create';
import {MessageProps} from '@nlux-dev/core/src/ui/Message/props';
import {updateMessageDom} from '@nlux-dev/core/src/ui/Message/update';
import {describe, expect, it} from 'vitest';

describe('When a message component is rendered and is in streaming status', () => {
    it('should ignore the message', () => {
        // Given
        const dom = createMessageDom({direction: 'incoming', status: 'streaming', message: 'Hello, World!'});

        // When
        const html = dom.outerHTML;

        // Then
        expect(html).toBe('<div class="nlux_comp_msg nlux_msg_streaming nlux_msg_incoming"></div>');
    });

    describe('When message is updated', () => {
        it('should ignore the message', () => {
            // Given
            const beforeProps: MessageProps = {direction: 'incoming', status: 'streaming', message: 'Hello, World!'};
            const props: MessageProps = {direction: 'incoming', status: 'streaming', message: 'Goodbye, World!'};
            const dom = createMessageDom(beforeProps);

            // When
            updateMessageDom(dom, beforeProps, props);

            // Then
            expect(dom.outerHTML).toBe('<div class="nlux_comp_msg nlux_msg_streaming nlux_msg_incoming"></div>');
        });
    });
});
