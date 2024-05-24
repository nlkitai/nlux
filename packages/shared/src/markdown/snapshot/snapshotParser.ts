import {SnapshotParser} from '../../types/markdown/snapshotParser';
import {emptyInnerHtml} from '../../utils/dom/emptyInnerHtml';
import {insertCopyToClipboardButton} from '../copyToClipboard/insertCopyToClipboardButton';
import {marked} from './marked/marked';

export const parseMdSnapshot: SnapshotParser = (
    snapshot,
    options,
): string => {

    const {
        showCodeBlockCopyButton,
        markdownLinkTarget,
        syntaxHighlighter,
    } = options || {};

    const parsedMarkdown = marked(snapshot, {
        async: false,
        breaks: true,
    });

    if (typeof parsedMarkdown !== 'string') {
        throw new Error('Markdown parsing failed');
    }

    const element = document.createElement('div');
    element.innerHTML = parsedMarkdown;

    element.querySelectorAll('pre').forEach((block) => {
        const newBlock = document.createElement('div');
        newBlock.className = 'code-block';

        const codeElement = block.querySelector('code');
        if (!codeElement) {
            // No code can be found, so just copy the innerHTML of the block.
            newBlock.innerHTML = block.innerHTML;
            block.replaceWith(newBlock);
            return;
        }

        //
        // When a code block is found
        // 1. Adjust the class name and HTML structure to style the code block
        // 2. Apply syntax highlighting
        // 3. Add a copy to clipboard button
        // 4. Apply link target
        //

        let language: string | undefined;
        for (let i = 0; i < codeElement.classList.length; i++) {
            const className = codeElement.classList[i];
            if (className.startsWith('language-')) {
                language = className.slice(9);
                break;
            }
        }

        const newCodeElement = document.createElement('pre');
        newCodeElement.innerHTML = '<div>' + codeElement.innerHTML + '</div>';

        if (language) {
            newCodeElement.setAttribute('data-language', language);

            //
            // Apply syntax highlighting
            //
            if (syntaxHighlighter) {
                const highlight = syntaxHighlighter.createHighlighter();
                newCodeElement.innerHTML = '<div>' +
                    highlight(codeElement.textContent || '', language) +
                    '</div>';
                newCodeElement.className = 'highlighter-dark';
            }
        }

        emptyInnerHtml(newBlock);
        newBlock.appendChild(newCodeElement);
        block.replaceWith(newBlock);
    });

    if (showCodeBlockCopyButton !== false) { // Default to true
        insertCopyToClipboardButton(element);
    }

    if (markdownLinkTarget !== 'self') { // Default to 'blank'
        element.querySelectorAll('a').forEach((link) => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }

    return element.innerHTML;
};
