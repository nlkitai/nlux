import { sanitizeHTML } from '../../../../js/core/src/exports/sanitizer';
import { SnapshotParser } from '../../types/markdown/snapshotParser';
import { insertCopyToClipboardButton } from '../copyToClipboard/insertCopyToClipboardButton';
import { marked } from './marked/marked';

export const parseMdSnapshot: SnapshotParser = (snapshot, options): string => {
  const { showCodeBlockCopyButton, markdownLinkTarget, syntaxHighlighter } =
    options || {};

  const parsedMarkdown = marked(snapshot, {
    async: false,
    breaks: true,
  });

  if (typeof parsedMarkdown !== 'string') {
    throw new Error('Markdown parsing failed');
  }

  const element = document.createElement('div');
  const sanitizedHTML = sanitizeHTML(parsedMarkdown);
  element.innerHTML = sanitizedHTML;

  element.querySelectorAll('pre').forEach((block) => {
    const newBlock = document.createElement('div');
    newBlock.className = 'code-block';

    const codeElement = block.querySelector('code');
    if (!codeElement) {
      // No code can be found, so just copy the innerHTML of the block.
      const sanitizedHTML = sanitizeHTML(block.innerHTML);
      newBlock.innerHTML = sanitizedHTML;
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
    const sanitizedHTML = sanitizeHTML(
      '<div>' + codeElement.innerHTML + '</div>'
    );
    newCodeElement.innerHTML = sanitizedHTML;

    if (language) {
      newCodeElement.setAttribute('data-language', language);

      //
      // Apply syntax highlighting
      //
      if (syntaxHighlighter) {
        const highlight = syntaxHighlighter.createHighlighter();
        const sanitizedHTML = sanitizeHTML(
          '<div>' +
            highlight(codeElement.textContent || '', language) +
            '</div>'
        );
        newCodeElement.innerHTML = sanitizedHTML;
        newCodeElement.className = 'highlighter-dark';
      }
    }

    const sanitizedHTML2 = sanitizeHTML('');
    newBlock.innerHTML = sanitizedHTML2;
    newBlock.appendChild(newCodeElement);
    block.replaceWith(newBlock);
  });

  if (showCodeBlockCopyButton !== false) {
    // Default to true
    insertCopyToClipboardButton(element);
  }

  if (markdownLinkTarget !== 'self') {
    // Default to 'blank'
    element.querySelectorAll('a').forEach((link) => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }

  return element.innerHTML;
};
