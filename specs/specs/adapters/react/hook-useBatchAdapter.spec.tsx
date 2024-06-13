import {AiChat, useBatchAdapter} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';
import {waitForReactRenderCycle} from '../../../utils/wait';

describe('<AiChat /> + submit prompt + useBatchAdapter', () => {
    describe('When a prompt is submitted with an adapter created via useBatchAdapter', () => {
        it('The submit function should be called with the prompt and an object', async () => {
            // Arrange
            const submit = vi.fn();
            const AiChatWithHookAdapter = () => {
                const adapter = useBatchAdapter(submit);
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
                expect.objectContaining({}),
            );
        });
    });
});
