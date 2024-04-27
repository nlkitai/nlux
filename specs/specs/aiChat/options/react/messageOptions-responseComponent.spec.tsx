import {AiChat, ResponseComponent} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + messageOptions + responseComponent', () => {
    let adapterController: AdapterController | undefined = undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withFetchText(true)
            .withStreamText(false)
            .create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When a response component is used in fetch mode', () => {
        it('Should render the custom component', async () => {
            // Arrange
            const CustomResponseComponent: ResponseComponent<string> = ({response}) => (
                <div>The AI response is: {response}</div>
            );

            const {container} = render(
                <AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{responseComponent: CustomResponseComponent}}
                />,
            );
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await waitForRenderCycle();

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            adapterController!.resolve('Yo!');
            await waitForRenderCycle();

            // Assert
            const responseElement = container.querySelector('.nlux_cht_itm_in');
            expect(responseElement!.innerHTML).toEqual(
                expect.stringContaining('<div>The AI response is: Yo!</div>'),
            );
        });
    });
});
