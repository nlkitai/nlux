import {AdapterBuilder, createNluxConvo, NluxConvo} from '@nlux/nlux';
import {createAdapter} from '@nlux/openai';
import '@testing-library/jest-dom';
import {queries} from '../../utils/selectors';
import {waitForRenderCycle} from '../../utils/wait';

const apiKey = 'YOUR_API_KEY_HERE';

describe('On NluxConvo is mounted without options', () => {
    const adapter: AdapterBuilder<any, any> = createAdapter('openai/gpt').withApiKey(apiKey);

    let rootElement: HTMLElement | undefined;
    let nluxConvo: NluxConvo | undefined;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        nluxConvo?.unmount();
        rootElement?.remove();
        nluxConvo = undefined;
        rootElement = undefined;
    });

    describe('Prompt Box', () => {
        it('should render', async () => {
            nluxConvo = createNluxConvo().withAdapter(adapter);
            nluxConvo.mount(rootElement);
            await waitForRenderCycle();
            expect(queries.promptBoxContainer()).toBeInTheDocument();
        });

        it('should render text box for prompt input', async () => {
            nluxConvo = createNluxConvo().withAdapter(adapter);
            nluxConvo.mount(rootElement);
            await waitForRenderCycle();
            expect(queries.promptBoxTextInput()).toBeInTheDocument();
        });

        it('should render button to submit prompt', async () => {
            nluxConvo = createNluxConvo().withAdapter(adapter);
            nluxConvo.mount(rootElement);
            await waitForRenderCycle();
            expect(queries.promptBoxSendButton()).toBeInTheDocument();
        });

        describe('Text Input', () => {
            it('should be enabled', async () => {
                nluxConvo = createNluxConvo().withAdapter(adapter);
                nluxConvo.mount(rootElement);
                await waitForRenderCycle();
                expect(queries.promptBoxTextInput()).not.toBeDisabled();
            });

            it('should be empty', async () => {
                nluxConvo = createNluxConvo().withAdapter(adapter);
                nluxConvo.mount(rootElement);
                await waitForRenderCycle();
                expect(queries.promptBoxTextInput()).toHaveValue('');
            });

            it('should not be focused', async () => {
                nluxConvo = createNluxConvo().withAdapter(adapter);
                nluxConvo.mount(rootElement);
                await waitForRenderCycle();
                expect(queries.promptBoxTextInput()).not.toHaveFocus();
            });
        });

        describe('Submit Button', () => {
            it('should be disabled', async () => {
                nluxConvo = createNluxConvo().withAdapter(adapter);
                nluxConvo.mount(rootElement);
                await waitForRenderCycle();
                expect(queries.promptBoxTextInput()).not.toBeDisabled();
            });
        });
    });
});
