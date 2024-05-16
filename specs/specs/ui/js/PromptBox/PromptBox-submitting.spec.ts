import {describe, expect, it} from 'vitest';
import {createPromptBoxDom} from '../../../../../packages/shared/src/ui/PromptBox/create';
import {updatePromptBoxDom} from '../../../../../packages/shared/src/ui/PromptBox/update';

describe('When a prompt box component is rendered and is in submitting status', () => {
    it('Should render the prompt box with a submit button', () => {
        // Arrange
        const dom = createPromptBoxDom({status: 'submitting'});

        // Act
        const html = dom.outerHTML;

        // Assert
        expect(html).toEqual(
            expect.stringContaining('<div class="nlux-comp-prmptBox nlux-prmpt-submitting">'),
        );
        expect(html).toEqual(
            expect.stringContaining('<button disabled=""><div class="nlux_sndIcn"><div class="snd_icn_ctn">'));
    });

    it('Should submit button should be disabled', () => {
        // Arrange
        const dom = createPromptBoxDom({status: 'submitting'});
        const submitButton = dom.querySelector('button')!;

        // Act
        const html = dom.outerHTML;

        // Assert
        expect(submitButton.disabled).toBe(true);
    });

    it('The text input should be disabled', () => {
        // Arrange
        const dom = createPromptBoxDom({status: 'submitting'});
        const textarea = dom.querySelector('textarea')!;

        // Act
        const html = dom.outerHTML;

        // Assert
        expect(textarea.disabled).toBe(true);
    });

    describe('When the status is updated to typing', () => {
        it('The textarea should be enabled', () => {
            // Arrange
            const dom = createPromptBoxDom({status: 'submitting'});
            const textarea = dom.querySelector('textarea')!;

            // Act
            updatePromptBoxDom(dom, {status: 'submitting'}, {status: 'typing'});

            // Assert
            expect(textarea.disabled).toBe(false);
        });

        it('The submit button should be disabled', () => {
            // Arrange
            const dom = createPromptBoxDom({status: 'submitting'});
            const submitButton = dom.querySelector('button')!;

            // Act
            updatePromptBoxDom(dom, {status: 'submitting'}, {status: 'typing'});

            // Assert
            expect(submitButton.disabled).toBe(true);
        });
    });
});