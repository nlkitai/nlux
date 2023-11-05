import {AdapterBuilder, ConvoPit, createConvoPit} from '@nlux/nlux';
import {createAdapter} from '@nlux/openai';
import '@testing-library/jest-dom';
import {queryBuilder} from '../../utils/query';
import {waitForRenderCycle} from '../../utils/wait';

const apiKey = 'YOUR_API_KEY_HERE';

describe('On ConvoPit initial load', () => {
    const adapter: AdapterBuilder<any, any> = createAdapter('openai/gpt').withApiKey(apiKey);
    const queryChatRoom = queryBuilder('> .nluxc-chat-room-container').query;
    const queryPromptBox = queryBuilder(
        '> .nluxc-chat-room-container > .nluxc-chat-room-prompt-box-container > .nluxc-prompt-box-container').query;
    const queryExceptionsBox = queryBuilder('> .nluxc-exceptions-box-container').query;

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

    it('should not initially render anything is DOM', async () => {
        convoPit = createConvoPit().withAdapter(adapter);
        await waitForRenderCycle();
        expect(rootElement?.innerHTML).toBe('');
    });

    describe('When mount() is called', () => {
        it('chat room container should render', async () => {
            convoPit = createConvoPit().withAdapter(adapter);

            convoPit.mount(rootElement);
            await waitForRenderCycle();

            expect(queryChatRoom()).toBeInTheDocument();
        });

        it('exceptions box container should render', async () => {
            convoPit = createConvoPit().withAdapter(adapter);
            convoPit.mount(rootElement);
            await waitForRenderCycle();

            expect(queryExceptionsBox()).toBeInTheDocument();
        });

        it('prompt box container should render', async () => {
            convoPit = createConvoPit().withAdapter(adapter);
            convoPit.mount(rootElement);
            await waitForRenderCycle();

            expect(queryChatRoom('> .nluxc-chat-room-prompt-box-container'))
                .toBeInTheDocument();
        });

        it('conversation container should render', async () => {
            convoPit = createConvoPit().withAdapter(adapter);
            convoPit.mount(rootElement);
            await waitForRenderCycle();

            expect(queryChatRoom('> .nluxc-chat-room-conversation-container'))
                .toBeInTheDocument();
        });
    });

    describe('When mount() is called twice', () => {
        it('should throw an error', async () => {
            convoPit = createConvoPit().withAdapter(adapter);
            convoPit.mount(rootElement);
            await waitForRenderCycle();

            expect(() => convoPit?.mount(rootElement)).toThrowError();
        });

        it('should not render anything new in DOM', async () => {
            convoPit = createConvoPit().withAdapter(adapter);
            convoPit.mount(rootElement);
            await waitForRenderCycle();

            const initialHtmlRendered = rootElement?.innerHTML;

            try {
                convoPit.mount(rootElement);
                await waitForRenderCycle();
            } catch (e) {
                // ignore
            }

            expect(rootElement?.innerHTML).toBe(initialHtmlRendered);
        });
    });
});

