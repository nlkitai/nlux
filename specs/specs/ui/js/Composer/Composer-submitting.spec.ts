import {describe, expect, it} from 'vitest';
import {createComposerDom} from '@shared/components/Composer/create';
import {updateComposerDom} from '@shared/components/Composer/update';

describe('When a composer component is rendered and is in submitting status', () => {
    it('Should render the composer with a submit button', () => {
        // Arrange
        const dom = createComposerDom({status: 'submitting-prompt'});

        // Act
        const html = dom.outerHTML;

        // Assert
        expect(html).toEqual(
            expect.stringContaining('<div class="nlux-comp-composer nlux-composer--submitting">'),
        );
        expect(html).toEqual(
            expect.stringContaining('<button disabled=""><div class="nlux-comp-sendIcon"><div class="nlux-comp-sendIcon-ctn">'));
    });

    it('Should submit button should be disabled', () => {
        // Arrange
        const dom = createComposerDom({status: 'submitting-prompt'});
        const submitButton = dom.querySelector('button')!;

        // Act
        const html = dom.outerHTML;

        // Assert
        expect(submitButton.disabled).toBe(true);
    });

    it('The text input should be disabled', () => {
        // Arrange
        const dom = createComposerDom({status: 'submitting-prompt'});
        const textarea = dom.querySelector('textarea')!;

        // Act
        const html = dom.outerHTML;

        // Assert
        expect(textarea.disabled).toBe(true);
    });

    describe('When the status is updated to typing', () => {
        it('The textarea should be enabled', () => {
            // Arrange
            const dom = createComposerDom({status: 'submitting-prompt'});
            const textarea = dom.querySelector('textarea')!;

            // Act
            updateComposerDom(dom, {status: 'submitting-prompt'}, {status: 'typing'});

            // Assert
            expect(textarea.disabled).toBe(false);
        });

        it('The submit button should be disabled', () => {
            // Arrange
            const dom = createComposerDom({status: 'submitting-prompt'});
            const submitButton = dom.querySelector('button')!;

            // Act
            updateComposerDom(dom, {status: 'submitting-prompt'}, {status: 'typing'});

            // Assert
            expect(submitButton.disabled).toBe(true);
        });
    });
});