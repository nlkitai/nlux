import {describe, expect, it} from 'vitest';
import {createMessageDom} from '../../../../../packages/shared/src/ui/Message/create';
import {MessageProps} from '../../../../../packages/shared/src/ui/Message/props';
import {updateMessageDom} from '../../../../../packages/shared/src/ui/Message/update';

describe('When a message component is rendered', () => {
    describe('When the direction is set to incoming', () => {
        it('Should render the message with the incoming class', () => {
            // Arrange
            const props: MessageProps = {
                direction: 'incoming',
                status: 'rendered',
                message: 'Hello, World!',
            };

            // Act
            const message = createMessageDom(props);

            // Assert
            expect(message.classList.contains('nlux_msg_incoming')).toBe(true);
        });

        describe('When the direction changes to outgoing', () => {
            it('Should render the message with the outgoing class', () => {
                // Arrange
                const props: MessageProps = {
                    direction: 'incoming',
                    status: 'rendered',
                    message: 'Hello, World!',
                };
                const message = createMessageDom(props);

                // Act
                const newProps: MessageProps = {
                    ...props,
                    direction: 'outgoing',
                };

                updateMessageDom(message, props, newProps);

                // Assert
                expect(message.classList.contains('nlux_msg_incoming')).toBe(false);
                expect(message.classList.contains('nlux_msg_outgoing')).toBe(true);
            });
        });
    });

    describe('When the direction is set to outgoing', () => {
        it('Should render the message with the outgoing class', () => {
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

        describe('When the direction changes to incoming', () => {
            it('Should render the message with the incoming class', () => {
                // Arrange
                const props: MessageProps = {
                    direction: 'outgoing',
                    status: 'rendered',
                    message: 'Hello, World!',
                };
                const message = createMessageDom(props);

                // Act
                const newProps: MessageProps = {
                    ...props,
                    direction: 'incoming',
                };

                updateMessageDom(message, props, newProps);

                // Assert
                expect(message.classList.contains('nlux_msg_outgoing')).toBe(false);
                expect(message.classList.contains('nlux_msg_incoming')).toBe(true);
            });
        });
    });
});