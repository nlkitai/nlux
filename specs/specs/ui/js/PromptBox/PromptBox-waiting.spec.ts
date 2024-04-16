import {describe, expect, it} from 'vitest';
import {createPromptBoxDom} from '../../../../../packages/shared/src/ui/PromptBox/create';

describe('When a prompt box component is rendered and is in waiting status', () => {
    it('Should render the prompt box with a submit button', () => {
        // Given
        const dom = createPromptBoxDom({status: 'waiting'});

        // When
        const html = dom.outerHTML;

        // Then
        expect(html).toEqual(
            expect.stringContaining('<div class="nlux-comp-prmptBox nlux-prmpt-waiting">'),
        );
        expect(html).toEqual(
            expect.stringContaining('<button disabled=""><div class="nlux_sndIcn"><div class="snd_icn_ctn"><svg'));
    });

    it('the submit button should be disabled', () => {
        // Given
        const dom = createPromptBoxDom({status: 'waiting'});
        const submitButton = dom.querySelector('button')!;

        // When
        const html = dom.outerHTML;

        // Then
        expect(submitButton.disabled).toBe(true);
    });

    it('The textarea should be enabled', () => {
        // Given
        const dom = createPromptBoxDom({status: 'waiting'});
        const textarea = dom.querySelector('textarea')!;

        // When
        const html = dom.outerHTML;

        // Then
        expect(textarea.disabled).toBe(false);
    });

    describe('When the status is updated to typing', () => {
        it('Should render the prompt box with a text input', () => {
            // Given
            const dom = createPromptBoxDom({status: 'waiting'});
            const textarea = dom.querySelector('textarea')!;

            // When
            const html = dom.outerHTML;

            // Then
            expect(html).toEqual(expect.stringContaining('<textarea placeholder=""></textarea>'));
        });

        it('The textarea should be enabled', () => {
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
