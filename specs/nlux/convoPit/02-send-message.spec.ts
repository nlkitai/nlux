import {AdapterBuilder, ConvoPit, createConvoPit} from '@nlux/nlux';
import {createAdapter} from '@nlux/openai';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {queryBuilder} from '../../utils/query';
import {waitForRenderCycle} from '../../utils/wait';

const apiKey = 'YOUR_API_KEY_HERE';

describe('When sending a chat message ', () => {
    const adapter: AdapterBuilder<any, any> = createAdapter('openai/gpt')
        .withApiKey(apiKey)
        .useFetchingMode();

    const queryChatRoom = queryBuilder('> .nluxc-chat-room-container').query;
    const queryExceptionsBox = queryBuilder('> .nluxc-exceptions-box-container').query;
    const queryPromptBox = queryBuilder(
        '> .nluxc-chat-room-container > .nluxc-chat-room-prompt-box-container > .nluxc-prompt-box-container').query;

    let rootElement: HTMLElement | undefined;
    let convoPit: ConvoPit | undefined;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        convoPit?.unmount();
        rootElement?.remove();
        convoPit = undefined;
        rootElement = undefined;
    });

    describe('When using invalid API key', () => {
        it('should render error message', async () => {
            convoPit = createConvoPit().withAdapter(adapter);
            convoPit.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queryPromptBox('> textarea.nluxc-textarea.nluxc-prompt-box-text-input') as any;
            const sendButton: any = queryPromptBox('> button.bt-primary-filled.nluxc-prompt-box-send-button');

            await userEvent.type(textInput, 'Hello');
            await waitForRenderCycle();

            expect(textInput.value).toBe('Hello');
            expect(sendButton).not.toBeDisabled();

            userEvent.click(sendButton);
            await waitForRenderCycle();

            expect(queryExceptionsBox('> .nluxc-exceptions-box-exception > .nluxc-exceptions-box-message').innerHTML)
                .toBe('Failed to load content. Please try again.');
        });
    });
});
