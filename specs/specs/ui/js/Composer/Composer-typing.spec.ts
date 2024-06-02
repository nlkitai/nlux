import {describe, expect, it} from 'vitest';
import {createComposerDom} from '@shared/components/Composer/create';
import {ComposerProps} from '@shared/components/Composer/props';
import {updateComposerDom} from '@shared/components/Composer/update';

describe('When a composer component is rendered and is in typing status', () => {
    it('Should render the composer with a textarea and button', () => {
        // Arrange
        const dom = createComposerDom({status: 'typing'});

        // Act
        const html = dom.outerHTML;

        // Assert
        expect(html).toEqual(expect.stringContaining('<div class="nlux-comp-composer nlux-composer--typing">'));
        expect(html).toEqual(expect.stringContaining('<textarea placeholder=""></textarea>'));
        expect(html).toEqual(
            expect.stringContaining('<button disabled=""><div class="nlux-comp-sendIcon"><div class="nlux-comp-sendIcon-container">'),
        );
    });

    it('The textarea should be enabled and empty', () => {
        // Arrange
        const dom = createComposerDom({status: 'typing'});
        const textarea = dom.querySelector('textarea')!;

        // Act
        const html = dom.outerHTML;

        // Assert
        expect(textarea.disabled).toBe(false);
        expect(textarea.value).toBe('');
    });

    it('The submit button should be disabled', () => {
        // Arrange
        const dom = createComposerDom({status: 'typing'});
        const submitButton = dom.querySelector('button')!;

        // Act
        const html = dom.outerHTML;

        // Assert
        expect(submitButton.disabled).toBe(true);
    });

    describe('With a placeholder', () => {
        it('Should render the placeholder', () => {
            // Arrange
            const dom = createComposerDom({status: 'typing', placeholder: 'Type here'});

            // Act
            const html = dom.outerHTML;

            // Assert
            expect(html).toEqual(expect.stringContaining('<textarea placeholder="Type here"></textarea>'));
        });

        describe('When the placeholder is updated', () => {
            it('Should update the placeholder', () => {
                // Arrange
                const beforeProps: ComposerProps = {status: 'typing', placeholder: 'Type here'};
                const props: ComposerProps = {status: 'typing', placeholder: 'Type something else'};
                const dom = createComposerDom(beforeProps);
                const textarea = dom.querySelector('textarea')!;

                // Act
                updateComposerDom(dom, beforeProps, props);

                // Assert
                expect(textarea.placeholder).toBe('Type something else');
            });
        });
    });

    describe('With a message', () => {
        it('Should render the message', () => {
            // Arrange
            const props: ComposerProps = {status: 'typing', message: 'Hello, World!'};
            const dom = createComposerDom(props);
            const textarea = dom.querySelector('textarea')!;

            // Act
            const html = dom.outerHTML;

            // Assert
            expect(textarea.value).toBe('Hello, World!');
        });

        describe('When the message is updated', () => {
            it('Should update the message', () => {
                // Arrange
                const beforeProps: ComposerProps = {status: 'typing', message: 'Hello, World!'};
                const props: ComposerProps = {status: 'typing', message: 'Goodbye, World!'};
                const dom = createComposerDom(beforeProps);
                const textarea = dom.querySelector('textarea')!;

                // Act
                updateComposerDom(dom, beforeProps, props);

                // Assert
                expect(textarea.value).toBe('Goodbye, World!');
            });
        });
    });

    describe('When status is updated to submitting', () => {
        it('Should disable the textarea and submit button', () => {
            // Arrange
            const beforeProps: ComposerProps = {status: 'typing'};
            const props: ComposerProps = {status: 'submitting-prompt'};
            const dom = createComposerDom(beforeProps);
            const textarea = dom.querySelector('textarea')!;
            const submitButton = dom.querySelector('button')!;

            // Act
            updateComposerDom(dom, beforeProps, props);

            // Assert
            expect(textarea.disabled).toBe(true);
            expect(submitButton.disabled).toBe(true);
        });
    });

    describe('When status is updated to waiting', () => {
        it('Should disable submit button and keep textarea enabled', () => {
            // Arrange
            const beforeProps: ComposerProps = {status: 'typing'};
            const props: ComposerProps = {status: 'waiting'};
            const dom = createComposerDom(beforeProps);
            const textarea = dom.querySelector('textarea')!;
            const submitButton = dom.querySelector('button')!;

            // Act
            updateComposerDom(dom, beforeProps, props);

            // Assert
            expect(textarea.disabled).toBe(false);
            expect(submitButton.disabled).toBe(true);
        });
    });
});
