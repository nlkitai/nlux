import {NluxRenderingError} from '../../../core/error';
import {listenToElement} from '../../../dom/listenToElement';
import {CompRenderer} from '../../../types/comp';
import {textToHtml} from '../../../x/parseTextMessage';
import {render} from '../../../x/render.ts';
import {source} from '../../../x/source.ts';
import {CompTextMessageActions, CompTextMessageElements, CompTextMessageEvents, CompTextMessageProps} from './types';

export const __ = (styleName: string) => `nluxc-text-message-${styleName}`;

const html = ({content, createdAt}: CompTextMessageProps) => `` +
    `<div class="${__('content')}" tabindex="0">${content ? textToHtml(content) : ''}</div>` +
    ``;

export const renderTextMessage: CompRenderer<
    CompTextMessageProps, CompTextMessageElements, CompTextMessageEvents, CompTextMessageActions
> = ({appendToRoot, props, compEvent}) => {
    if (props.format !== 'text') {
        throw new NluxRenderingError({
            source: source('text-message', 'render'),
            message: `Unsupported format: ${props.format}! Only text is currently supported!`,
        });
    }

    const dom = render(html(props));
    if (!dom) {
        throw new NluxRenderingError({
            source: source('prompt-box', 'render'),
            message: 'Text message could not be rendered',
        });
    }

    const classFromDirection = props.direction === 'in' ? 'received' : 'sent';
    const container = document.createElement('div');
    container.append(dom);
    container.className = __('container') + ' ' + __(classFromDirection);

    const [contentContainer, removeContentContainerListeners] = listenToElement(container,
        `:scope > .${__('content')}`)
        .on('keydown', (event: KeyboardEvent) => {
            const ctrlDown = event.ctrlKey || event.metaKey;
            if (ctrlDown && event.key === 'c') {
                const copyToClipboardCallback = compEvent('copy-to-clipboard-triggered');
                if (typeof copyToClipboardCallback === 'function') {
                    copyToClipboardCallback(event);
                }

                return;
            }
        })
        .on('click', (event: MouseEvent) => {
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
        })
        .get();

    appendToRoot(container);

    const resizeListeners = new Set<Function>();
    const resizeObserver: ResizeObserver = new ResizeObserver(() => {
        compEvent('message-container-resized')();
    });

    resizeObserver.observe(contentContainer);

    return {
        elements: {
            container,
            contentContainer,
        },
        actions: {
            focus: () => {
                contentContainer.focus();
            },
            appendText: (text: any) => {
                if (typeof text !== 'string' && !Array.isArray(text)) {
                    throw new NluxRenderingError({
                        source: source('text-message', 'render'),
                        message: `Unsupported text type: ${typeof text}! Only strings are supported!`,
                    });
                }

                const textAsArray = Array.isArray(text)
                    ? text.filter(item => typeof item === 'string') as string[]
                    : [text];

                const fragment = document.createDocumentFragment();

                textAsArray.forEach(text => {
                    const el = document.createElement('span');
                    el.innerHTML = textToHtml(text);

                    while (el.childNodes.length > 0) {
                        fragment.append(el.childNodes[0]);
                    }
                });

                contentContainer.append(fragment);
            },
            scrollToMessageEndContainer: () => {
                container.scrollIntoView({
                    block: 'end',
                    inline: 'end',
                    behavior: 'smooth',
                });
            },
        },
        onDestroy: () => {
            removeContentContainerListeners();
            resizeObserver.disconnect();
        },
    };
};
