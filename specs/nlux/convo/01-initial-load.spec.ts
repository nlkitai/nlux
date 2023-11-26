import {AdapterBuilder, createConvo, NluxConvo} from '@nlux/nlux';
import {createAdapter} from '@nlux/openai';
import '@testing-library/jest-dom';
import {queries} from '../../utils/selectors';
import {waitForRenderCycle} from '../../utils/wait';

const apiKey = 'YOUR_API_KEY_HERE';

describe('On NluxConvo initial load', () => {
    const adapter: AdapterBuilder<any, any> = createAdapter().withApiKey(apiKey);

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

    it('should not initially render anything is DOM', async () => {
        nluxConvo = createConvo().withAdapter(adapter);
        await waitForRenderCycle();
        expect(rootElement?.innerHTML).toBe('');
    });

    describe('When mount() is called', () => {
        it('chat room container should render', async () => {
            nluxConvo = createConvo().withAdapter(adapter);

            nluxConvo.mount(rootElement);
            await waitForRenderCycle();

            expect(queries.chatRoom()).toBeInTheDocument();
        });

        it('exceptions box container should render', async () => {
            nluxConvo = createConvo().withAdapter(adapter);
            nluxConvo.mount(rootElement);
            await waitForRenderCycle();

            expect(queries.exceptionsBox()).toBeInTheDocument();
        });

        it('prompt box container should render', async () => {
            nluxConvo = createConvo().withAdapter(adapter);
            nluxConvo.mount(rootElement);
            await waitForRenderCycle();

            expect(queries.promptBoxContainer()).toBeInTheDocument();
        });

        it('conversation container should render', async () => {
            nluxConvo = createConvo().withAdapter(adapter);
            nluxConvo.mount(rootElement);
            await waitForRenderCycle();

            expect(queries.conversationContainer()).toBeInTheDocument();
        });
    });

    describe('When mount() is called twice', () => {
        it('should throw an error', async () => {
            nluxConvo = createConvo().withAdapter(adapter);
            nluxConvo.mount(rootElement);
            await waitForRenderCycle();

            expect(() => nluxConvo?.mount(rootElement)).toThrowError();
        });

        it('should not render anything new in DOM', async () => {
            nluxConvo = createConvo().withAdapter(adapter);
            nluxConvo.mount(rootElement);
            await waitForRenderCycle();

            const initialHtmlRendered = rootElement?.innerHTML;

            try {
                nluxConvo.mount(rootElement);
                await waitForRenderCycle();
            } catch (e) {
                // ignore
            }

            expect(rootElement?.innerHTML).toBe(initialHtmlRendered);
        });
    });
});

