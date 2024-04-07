import {createPromptBoxDom} from '@nlux-dev/core/src/ui/PromptBox/create';
import {describe, expect, it} from 'vitest';

describe('When a prompt box component is rendered and is in waiting status', () => {
    it('should render the prompt box with a submit button', () => {
        // Given
        const dom = createPromptBoxDom({status: 'waiting'});

        // When
        const html = dom.outerHTML;

        // Then
        expect(html).toEqual(
            expect.stringContaining('<div class="nlux_comp_prmpt_box nlux_prmpt_waiting">'),
        );
        expect(html).toEqual(
            expect.stringContaining('<button disabled=""><div class="nlux_snd_icn"><div class="snd_icn_ctn"><svg'));
    });

    it('submit button should be disabled', () => {
        // Given
        const dom = createPromptBoxDom({status: 'waiting'});
        const submitButton = dom.querySelector('button')!;

        // When
        const html = dom.outerHTML;

        // Then
        expect(submitButton.disabled).toBe(true);
    });

    it('text input should be enabled', () => {
        // Given
        const dom = createPromptBoxDom({status: 'waiting'});
        const textarea = dom.querySelector('textarea')!;

        // When
        const html = dom.outerHTML;

        // Then
        expect(textarea.disabled).toBe(false);
    });

    describe('when the status is updated to typing', () => {
        it('should render the prompt box with a text input', () => {
            // Given
            const dom = createPromptBoxDom({status: 'waiting'});
            const textarea = dom.querySelector('textarea')!;

            // When
            const html = dom.outerHTML;

            // Then
            expect(html).toEqual(expect.stringContaining('<textarea placeholder=""></textarea>'));
        });

        it('textarea should be enabled', () => {
            // Given
            const dom = createPromptBoxDom({status: 'waiting'});
            const textarea = dom.querySelector('textarea')!;

            // When
            const html = dom.outerHTML;

            // Then
            expect(textarea.disabled).toBe(false);
        });
    });
});
