import {describe, expect, it} from 'vitest';
import {createPromptBoxDom} from '../../../../../packages/shared/src/ui/PromptBox/create';

describe('When a prompt box component is rendered and is in waiting status', () => {
    it('Should render the prompt box with a submit button', () => {
        // Arrange
        const dom = createPromptBoxDom({status: 'waiting'});

        // Act
        const html = dom.outerHTML;

        // Assert
        expect(html).toEqual(
            expect.stringContaining('<div class="nlux-comp-prmptBox nlux-prmpt-waiting">'),
        );
        expect(html).toEqual(
            expect.stringContaining('<button disabled=""><div class="nlux_sndIcn"><div class="snd_icn_ctn">'));
    });

    it('the submit button should be disabled', () => {
        // Arrange
        const dom = createPromptBoxDom({status: 'waiting'});
        const submitButton = dom.querySelector('button')!;

        // Act
        const html = dom.outerHTML;

        // Assert
        expect(submitButton.disabled).toBe(true);
    });

    it('The textarea should be enabled', () => {
        // Arrange
        const dom = createPromptBoxDom({status: 'waiting'});
        const textarea = dom.querySelector('textarea')!;

        // Act
        const html = dom.outerHTML;

        // Assert
        expect(textarea.disabled).toBe(false);
    });

    describe('When the status is updated to typing', () => {
        it('Should render the prompt box with a text input', () => {
            // Arrange
            const dom = createPromptBoxDom({status: 'waiting'});
            const textarea = dom.querySelector('textarea')!;

            // Act
            const html = dom.outerHTML;

            // Assert
            expect(html).toEqual(expect.stringContaining('<textarea placeholder=""></textarea>'));
        });

        it('The textarea should be enabled', () => {
            // Arrange
            const dom = createPromptBoxDom({status: 'waiting'});
            const textarea = dom.querySelector('textarea')!;

            // Act
            const html = dom.outerHTML;

            // Assert
            expect(textarea.disabled).toBe(false);
        });
    });
});
