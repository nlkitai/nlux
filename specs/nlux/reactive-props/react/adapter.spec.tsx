import {AiChat} from '@nlux/react';
import {act, render} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {queries} from '../../../utils/selectors';
import {submit, type} from '../../../utils/userInteractions';
import {
    delayBeforeSendingResponse,
    shortDelayBeforeSendingResponse,
    waitForMilliseconds,
    waitForRenderCycle,
} from '../../../utils/wait';

describe('When the adapter is used with a React component', () => {
    let adapterController: AdapterController;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    it('should render the component', async () => {
        const component = <AiChat
            adapter={adapterController.adapter}
        />;

        render(component);
        await waitForRenderCycle();

        expect(queries.promptBoxTextInput()).toBeDefined();
    });

    it('should use the provided adapter', async () => {
        const component = <AiChat
            adapter={adapterController.adapter}
        />;

        render(component);
        await waitForRenderCycle();

        await type('Hello');
        await submit();

        adapterController.resolve('Yo!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(queries.conversationMessagesContainer()).toHaveTextContent('Yo!');
    });

    it('should handle adapter updates and use the latest adapter provided', async () => {
        const adapterController2 = adapterBuilder().withFetchText().create();

        // Initial render
        const component = <AiChat adapter={adapterController.adapter}/>;
        const {rerender} = render(component);
        await waitForRenderCycle();

        await type('Hello');
        await submit();

        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        adapterController.resolve('Yo!');
        await waitForMilliseconds(shortDelayBeforeSendingResponse);

        expect(queries.conversationMessagesContainer()).toHaveTextContent('Yo!');
        expect(adapterController.fetchTextMock).toHaveBeenCalledTimes(1);
        expect(adapterController2.fetchTextMock).toHaveBeenCalledTimes(0);

        // Update the adapter
        await act(async () => rerender(<AiChat adapter={adapterController2.adapter}/>));
        await waitForRenderCycle();

        await type('Hello2');
        await waitForRenderCycle();

        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        adapterController2.resolve('Yo2!');
        await waitForMilliseconds(delayBeforeSendingResponse);
        expect(queries.conversationMessagesContainer()).toHaveTextContent('Yo2!');

        expect(adapterController.fetchTextMock).toHaveBeenCalledTimes(1);
        expect(adapterController2.fetchTextMock).toHaveBeenCalledTimes(1);
    });
});
