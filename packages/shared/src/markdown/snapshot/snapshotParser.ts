import {SnapshotParser} from '../../types/markdown/snapshotParser';
import {parse} from './snarkdown';

export const createMdSnapshotRenderer: SnapshotParser = (
        root: HTMLElement,
        options,
    ) => {
        const {
            skipCopyToClipboardButton = false,
            openLinksInNewWindow = false,
            syntaxHighlighter,
        } = options || {};

        return (snapshot: string) => {
            const parsedMarkdown = parse(
                snapshot,
                {openLinksInNewWindow},
            );

            const element = document.createElement('div');
            element.innerHTML = parsedMarkdown;

            // TODO — Add syntax highlighting, block styles, and copy to clipboard button.
            element.querySelectorAll('pre.code').forEach((block) => {
                const newBlock = document.createElement('div');
                newBlock.className = 'code-block';

                const codeElement = block.querySelector('code');
                if (!codeElement) {
                    // No code can be found, so just copy the innerHTML of the block.
                    newBlock.innerHTML = block.innerHTML;
                } else {
                    // Get the language of the code block
                    // Adjust the class name and HTML structure
                    // Apply syntax highlighting

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

                        if (syntaxHighlighter) {
                            const highlight = syntaxHighlighter.createHighlighter();
                            newCodeElement.innerHTML = '<div>' +
                                highlight(codeElement.textContent || '', language) +
                                '</div>';
                            newCodeElement.className = 'highlighter-dark';
                        }
                    }

                    newBlock.innerHTML = '';
                    newBlock.appendChild(newCodeElement);
                }

                block.replaceWith(newBlock);
            });

            root.innerHTML = element.innerHTML;
        };
    }
;
