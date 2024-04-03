import {createPromptBoxDom} from '@nlux-dev/core/src/comp/PromptBox/create';
import {PromptBoxProps} from '@nlux-dev/core/src/comp/PromptBox/props';
import {updatePromptBoxDom} from '@nlux-dev/core/src/comp/PromptBox/update';
import {describe, expect, it} from 'vitest';

describe('When a prompt box component is rendered and is in typing status', () => {
    it('should render the prompt box with a text input', () => {
        // Given
        const dom = createPromptBoxDom({status: 'typing'});

        // When
        const html = dom.outerHTML;

        // Then
        expect(html).toEqual(expect.stringContaining('<div class="nlux_comp_prmpt_box nlux_prmpt_typing">'));
        expect(html).toEqual(expect.stringContaining('<textarea placeholder=""></textarea>'));
        expect(html).toEqual(
            expect.stringContaining('<button><div class="nlux_snd_icn"><div class="snd_icn_ctn"><svg'));
    });

    it('textarea should be enabled and empty', () => {
        // Given
        const dom = createPromptBoxDom({status: 'typing'});
        const textarea = dom.querySelector('textarea')!;

        // When
        const html = dom.outerHTML;

        // Then
        expect(textarea.disabled).toBe(false);
        expect(textarea.value).toBe('');
    });

    it('submit button should be enabled', () => {
        // Given
        const dom = createPromptBoxDom({status: 'typing'});
        const submitButton = dom.querySelector('button')!;

        // When
        const html = dom.outerHTML;

        // Then
        expect(submitButton.disabled).toBe(false);
    });

    describe('with a placeholder', () => {
        it('should render the placeholder', () => {
            // Given
            const dom = createPromptBoxDom({status: 'typing', placeholder: 'Type here'});

            // When
            const html = dom.outerHTML;

            // Then
            expect(html).toEqual(expect.stringContaining('<textarea placeholder="Type here"></textarea>'));
        });

        describe('when the placeholder is updated', () => {
            it('should update the placeholder', () => {
                // Given
                const beforeProps: PromptBoxProps = {status: 'typing', placeholder: 'Type here'};
                const props: PromptBoxProps = {status: 'typing', placeholder: 'Type something else'};
                const dom = createPromptBoxDom(beforeProps);
                const textarea = dom.querySelector('textarea')!;

                // When
                updatePromptBoxDom(dom, beforeProps, props);

                // Then
                expect(textarea.placeholder).toBe('Type something else');
            });
        });
    });

    describe('with a message', () => {
        it('should render the message', () => {
            // Given
            const props: PromptBoxProps = {status: 'typing', message: 'Hello, World!'};
            const dom = createPromptBoxDom(props);
            const textarea = dom.querySelector('textarea')!;

            // When
            const html = dom.outerHTML;

            // Then
            expect(textarea.value).toBe('Hello, World!');
        });

        describe('when the message is updated', () => {
            it('should update the message', () => {
                // Given
                const beforeProps: PromptBoxProps = {status: 'typing', message: 'Hello, World!'};
                const props: PromptBoxProps = {status: 'typing', message: 'Goodbye, World!'};
                const dom = createPromptBoxDom(beforeProps);
                const textarea = dom.querySelector('textarea')!;

                // When
                updatePromptBoxDom(dom, beforeProps, props);

                // Then
                expect(textarea.value).toBe('Goodbye, World!');
            });
        });
    });

    describe('when status is updated to submitting', () => {
        it('should disable the textarea and submit button', () => {
            // Given
            const beforeProps: PromptBoxProps = {status: 'typing'};
            const props: PromptBoxProps = {status: 'submitting'};
            const dom = createPromptBoxDom(beforeProps);
            const textarea = dom.querySelector('textarea')!;
            const submitButton = dom.querySelector('button')!;

            // When
            updatePromptBoxDom(dom, beforeProps, props);

            // Then
            expect(textarea.disabled).toBe(true);
            expect(submitButton.disabled).toBe(true);
        });
    });

    describe('when status is updated to waiting', () => {
        it('should disable submit button and keep textarea enabled', () => {
            // Given
            const beforeProps: PromptBoxProps = {status: 'typing'};
            const props: PromptBoxProps = {status: 'waiting'};
            const dom = createPromptBoxDom(beforeProps);
            const textarea = dom.querySelector('textarea')!;
            const submitButton = dom.querySelector('button')!;

            // When
            updatePromptBoxDom(dom, beforeProps, props);

            // Then
            expect(textarea.disabled).toBe(false);
            expect(submitButton.disabled).toBe(true);
        });
    });
});
