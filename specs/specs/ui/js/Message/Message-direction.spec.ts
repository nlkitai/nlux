import {describe, expect, it} from 'vitest';
import {createMessageDom} from '../../../../../packages/shared/src/ui/Message/create';
import {MessageProps} from '../../../../../packages/shared/src/ui/Message/props';
import {updateMessageDom} from '../../../../../packages/shared/src/ui/Message/update';

describe('When a message component is complete', () => {
    describe('When the direction is set to received', () => {
        it('Should render the message with the received class', () => {
            // Arrange
            const props: MessageProps = {
                direction: 'received',
                status: 'complete',
                message: 'Hello, World!',
            };

            // Act
            const message = createMessageDom(props);

            // Assert
            expect(message.classList.contains('nlux_msg_received')).toBe(true);
        });

        describe('When the direction changes to sent', () => {
            it('Should render the message with the sent class', () => {
                // Arrange
                const props: MessageProps = {
                    direction: 'received',
                    status: 'complete',
                    message: 'Hello, World!',
                };
                const message = createMessageDom(props);

                // Act
                const newProps: MessageProps = {
                    ...props,
                    direction: 'sent',
                };

                updateMessageDom(message, props, newProps);

                // Assert
                expect(message.classList.contains('nlux_msg_received')).toBe(false);
                expect(message.classList.contains('nlux_msg_sent')).toBe(true);
            });
        });
    });

    describe('When the direction is set to sent', () => {
        it('Should render the message with the sent class', () => {
            const container = document.createElement('div');
            const props: MessageProps = {
                direction: 'sent',
                status: 'complete',
                message: 'Hello, World!',
            };

            const message = createMessageDom(props);
            container.append(message);

            expect(message.classList.contains('nlux_msg_sent')).toBe(true);
        });

        describe('When the direction changes to received', () => {
            it('Should render the message with the received class', () => {
                // Arrange
                const props: MessageProps = {
                    direction: 'sent',
                    status: 'complete',
                    message: 'Hello, World!',
                };
                const message = createMessageDom(props);

                // Act
                const newProps: MessageProps = {
                    ...props,
                    direction: 'received',
                };

                updateMessageDom(message, props, newProps);

                // Assert
                expect(message.classList.contains('nlux_msg_sent')).toBe(false);
                expect(message.classList.contains('nlux_msg_received')).toBe(true);
            });
        });
    });
});