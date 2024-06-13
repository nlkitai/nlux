import {AiChat, useStreamAdapter} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';
import {waitForReactRenderCycle} from '../../../utils/wait';

describe('<AiChat /> + submit prompt + useStreamAdapter', () => {
    describe('When a prompt is submitted with an adapter created via useStreamAdapter', () => {
        it('The submit function should be called with the prompt, observable, and an object', async () => {
            // Arrange
            const submit = vi.fn();
            const AiChatWithHookAdapter = () => {
                const adapter = useStreamAdapter(submit);
                return <AiChat adapter={adapter}/>;
            };

            const {container} = render(<AiChatWithHookAdapter/>);

            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Assert
            expect(submit).toHaveBeenCalledWith(
                'Hello',
                expect.objectContaining({
                    next: expect.any(Function),
                    error: expect.any(Function),
                    complete: expect.any(Function),
                }),
                expect.objectContaining({}),
            );
        });
    });
});
