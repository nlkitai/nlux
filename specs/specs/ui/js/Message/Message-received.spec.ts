import {describe, expect, it} from 'vitest';
import {createMessageDom} from '../../../../../packages/shared/src/ui/Message/create';
import {MessageProps} from '../../../../../packages/shared/src/ui/Message/props';
import {updateMessageDom} from '../../../../../packages/shared/src/ui/Message/update';

describe('When a message component is rendered and is in rendered status', () => {
    describe('When rendered without any message or status', () => {
        it('Should render an empty message in rendered status', () => {
            // Arrange
            const dom = createMessageDom({} as any);

            // Act
            const html = dom.outerHTML;

            // Assert
            expect(html).toBe('<div class="nlux-comp-msg nlux_msg_rendered"></div>');
        });
    });

    describe('When rendered with a message', () => {
        it('Should render the message', () => {
            // Arrange
            const dom = createMessageDom({
                direction: 'incoming', status: 'rendered', message: 'Hello, World!',
            });

            // Act
            const html = dom.outerHTML;

            // Assert
            expect(html).toBe('<div class="nlux-comp-msg nlux_msg_rendered nlux_msg_incoming">Hello, World!</div>');
        });
    });

    describe('When HTML is provided in message body', () => {
        it('Should be escaped', () => {
            // Arrange
            const props: MessageProps = {
                direction: 'incoming', status: 'rendered', message: '<strong>Hello, World!</strong>',
            };
            const dom = createMessageDom(props);

            // Act
            const html = dom.outerHTML;

            // Assert
            expect(html).toBe(
                '<div class="nlux-comp-msg nlux_msg_rendered nlux_msg_incoming">&lt;strong&gt;Hello, World!&lt;/strong&gt;</div>');
        });
    });

    describe.todo('When markdown is provided in message body', () => {
        it.todo('Should be rendered as HTML');
    });

    describe('When message is updated', () => {
        it('Should update the message', () => {
            // Arrange
            const beforeProps: MessageProps = {direction: 'incoming', status: 'rendered', message: 'Hello, World!'};
            const props: MessageProps = {direction: 'incoming', status: 'rendered', message: 'Goodbye, World!'};
            const dom = createMessageDom(beforeProps);

            // Act
            updateMessageDom(dom, beforeProps, props);

            // Assert
            expect(dom.outerHTML).toBe(
                '<div class="nlux-comp-msg nlux_msg_rendered nlux_msg_incoming">Goodbye, World!</div>',
            );
        });

        it('Should escape HTML in the new message', () => {
            // Arrange
            const beforeProps: MessageProps = {direction: 'incoming', status: 'rendered', message: 'Hello, World!'};
            const dom = createMessageDom(beforeProps);

            // Act
            updateMessageDom(
                dom,
                beforeProps,
                {direction: 'incoming', status: 'rendered', message: '<strong>Goodbye, World!</strong>'},
            );

            // Assert
            expect(dom.outerHTML).toBe(
                '<div class="nlux-comp-msg nlux_msg_rendered nlux_msg_incoming">&lt;strong&gt;Goodbye, World!&lt;/strong&gt;</div>',
            );
        });
    });

    describe('When message is updated with the same message', () => {
        it('Should not update the message', () => {
            // Arrange
            const props: MessageProps = {direction: 'incoming', status: 'rendered', message: 'Hello, World!'};
            const dom = createMessageDom(props);

            // Act
            updateMessageDom(dom, props, props);

            // Assert
            expect(dom.outerHTML).toBe(
                '<div class="nlux-comp-msg nlux_msg_rendered nlux_msg_incoming">Hello, World!</div>');
        });
    });

    describe('When message is updated with the same message and status', () => {
        it('Should not update the message', () => {
            // Arrange
            const props: MessageProps = {direction: 'incoming', status: 'rendered', message: 'Hello, World!'};
            const dom = createMessageDom(props);

            // Act
            updateMessageDom(dom, props, {...props});

            // Assert
            expect(dom.outerHTML).toBe(
                '<div class="nlux-comp-msg nlux_msg_rendered nlux_msg_incoming">Hello, World!</div>');
        });
    });

    describe('When message is updated with the same status', () => {
        it('Should not update the message', () => {
            // Arrange
            const props: MessageProps = {direction: 'incoming', status: 'rendered', message: 'Hello, World!'};
            const dom = createMessageDom(props);

            // Act
            updateMessageDom(dom, props, {direction: 'incoming', status: 'rendered', message: 'Hello, World!'});

            // Assert
            expect(dom.outerHTML).toBe(
                '<div class="nlux-comp-msg nlux_msg_rendered nlux_msg_incoming">Hello, World!</div>');
        });
    });

    describe('When the status changes to loading', () => {
        it('Should remove the message, update class name, and render default loader', () => {
            // Arrange
            const initialProps: MessageProps = {direction: 'incoming', status: 'rendered', message: 'Hello, World!'};
            const newProps: MessageProps = {direction: 'incoming', status: 'loading'};
            const dom = createMessageDom(initialProps);

            // Act
            const beforeHtml = dom.outerHTML;
            updateMessageDom(dom, initialProps, newProps);
            const afterHtml = dom.outerHTML;

            // Assert
            expect(beforeHtml).toBe(
                '<div class="nlux-comp-msg nlux_msg_rendered nlux_msg_incoming">Hello, World!</div>',
            );
            expect(afterHtml).toBe(
                '<div class="nlux-comp-msg nlux_msg_incoming nlux_msg_loading"><div class="nlux_msg_ldr">' +
                '<div class="spn_ldr_ctn"><span class="spn_ldr"></span></div></div></div>',
            );
        });

        describe('When the status changes back to rendered', () => {
            it('Should remove the loader and render the message', () => {
                // Arrange
                const initialProps: MessageProps = {
                    direction: 'incoming',
                    status: 'rendered',
                    message: 'Hello, World!',
                };
                const newProps1: MessageProps = {direction: 'incoming', status: 'loading', message: 'Hello, World!'};
                const newProps2: MessageProps = {direction: 'incoming', status: 'rendered', message: 'Hello, World!'};
                const dom = createMessageDom(initialProps);

                // Act
                updateMessageDom(dom, initialProps, newProps1);

                // Assert
                expect(dom.outerHTML).toBe(
                    '<div class="nlux-comp-msg nlux_msg_incoming nlux_msg_loading"><div class="nlux_msg_ldr">' +
                    '<div class="spn_ldr_ctn"><span class="spn_ldr"></span></div></div></div>');

                // Act
                updateMessageDom(dom, newProps1, newProps2);

                // Assert
                expect(dom.outerHTML).toBe(
                    '<div class="nlux-comp-msg nlux_msg_incoming nlux_msg_rendered">Hello, World!</div>');
            });
        });
    });
});
