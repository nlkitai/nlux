import {describe, expect, it} from 'vitest';
import {createMessageDom} from '../../../../../packages/shared/src/ui/Message/create';
import {MessageProps} from '../../../../../packages/shared/src/ui/Message/props';
import {updateMessageDom} from '../../../../../packages/shared/src/ui/Message/update';

describe('When a message component is rendered and is in loading status', () => {
    describe('With default loader', () => {
        it('Should render default loader', () => {
            // Arrange
            const dom = createMessageDom({direction: 'incoming', status: 'loading'});

            // Act
            const html = dom.outerHTML;

            // Assert
            expect(html).toBe(
                '<div class="nlux-comp-msg nlux_msg_loading nlux_msg_incoming"><div class="nlux_msg_ldr">' +
                '<div class="spn_ldr_ctn"><span class="spn_ldr"></span></div></div></div>',
            );
        });
    });

    describe('With a custom loader', () => {
        it('Should render the custom loader', () => {
            // Arrange
            const customLoader = document.createElement('span');
            customLoader.classList.add('custom-loader');
            customLoader.append('Loading...');
            const dom = createMessageDom({direction: 'incoming', status: 'loading', loader: customLoader});

            // Act
            const html = dom.outerHTML;

            // Assert
            expect(html).toBe(
                '<div class="nlux-comp-msg nlux_msg_loading nlux_msg_incoming"><span class="custom-loader">Loading...</span></div>',
            );
        });
    });

    describe('When loader is updated', () => {
        it('Should replace the loader', () => {
            // Arrange
            const beforeProps: MessageProps = {direction: 'incoming', status: 'loading'};
            const customLoader = document.createElement('span');
            customLoader.classList.add('custom-loader');
            customLoader.append('Loading...');
            const props: MessageProps = {direction: 'incoming', status: 'loading', loader: customLoader};
            const dom = createMessageDom(beforeProps);

            // Act
            updateMessageDom(dom, beforeProps, props);

            // Assert
            expect(dom.outerHTML).toBe(
                '<div class="nlux-comp-msg nlux_msg_loading nlux_msg_incoming"><span class="custom-loader">Loading...</span></div>',
            );
        });
    });

    describe('When status is updated to rendered', () => {
        it('Should remove the loader', () => {
            // Arrange
            const beforeProps: MessageProps = {direction: 'incoming', status: 'loading'};
            const props: MessageProps = {direction: 'incoming', status: 'rendered'};
            const dom = createMessageDom(beforeProps);

            // Act
            updateMessageDom(dom, beforeProps, props);

            // Assert
            expect(dom.outerHTML).toBe('<div class="nlux-comp-msg nlux_msg_incoming nlux_msg_rendered"></div>');
        });

        it('Should render the message', () => {
            // Arrange
            const beforeProps: MessageProps = {direction: 'incoming', status: 'loading'};
            const props: MessageProps = {direction: 'incoming', status: 'rendered', message: 'Hello, World!'};
            const dom = createMessageDom(beforeProps);

            // Act
            updateMessageDom(dom, beforeProps, props);

            // Assert
            expect(dom.outerHTML).toBe(
                '<div class="nlux-comp-msg nlux_msg_incoming nlux_msg_rendered">Hello, World!</div>');
        });
    });

    describe('When status is updated to streaming', () => {
        it('Should hide the loader', () => {
            // Arrange
            const beforeProps: MessageProps = {direction: 'incoming', status: 'loading'};
            const props: MessageProps = {direction: 'incoming', status: 'streaming'};
            const dom = createMessageDom(beforeProps);

            // Act
            updateMessageDom(dom, beforeProps, props);

            // Assert
            expect(dom.outerHTML).toBe('<div class="nlux-comp-msg nlux_msg_incoming nlux_msg_streaming"></div>');
        });

        it('Should not render the message', () => {
            // Arrange
            const beforeProps: MessageProps = {direction: 'incoming', status: 'loading'};
            const props: MessageProps = {direction: 'incoming', status: 'streaming', message: 'Hello, World!'};
            const dom = createMessageDom(beforeProps);

            // Act
            updateMessageDom(dom, beforeProps, props);

            // Assert
            expect(dom.outerHTML).toBe('<div class="nlux-comp-msg nlux_msg_incoming nlux_msg_streaming"></div>');
        });
    });
});
