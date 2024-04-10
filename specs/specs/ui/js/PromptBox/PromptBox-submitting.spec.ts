import {createPromptBoxDom} from '@nlux-dev/core/src/ui/PromptBox/create';
import {updatePromptBoxDom} from '@nlux-dev/core/src/ui/PromptBox/update';
import {describe, expect, it} from 'vitest';

describe('When a prompt box component is rendered and is in submitting status', () => {
    it('should render the prompt box with a submit button', () => {
        // Given
        const dom = createPromptBoxDom({status: 'submitting'});

        // When
        const html = dom.outerHTML;

        // Then
        expect(html).toEqual(
            expect.stringContaining('<div class="nlux_comp_prmpt_box nlux_prmpt_submitting">'),
        );
        expect(html).toEqual(
            expect.stringContaining('<button disabled=""><div class="nlux_snd_icn"><div class="snd_icn_ctn"><svg'));
    });

    it('submit button should be disabled', () => {
        // Given
        const dom = createPromptBoxDom({status: 'submitting'});
        const submitButton = dom.querySelector('button')!;

        // When
        const html = dom.outerHTML;

        // Then
        expect(submitButton.disabled).toBe(true);
    });

    it('text input should be disabled', () => {
        // Given
        const dom = createPromptBoxDom({status: 'submitting'});
        const textarea = dom.querySelector('textarea')!;

        // When
        const html = dom.outerHTML;

        // Then
        expect(textarea.disabled).toBe(true);
    });

    describe('when the status is updated to typing', () => {
        it('textarea should be enabled', () => {
            // Given
            const dom = createPromptBoxDom({status: 'submitting'});
            const textarea = dom.querySelector('textarea')!;

            // When
            updatePromptBoxDom(dom, {status: 'submitting'}, {status: 'typing'});

            // Then
            expect(textarea.disabled).toBe(false);
        });

        it('submit button should be enabled', () => {
            // Given
            const dom = createPromptBoxDom({status: 'submitting'});
            const submitButton = dom.querySelector('button')!;

            // When
            updatePromptBoxDom(dom, {status: 'submitting'}, {status: 'typing'});

            // Then
            expect(submitButton.disabled).toBe(false);
        });
    });
});