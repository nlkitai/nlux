import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {createMdStreamRenderer} from '@shared/markdown/stream/streamParser';
import {StandardStreamParserOutput} from '@shared/types/markdown/streamParser';
import {waitForMilliseconds} from '../../utils/wait';

describe('MD Stream Parser Streaming', () => {
    let streamRenderer: StandardStreamParserOutput;
    let rootElement: HTMLElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement, {
            skipStreamingAnimation: true,
            streamingAnimationSpeed: 0,
        });
    });

    afterEach(() => {
        rootElement.remove();
    });

    describe('Default tag', () => {
        it('should render text in a <p /> tag as it\'s being streamed', async () => {
            streamRenderer.next('H');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<p>H</p>');

            streamRenderer.next('e');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<p>He</p>');

            streamRenderer.next('l');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<p>Hel</p>');

            streamRenderer.next('l');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<p>Hell</p>');

            streamRenderer.next('o');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<p>Hello</p>');

            streamRenderer.complete!();
            await waitForMilliseconds(10);
            expect(rootElement.innerHTML).toBe('<p>Hello</p>');
        });
    });

    describe('onComplete', () => {
        it('should call the onComplete callback when the stream is completed', async () => {
            const onComplete = vi.fn();
            rootElement = document.createElement('div');
            streamRenderer = createMdStreamRenderer(rootElement, {
                onComplete,
                skipStreamingAnimation: true,
                streamingAnimationSpeed: 0,
            });

            streamRenderer.next('H');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<p>H</p>');
            expect(onComplete).not.toHaveBeenCalled();

            streamRenderer.next('i');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<p>Hi</p>');
            expect(onComplete).not.toHaveBeenCalled();

            streamRenderer.complete!();
            await waitForMilliseconds(10);
            expect(onComplete).toHaveBeenCalled();
            expect(rootElement.innerHTML).toBe('<p>Hi</p>');
        });

        it('Should be called automatically after 2 seconds from last character if stream is not closed', async () => {
            const onComplete = vi.fn();
            rootElement = document.createElement('div');
            streamRenderer = createMdStreamRenderer(rootElement, {
                onComplete,
                skipStreamingAnimation: true,
                streamingAnimationSpeed: 0,
            });

            streamRenderer.next('Hi');
            await waitForMilliseconds(20);

            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<p>Hi</p>');
            expect(onComplete).not.toHaveBeenCalled();

            await waitForMilliseconds(2200);
            expect(onComplete).toHaveBeenCalled();

            expect(rootElement.innerHTML).toBe('<p>Hi</p>');
        });
    });

    describe('H1', () => {
        it('should render text in a <h1 /> tag as it\'s being streamed', async () => {
            streamRenderer.next('#');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<h1></h1>');

            streamRenderer.next(' ');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<h1></h1>');

            streamRenderer.next('H');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<h1>H</h1>');

            streamRenderer.next('e');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<h1>He</h1>');

            streamRenderer.next('l');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<h1>Hel</h1>');

            streamRenderer.next('l');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<h1>Hell</h1>');

            streamRenderer.next('o');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<h1>Hello</h1>');

            streamRenderer.complete!();
            await waitForMilliseconds(10);
            expect(rootElement.innerHTML).toBe('<h1>Hello</h1>');
        });
    });

    describe('H2', () => {
        it('should render text in a <h2 /> tag as it\'s being streamed', async () => {
            streamRenderer.next('#');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<h1></h1>');

            streamRenderer.next('#');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<h2></h2>');

            streamRenderer.next(' ');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<h2></h2>');

            streamRenderer.next('H');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<h2>H</h2>');

            streamRenderer.next('e');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<h2>He</h2>');

            streamRenderer.next('l');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<h2>Hel</h2>');

            streamRenderer.next('l');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<h2>Hell</h2>');

            streamRenderer.next('o');
            await waitForMilliseconds(10);
            expect(rootElement.querySelector('.md-in-progress')!.innerHTML).toBe('<h2>Hello</h2>');

            streamRenderer.complete!();
            await waitForMilliseconds(10);
            expect(rootElement.innerHTML).toBe('<h2>Hello</h2>');
        });
    });
});
