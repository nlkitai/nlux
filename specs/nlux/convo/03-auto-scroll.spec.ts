import {createConvo, NluxConvo} from '@nlux/nlux';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {createPromiseAdapterController, PromiseAdapterController} from '../../utils/adapters';
import {queries} from '../../utils/selectors';
import {waitForMdStreamToComplete, waitForRenderCycle} from '../../utils/wait';

describe('When the create a Convo box with default auto-scroll enabled', () => {
    let adapterController: PromiseAdapterController | undefined = undefined;

    let rootElement: HTMLElement | undefined;
    let nluxConvo: NluxConvo | undefined;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        adapterController = undefined;

        nluxConvo?.unmount();
        rootElement?.remove();
        nluxConvo = undefined;
        rootElement = undefined;
    });

    describe('When the user added a long message that exceeds displayed area', () => {
        it.skip('should scroll to the bottom', async () => {
            adapterController = createPromiseAdapterController();
            nluxConvo = createConvo().withAdapter(adapterController.adapter);
            nluxConvo.mount(rootElement);

            nluxConvo = new NluxConvo()
                .withAdapter(adapterController.adapter)
                .withLayoutOptions({maxHeight: '300px'})
                .withConversationOptions({scrollWhenGenerating: true});

            nluxConvo.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput();
            const sendButton: any = queries.promptBoxSendButton();

            await userEvent.type(textInput, 'Hello\n\n\n\n\nLLM!');
            await waitForRenderCycle();

            await userEvent.click(sendButton);
            await waitForMdStreamToComplete();

            expect(queries.conversationMessagesContainer()).toContainHTML('Hello<br /><br /><br /><br /><br />LLM!');

            adapterController.resolve('Hi\n\n\n\n\nLLM!');
            await waitForMdStreamToComplete(50);

            const scrollHeight = queries.conversationMessagesContainer().scrollHeight;
            const clientHeight = queries.conversationMessagesContainer().clientHeight;
            expect(scrollHeight).toBeGreaterThan(clientHeight);
        });
    });
});
