import {createMessageDom} from '@nlux-dev/core/src/comp/Message/create';
import {MessageProps} from '@nlux-dev/core/src/comp/Message/props';
import {updateMessageDom} from '@nlux-dev/core/src/comp/Message/update';
import {describe, expect, it} from 'vitest';

describe('When a message component is rendered', () => {
    describe('and the direction is set to incoming', () => {
        it('should render the message with the incoming class', () => {
            // Given
            const props: MessageProps = {
                direction: 'incoming',
                status: 'rendered',
                message: 'Hello, World!',
            };

            // When
            const message = createMessageDom(props);

            // Then
            expect(message.classList.contains('nlux_msg_incoming')).toBe(true);
        });

        describe('when the direction changes to outgoing', () => {
            it('should render the message with the outgoing class', () => {
                // Given
                const props: MessageProps = {
                    direction: 'incoming',
                    status: 'rendered',
                    message: 'Hello, World!',
                };
                const message = createMessageDom(props);

                // When
                const newProps: MessageProps = {
                    ...props,
                    direction: 'outgoing',
                };

                updateMessageDom(message, props, newProps);

                // Then
                expect(message.classList.contains('nlux_msg_incoming')).toBe(false);
                expect(message.classList.contains('nlux_msg_outgoing')).toBe(true);
            });
        });
    });

    describe('and the direction is set to outgoing', () => {
        it('should render the message with the outgoing class', () => {
            const container = document.createElement('div');
            const props: MessageProps = {
                direction: 'outgoing',
                status: 'rendered',
                message: 'Hello, World!',
            };

            const message = createMessageDom(props);
            container.append(message);

            expect(message.classList.contains('nlux_msg_outgoing')).toBe(true);
        });

        describe('when the direction changes to incoming', () => {
            it('should render the message with the incoming class', () => {
                // Given
                const props: MessageProps = {
                    direction: 'outgoing',
                    status: 'rendered',
                    message: 'Hello, World!',
                };
                const message = createMessageDom(props);

                // When
                const newProps: MessageProps = {
                    ...props,
                    direction: 'incoming',
                };

                updateMessageDom(message, props, newProps);

                // Then
                expect(message.classList.contains('nlux_msg_outgoing')).toBe(false);
                expect(message.classList.contains('nlux_msg_incoming')).toBe(true);
            });
        });
    });
});