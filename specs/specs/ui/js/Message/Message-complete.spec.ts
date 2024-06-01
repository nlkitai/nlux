import {describe, expect, it} from 'vitest';
import {createMessageDom} from '../../../../../packages/shared/src/components/Message/create';
import {MessageProps} from '../../../../../packages/shared/src/components/Message/props';
import {updateMessageDom} from '../../../../../packages/shared/src/components/Message/update';

describe('When a message component is rendered and is in complete status', () => {
    describe('When rendered without any message or status', () => {
        it('Should render an empty message in rendered status', () => {
            // Arrange
            const dom = createMessageDom({} as any);

            // Act
            const html = dom.outerHTML;

            // Assert
            expect(html).toBe('<div class="nlux-comp-msg nlux_msg_complete"></div>');
        });
    });

    describe('When rendered with a message', () => {
        it('Should render the message', () => {
            // Arrange
            const dom = createMessageDom({
                direction: 'received', status: 'complete', message: 'Hello, World!', format: 'text',
            });

            // Act
            const html = dom.outerHTML;

            // Assert
            expect(html).toBe('<div class="nlux-comp-msg nlux_msg_complete nlux_msg_received">Hello, World!</div>');
        });
    });

    describe('When rendered with a message and markdown format', () => {
        it('Should render the message and parse the markdown', () => {
            // Arrange
            const dom = createMessageDom({
                direction: 'received', status: 'complete', message: 'Hello, **World!**', format: 'markdown',
            });

            // Act
            const html = dom.outerHTML;

            // Assert
            expect(html).toBe(
                '<div class="nlux-comp-msg nlux_msg_complete nlux_msg_received"><p>Hello, <strong>World!</strong></p>\n</div>');
        });
    });

    describe('When rendered with a message and text format', () => {
        it('Should render the message and ignore the markdown', () => {
            // Arrange
            const dom = createMessageDom({
                direction: 'received', status: 'complete', message: 'Hello, **World!**', format: 'text',
            });

            // Act
            const html = dom.outerHTML;

            // Assert
            expect(html).toBe(
                '<div class="nlux-comp-msg nlux_msg_complete nlux_msg_received">Hello, **World!**</div>');
        });
    });

    describe('When HTML is provided in message body', () => {
        it('Should be escaped', () => {
            // Arrange
            const props: MessageProps = {
                direction: 'received', status: 'complete', message: '<strong>Hello, World!</strong>',
            };
            const dom = createMessageDom(props);

            // Act
            const html = dom.outerHTML;

            // Assert
            expect(html).toBe(
                '<div class="nlux-comp-msg nlux_msg_complete nlux_msg_received">&lt;strong&gt;Hello, World!&lt;/strong&gt;</div>');
        });
    });

    describe('When message is updated', () => {
        it('Should update the message', () => {
            // Arrange
            const beforeProps: MessageProps = {direction: 'received', status: 'complete', message: 'Hello, World!'};
            const props: MessageProps = {direction: 'received', status: 'complete', message: 'Goodbye, World!'};
            const dom = createMessageDom(beforeProps);

            // Act
            updateMessageDom(dom, beforeProps, props);

            // Assert
            expect(dom.outerHTML).toBe(
                '<div class="nlux-comp-msg nlux_msg_complete nlux_msg_received">Goodbye, World!</div>',
            );
        });

        it('Should escape HTML in the new message', () => {
            // Arrange
            const beforeProps: MessageProps = {direction: 'received', status: 'complete', message: 'Hello, World!'};
            const dom = createMessageDom(beforeProps);

            // Act
            updateMessageDom(
                dom,
                beforeProps,
                {direction: 'received', status: 'complete', message: '<strong>Goodbye, World!</strong>'},
            );

            // Assert
            expect(dom.outerHTML).toBe(
                '<div class="nlux-comp-msg nlux_msg_complete nlux_msg_received">&lt;strong&gt;Goodbye, World!&lt;/strong&gt;</div>',
            );
        });
    });

    describe('When message is updated with the same message', () => {
        it('Should not update the message', () => {
            // Arrange
            const props: MessageProps = {direction: 'received', status: 'complete', message: 'Hello, World!'};
            const dom = createMessageDom(props);

            // Act
            updateMessageDom(dom, props, props);

            // Assert
            expect(dom.outerHTML).toBe(
                '<div class="nlux-comp-msg nlux_msg_complete nlux_msg_received">Hello, World!</div>');
        });
    });

    describe('When message is updated with the same message and status', () => {
        it('Should not update the message', () => {
            // Arrange
            const props: MessageProps = {direction: 'received', status: 'complete', message: 'Hello, World!'};
            const dom = createMessageDom(props);

            // Act
            updateMessageDom(dom, props, {...props});

            // Assert
            expect(dom.outerHTML).toBe(
                '<div class="nlux-comp-msg nlux_msg_complete nlux_msg_received">Hello, World!</div>');
        });
    });

    describe('When message is updated with the same status', () => {
        it('Should not update the message', () => {
            // Arrange
            const props: MessageProps = {direction: 'received', status: 'complete', message: 'Hello, World!'};
            const dom = createMessageDom(props);

            // Act
            updateMessageDom(dom, props, {direction: 'received', status: 'complete', message: 'Hello, World!'});

            // Assert
            expect(dom.outerHTML).toBe(
                '<div class="nlux-comp-msg nlux_msg_complete nlux_msg_received">Hello, World!</div>');
        });
    });

    describe('When status changes to streaming', () => {
        it('Should update the status', () => {
            // Arrange
            const props: MessageProps = {direction: 'received', status: 'complete', message: 'Hello, World!'};
            const dom = createMessageDom(props);

            // Act
            updateMessageDom(dom, props, {direction: 'received', status: 'streaming', message: 'Hello, World!'});

            // Assert
            expect(dom.outerHTML).toBe(
                '<div class="nlux-comp-msg nlux_msg_received nlux_msg_streaming">Hello, World!</div>');
        });
    });
});
