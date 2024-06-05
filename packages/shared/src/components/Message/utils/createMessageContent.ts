import {attachCopyClickListener} from '../../../markdown/copyToClipboard/attachCopyClickListener';
import {parseMdSnapshot} from '../../../markdown/snapshot/snapshotParser';
import {SnapshotParserOptions} from '../../../types/markdown/snapshotParser';

export const createMessageContent = (
    message: string,
    format: 'text' | 'markdown' = 'text',
    markdownOptions?: SnapshotParserOptions,
): HTMLElement | DocumentFragment | Text => {
    if (format === 'markdown') {
        // Render message as a text node to avoid XSS
        const htmlElement = document.createElement('div');
        htmlElement.innerHTML = parseMdSnapshot(message, markdownOptions);
        attachCopyClickListener(htmlElement);

        const fragment = document.createDocumentFragment();
        while (htmlElement.firstChild) {
            fragment.appendChild(htmlElement.firstChild);
        }

        return fragment;
    }

    // Render message as a text node to avoid XSS
    return document.createTextNode(message);
};
