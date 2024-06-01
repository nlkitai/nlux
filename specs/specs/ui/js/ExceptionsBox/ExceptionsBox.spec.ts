import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {createExceptionsBoxController} from '../../../../../packages/shared/src/components/ExceptionsBox/control';
import {createExceptionsBoxDom} from '../../../../../packages/shared/src/components/ExceptionsBox/create';

describe('When an exceptions box component is rendered', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('Should render an empty exceptions box', () => {
        // Act
        const exceptionsBox = createExceptionsBoxDom();

        // Assert
        expect(exceptionsBox.outerHTML).toEqual(expect.stringContaining('<div class="nlux-comp-exp_box"></div>'));
    });

    describe('When an exception occurs', () => {
        it('Should be displayed in the exceptions box', async () => {
            // Arrange
            const exceptionsBox = createExceptionsBoxDom();
            const controller = createExceptionsBoxController(exceptionsBox);

            // Act
            controller.displayException('An error occurred');
            vi.advanceTimersByTime(1);

            // Assert
            expect(exceptionsBox.outerHTML).toEqual(
                expect.stringContaining(
                    '<div class="nlux-comp-exp_box"><div class="nlux-comp-exp_itm"><span class="nlux-comp-exp_itm_msg">An error occurred</span></div></div>',
                ),
            );
        });

        it('Should be removed after 4.5 seconds', async () => {
            // Arrange
            const exceptionsBox = createExceptionsBoxDom();
            const controller = createExceptionsBoxController(exceptionsBox);

            // Act
            controller.displayException('An error occurred');
            vi.advanceTimersByTime(4500 + 1);

            // Assert
            expect(exceptionsBox.outerHTML).toEqual(expect.stringContaining('<div class="nlux-comp-exp_box"></div>'));
        });
    });

    describe('When multiple exceptions occur', () => {
        it('They should be displayed in the exceptions box one after the other', async () => {
            // Arrange
            const exceptionsBox = createExceptionsBoxDom();
            const controller = createExceptionsBoxController(exceptionsBox);

            // Act
            controller.displayException('An error occurred');
            controller.displayException('Another error occurred');

            // Assert
            expect(exceptionsBox.outerHTML).toEqual(
                expect.stringContaining(
                    '<div class="nlux-comp-exp_box"><div class="nlux-comp-exp_itm"><span class="nlux-comp-exp_itm_msg">An error occurred</span></div></div>',
                ),
            );

            // Act
            vi.advanceTimersByTime(4500 + 1);

            // Assert
            expect(exceptionsBox.outerHTML).toEqual(
                expect.stringContaining(
                    '<div class="nlux-comp-exp_box"><div class="nlux-comp-exp_itm"><span class="nlux-comp-exp_itm_msg">Another error occurred</span></div></div>',
                ),
            );
        });

        it('They should be removed one after the other', async () => {
            // Arrange
            const exceptionsBox = createExceptionsBoxDom();
            const controller = createExceptionsBoxController(exceptionsBox);

            // Act
            controller.displayException('An error occurred');
            controller.displayException('Another error occurred');

            // Act
            vi.advanceTimersByTime(4500 * 2 + 1);

            // Assert
            expect(exceptionsBox.outerHTML).toEqual(expect.stringContaining('<div class="nlux-comp-exp_box"></div>'));
        });
    });
});
