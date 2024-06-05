import {AiChat, BatchResponseComponentProps} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import {FC} from 'react';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../utils/wait';

describe('<AiChat /> + responseRenderer + initialConversation', () => {
    let adapterController: AdapterController | undefined = undefined;

    describe('When a response renderer is used with initial conversation', () => {
        beforeEach(() => {
            adapterController = adapterBuilder()
                .withBatchText(true)
                .withStreamText(false)
                .create();
        });

        afterEach(() => {
            adapterController = undefined;
        });

        it('Should render the custom component for the initial conversation messages', async () => {
            // Arrange
            const CustomResponseComponent: FC<BatchResponseComponentProps<string>> = ({content}) => (
                <div>The AI response is: {content}</div>
            );


            // Act
            const {container} = render(
                <AiChat
                    adapter={adapterController!.adapter}
                    initialConversation={[
                        {role: 'user', message: 'Hello'},
                        {role: 'assistant', message: 'Hi. How can I help you?'},
                    ]}
                    messageOptions={{
                        responseRenderer: CustomResponseComponent,
                    }}
                />,
            );
            await waitForReactRenderCycle();

            // Assert
            const responseElement = container.querySelector('.nlux-comp-chatItem--received');
            expect(responseElement!.innerHTML).toEqual(
                expect.stringContaining('<div>The AI response is: Hi. How can I help you?</div>'),
            );
        });
    });
});
