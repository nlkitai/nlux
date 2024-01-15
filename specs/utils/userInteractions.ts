import userEvent from '@testing-library/user-event';
import {queries} from './selectors';
import {waitForRenderCycle} from './wait';

export const type = async (text: string) => {
    await waitForRenderCycle();
    const textInput = queries.promptBoxTextInput() as Element;
    await userEvent.type(textInput, text);
    await waitForRenderCycle();
};

export const submit = async () => {
    await waitForRenderCycle();
    const sendButton = queries.promptBoxSendButton() as Element;
    await userEvent.click(sendButton);
    await waitForRenderCycle();
};
