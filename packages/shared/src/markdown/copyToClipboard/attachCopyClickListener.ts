export const attachCopyClickListener = (markdownContainer: HTMLElement) => {
    markdownContainer.querySelectorAll('.nlux-comp-copyButton').forEach((copyButton) => {
        if (!(copyButton instanceof HTMLButtonElement)) {
            return;
        }

        // If button has click event listener, do not add another one
        if (copyButton.dataset.clickListenerSet === 'true') {
            return;
        }

        let clicked = false;
        const codeBlock = copyButton.nextElementSibling as HTMLElement;
        copyButton.addEventListener('click', () => {
            if (clicked || !codeBlock) {
                return;
            }

            // Copy code to clipboard
            const code = codeBlock.innerText;
            navigator.clipboard.writeText(code ?? '');

            // Mark button as clicked for 1 second
            clicked = true;
            copyButton.classList.add('clicked');
            setTimeout(() => {
                clicked = false;
                copyButton.classList.remove('clicked');
            }, 1000);
        });

        // Set data attribute to indicate that click event listener has been set
        copyButton.dataset.clickListenerSet = 'true';
    });
};
