import {createMessageDom} from '@nlux-dev/core/src/ui/Message/create';
import {MessageProps} from '@nlux-dev/core/src/ui/Message/props';
import {updateMessageDom} from '@nlux-dev/core/src/ui/Message/update';
import {describe, expect, it} from 'vitest';

describe('When a message component is rendered and is in loading status', () => {
    describe('with default loader', () => {
        it('should render default loader', () => {
            // Given
            const dom = createMessageDom({direction: 'incoming', status: 'loading'});

            // When
            const html = dom.outerHTML;

            // Then
            expect(html).toBe(
                '<div class="nlux_comp_msg nlux_msg_loading nlux_msg_incoming"><div class="nlux_msg_ldr">' +
                '<div class="spn_ldr_ctn"><span class="spn_ldr"></span></div></div></div>',
            );
        });
    });

    describe('with a custom loader', () => {
        it('should render the custom loader', () => {
            // Given
            const customLoader = document.createElement('span');
            customLoader.classList.add('custom-loader');
            customLoader.append('Loading...');
            const dom = createMessageDom({direction: 'incoming', status: 'loading', loader: customLoader});

            // When
            const html = dom.outerHTML;

            // Then
            expect(html).toBe(
                '<div class="nlux_comp_msg nlux_msg_loading nlux_msg_incoming"><span class="custom-loader">Loading...</span></div>',
            );
        });
    });

    describe('when loader is updated', () => {
        it('should replace the loader', () => {
            // Given
            const beforeProps: MessageProps = {direction: 'incoming', status: 'loading'};
            const customLoader = document.createElement('span');
            customLoader.classList.add('custom-loader');
            customLoader.append('Loading...');
            const props: MessageProps = {direction: 'incoming', status: 'loading', loader: customLoader};
            const dom = createMessageDom(beforeProps);

            // When
            updateMessageDom(dom, beforeProps, props);

            // Then
            expect(dom.outerHTML).toBe(
                '<div class="nlux_comp_msg nlux_msg_loading nlux_msg_incoming"><span class="custom-loader">Loading...</span></div>',
            );
        });
    });

    describe('when status is updated to rendered', () => {
        it('should remove the loader', () => {
            // Given
            const beforeProps: MessageProps = {direction: 'incoming', status: 'loading'};
            const props: MessageProps = {direction: 'incoming', status: 'rendered'};
            const dom = createMessageDom(beforeProps);

            // When
            updateMessageDom(dom, beforeProps, props);

            // Then
            expect(dom.outerHTML).toBe('<div class="nlux_comp_msg nlux_msg_incoming nlux_msg_rendered"></div>');
        });

        it('should render the message', () => {
            // Given
            const beforeProps: MessageProps = {direction: 'incoming', status: 'loading'};
            const props: MessageProps = {direction: 'incoming', status: 'rendered', message: 'Hello, World!'};
            const dom = createMessageDom(beforeProps);

            // When
            updateMessageDom(dom, beforeProps, props);

            // Then
            expect(dom.outerHTML).toBe(
                '<div class="nlux_comp_msg nlux_msg_incoming nlux_msg_rendered">Hello, World!</div>');
        });
    });

    describe('when status is updated to streaming', () => {
        it('should hide the loader', () => {
            // Given
            const beforeProps: MessageProps = {direction: 'incoming', status: 'loading'};
            const props: MessageProps = {direction: 'incoming', status: 'streaming'};
            const dom = createMessageDom(beforeProps);

            // When
            updateMessageDom(dom, beforeProps, props);

            // Then
            expect(dom.outerHTML).toBe('<div class="nlux_comp_msg nlux_msg_incoming nlux_msg_streaming"></div>');
        });

        it('should not render the message', () => {
            // Given
            const beforeProps: MessageProps = {direction: 'incoming', status: 'loading'};
            const props: MessageProps = {direction: 'incoming', status: 'streaming', message: 'Hello, World!'};
            const dom = createMessageDom(beforeProps);

            // When
            updateMessageDom(dom, beforeProps, props);

            // Then
            expect(dom.outerHTML).toBe('<div class="nlux_comp_msg nlux_msg_incoming nlux_msg_streaming"></div>');
        });
    });
});
