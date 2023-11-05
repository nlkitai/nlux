import '@testing-library/jest-dom';
import {AdapterBuilder, ConvoPit, createConvoPit} from '@nlux/nlux';
import {createAdapter} from '@nlux/openai';
import {queryBuilder} from '../../utils/query';
import {waitForRenderCycle} from '../../utils/wait';

const apiKey = 'YOUR_API_KEY_HERE';

describe('On ConvoPit is mounted without options', () => {
    const adapter: AdapterBuilder<any, any> = createAdapter('openai/gpt').withApiKey(apiKey);
    const queryChatRoom = queryBuilder('> .nluxc-chat-room-container').query;
    const queryPromptBox = queryBuilder('> .nluxc-chat-room-container > .nluxc-chat-room-prompt-box-container > .nluxc-prompt-box-container').query;

    let rootElement: HTMLElement | undefined;
    let convoPit: ConvoPit | undefined;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        convoPit?.unmount(); rootElement?.remove();
        convoPit = undefined; rootElement = undefined;
    });

    describe('Prompt Box', () => {
        it('should render', async () => {
            convoPit = createConvoPit().withAdapter(adapter);
            convoPit.mount(rootElement);
            await waitForRenderCycle();
            expect(queryPromptBox()).toBeInTheDocument();
        });

        it ('should render text box for prompt input', async () => {
            convoPit = createConvoPit().withAdapter(adapter);
            convoPit.mount(rootElement);
            await waitForRenderCycle();
            expect(queryPromptBox('> textarea.nluxc-textarea.nluxc-prompt-box-text-input')).toBeInTheDocument();
        });

        it ('should render button to submit prompt', async () => {
            convoPit = createConvoPit().withAdapter(adapter);
            convoPit.mount(rootElement);
            await waitForRenderCycle();
            expect(queryPromptBox('> button.bt-primary-filled.nluxc-prompt-box-send-button')).toBeInTheDocument();
        });

        describe('Text Input', () => {
            it('should be enabled', async () => {
                convoPit = createConvoPit().withAdapter(adapter);
                convoPit.mount(rootElement);
                await waitForRenderCycle();
                const textInput = queryPromptBox('> textarea.nluxc-textarea.nluxc-prompt-box-text-input');
                expect(textInput).not.toBeDisabled();
            });

            it('should be empty', async () => {
                convoPit = createConvoPit().withAdapter(adapter);
                convoPit.mount(rootElement);
                await waitForRenderCycle();
                const textInput = queryPromptBox('> textarea.nluxc-textarea.nluxc-prompt-box-text-input');
                expect(textInput).toHaveValue('');
            });

            it('should not be focused', async () => {
                convoPit = createConvoPit().withAdapter(adapter);
                convoPit.mount(rootElement);
                await waitForRenderCycle();
                const textInput = queryPromptBox('> textarea.nluxc-textarea.nluxc-prompt-box-text-input');
                expect(textInput).not.toHaveFocus();
            });
        });

        describe('Submit Button', () => {
            it('should be disabled', async () => {
                convoPit = createConvoPit().withAdapter(adapter);
                convoPit.mount(rootElement);
                await waitForRenderCycle();
                const submitButton = queryPromptBox('> button.bt-primary-filled.nluxc-prompt-box-send-button');
                expect(submitButton).toBeDisabled();
            });
        });
    });
});
