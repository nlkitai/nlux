export const insertCopyToClipboardButton = (markdownContainer: HTMLElement) => {
    markdownContainer.querySelectorAll('.code-block').forEach((codeBlockContainer) => {
        const codeBlock = codeBlockContainer.querySelector('pre');
        if (!codeBlock) {
            return;
        }

        // Check the adjacent element to see if a copy button is already present
        if (codeBlockContainer.previousElementSibling?.classList.contains('nlux-comp-copyButton')) {
            return;
        }

        const title = 'Copy code block to clipboard';
        const copyButton = document.createElement('button');

        copyButton.classList.add('nlux-comp-copyButton');
        copyButton.setAttribute('aria-label', title);
        copyButton.setAttribute('title', title);

        const copyIcon = document.createElement('span');
        copyIcon.classList.add('icon-copy');
        copyButton.appendChild(copyIcon);

        codeBlockContainer.appendChild(copyButton);
    });
};
