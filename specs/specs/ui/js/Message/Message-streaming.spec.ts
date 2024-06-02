import {describe, expect, it} from 'vitest';
import {createMessageDom} from '@shared/components/Message/create';
import {MessageProps} from '@shared/components/Message/props';
import {updateMessageDom} from '@shared/components/Message/update';

describe('When a message component is rendered and is in streaming status', () => {
    it('Should ignore the message', () => {
        // Arrange
        const dom = createMessageDom({direction: 'received', status: 'streaming', message: 'Hello, World!'});

        // Act
        const html = dom.outerHTML;

        // Assert
        expect(html).toBe('<div class="nlux-comp-message nlux_msg_streaming nlux_msg_received"></div>');
    });

    describe('When message is updated', () => {
        it('Should ignore the message', () => {
            // Arrange
            const beforeProps: MessageProps = {direction: 'received', status: 'streaming', message: 'Hello, World!'};
            const props: MessageProps = {direction: 'received', status: 'streaming', message: 'Goodbye, World!'};
            const dom = createMessageDom(beforeProps);

            // Act
            updateMessageDom(dom, beforeProps, props);

            // Assert
            expect(dom.outerHTML).toBe('<div class="nlux-comp-message nlux_msg_streaming nlux_msg_received"></div>');
        });
    });
});
