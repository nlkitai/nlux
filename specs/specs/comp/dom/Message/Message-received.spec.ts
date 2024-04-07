import {createMessageDom} from '@nlux-dev/core/src/ui/Message/create';
import {MessageProps} from '@nlux-dev/core/src/ui/Message/props';
import {updateMessageDom} from '@nlux-dev/core/src/ui/Message/update';
import {describe, expect, it} from 'vitest';

describe('When a message component is rendered and is in rendered status', () => {
    describe('without any message or status', () => {
        it('should render an empty message in rendered status', () => {
            // Given
            const dom = createMessageDom({} as any);

            // When
            const html = dom.outerHTML;

            // Then
            expect(html).toBe('<div class="nlux_comp_msg nlux_msg_rendered"></div>');
        });
    });

    describe('with a message', () => {
        it('should render the message', () => {
            // Given
            const dom = createMessageDom({
                direction: 'incoming', status: 'rendered', message: 'Hello, World!',
            });

            // When
            const html = dom.outerHTML;

            // Then
            expect(html).toBe('<div class="nlux_comp_msg nlux_msg_rendered nlux_msg_incoming">Hello, World!</div>');
        });
    });

    describe('when HTML is provided in message body', () => {
        it('should be escaped', () => {
            // Given
            const props: MessageProps = {
                direction: 'incoming', status: 'rendered', message: '<strong>Hello, World!</strong>',
            };
            const dom = createMessageDom(props);

            // When
            const html = dom.outerHTML;

            // Then
            expect(html).toBe(
                '<div class="nlux_comp_msg nlux_msg_rendered nlux_msg_incoming">&lt;strong&gt;Hello, World!&lt;/strong&gt;</div>');
        });
    });

    describe.todo('When markdown is provided in message body', () => {
        it.todo('should be rendered as HTML');
    });

    describe('When message is updated', () => {
        it('should update the message', () => {
            // Given
            const beforeProps: MessageProps = {direction: 'incoming', status: 'rendered', message: 'Hello, World!'};
            const props: MessageProps = {direction: 'incoming', status: 'rendered', message: 'Goodbye, World!'};
            const dom = createMessageDom(beforeProps);

            // When
            updateMessageDom(dom, beforeProps, props);

            // Then
            expect(dom.outerHTML).toBe(
                '<div class="nlux_comp_msg nlux_msg_rendered nlux_msg_incoming">Goodbye, World!</div>',
            );
        });

        it('should escape HTML in the new message', () => {
            // Given
            const beforeProps: MessageProps = {direction: 'incoming', status: 'rendered', message: 'Hello, World!'};
            const dom = createMessageDom(beforeProps);

            // When
            updateMessageDom(
                dom,
                beforeProps,
                {direction: 'incoming', status: 'rendered', message: '<strong>Goodbye, World!</strong>'},
            );

            // Then
            expect(dom.outerHTML).toBe(
                '<div class="nlux_comp_msg nlux_msg_rendered nlux_msg_incoming">&lt;strong&gt;Goodbye, World!&lt;/strong&gt;</div>',
            );
        });
    });

    describe('When message is updated with the same message', () => {
        it('should not update the message', () => {
            // Given
            const props: MessageProps = {direction: 'incoming', status: 'rendered', message: 'Hello, World!'};
            const dom = createMessageDom(props);

            // When
            updateMessageDom(dom, props, props);

            // Then
            expect(dom.outerHTML).toBe(
                '<div class="nlux_comp_msg nlux_msg_rendered nlux_msg_incoming">Hello, World!</div>');
        });
    });

    describe('When message is updated with the same message and status', () => {
        it('should not update the message', () => {
            // Given
            const props: MessageProps = {direction: 'incoming', status: 'rendered', message: 'Hello, World!'};
            const dom = createMessageDom(props);

            // When
            updateMessageDom(dom, props, {...props});

            // Then
            expect(dom.outerHTML).toBe(
                '<div class="nlux_comp_msg nlux_msg_rendered nlux_msg_incoming">Hello, World!</div>');
        });
    });

    describe('When message is updated with the same status', () => {
        it('should not update the message', () => {
            // Given
            const props: MessageProps = {direction: 'incoming', status: 'rendered', message: 'Hello, World!'};
            const dom = createMessageDom(props);

            // When
            updateMessageDom(dom, props, {direction: 'incoming', status: 'rendered', message: 'Hello, World!'});

            // Then
            expect(dom.outerHTML).toBe(
                '<div class="nlux_comp_msg nlux_msg_rendered nlux_msg_incoming">Hello, World!</div>');
        });
    });

    describe('When the status changes to loading', () => {
        it('should remove the message, update class name, and render default loader', () => {
            // Given
            const initialProps: MessageProps = {direction: 'incoming', status: 'rendered', message: 'Hello, World!'};
            const newProps: MessageProps = {direction: 'incoming', status: 'loading'};
            const dom = createMessageDom(initialProps);

            // When
            const beforeHtml = dom.outerHTML;
            updateMessageDom(dom, initialProps, newProps);
            const afterHtml = dom.outerHTML;

            // Then
            expect(beforeHtml).toBe(
                '<div class="nlux_comp_msg nlux_msg_rendered nlux_msg_incoming">Hello, World!</div>',
            );
            expect(afterHtml).toBe(
                '<div class="nlux_comp_msg nlux_msg_incoming nlux_msg_loading"><div class="nlux_msg_ldr">' +
                '<div class="spn_ldr_ctn"><span class="spn_ldr"></span></div></div></div>',
            );
        });

        describe('When the status changes back to rendered', () => {
            it('should remove the loader and render the message', () => {
                // Given
                const initialProps: MessageProps = {
                    direction: 'incoming',
                    status: 'rendered',
                    message: 'Hello, World!',
                };
                const newProps1: MessageProps = {direction: 'incoming', status: 'loading', message: 'Hello, World!'};
                const newProps2: MessageProps = {direction: 'incoming', status: 'rendered', message: 'Hello, World!'};
                const dom = createMessageDom(initialProps);

                // When
                updateMessageDom(dom, initialProps, newProps1);

                // Then
                expect(dom.outerHTML).toBe(
                    '<div class="nlux_comp_msg nlux_msg_incoming nlux_msg_loading"><div class="nlux_msg_ldr">' +
                    '<div class="spn_ldr_ctn"><span class="spn_ldr"></span></div></div></div>');

                // When
                updateMessageDom(dom, newProps1, newProps2);

                // Then
                expect(dom.outerHTML).toBe(
                    '<div class="nlux_comp_msg nlux_msg_incoming nlux_msg_rendered">Hello, World!</div>');
            });
        });
    });
});
