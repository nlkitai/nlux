import {Observable} from '../../../core/bus/observable';
import {IObserver} from '../../../core/bus/observer';
import {NluxRenderingError} from '../../../core/error';
import {CompRenderer} from '../../../types/comp';
import {listenToElement} from '../../../utils/dom/listenToElement';
import {createMdStreamRenderer} from '../../../utils/md/streamParser';
import {textToHtml} from '../../../x/parseTextMessage';
import {render} from '../../../x/render';
import {source} from '../../../x/source';
import {
    CompTextMessageActions,
    CompTextMessageElements,
    CompTextMessageEvents,
    CompTextMessageProps,
    TextMessageContentLoadingStatus,
} from './types';

export const __ = (styleName: string) => `nluxc-text-message-${styleName}`;

const html = ({content, createdAt}: CompTextMessageProps) => `` +
    `<div class="${__('content')}" tabindex="0">${content ? textToHtml(content) : ''}</div>` +
    ``;

export const renderTextMessage: CompRenderer<
    CompTextMessageProps, CompTextMessageElements, CompTextMessageEvents, CompTextMessageActions
> = ({appendToRoot, props, compEvent}) => {
    let isMessageContentAppended = false;
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

    const container = document.createElement('div');
    const classFromDirection = props.direction === 'in' ? 'received' : 'sent';
    let classFromLoadingStatus = `loading-status-${props.loadingStatus}`;
    container.append(dom);
    container.classList.add(__('container'));
    container.classList.add(__(classFromDirection));
    container.classList.add(classFromLoadingStatus);

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

    let mdStreamRenderer: IObserver<string> | undefined;

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
            subscribeToContentStream: (contentStream: Observable<string>) => {
                if (mdStreamRenderer) {
                    throw new NluxRenderingError({
                        source: source('text-message', 'render'),
                        message: 'Content stream already subscribed! You should wait for stream completion or call '
                            + 'unsubscribe before subscribing again!',
                    });
                }

                contentStream.subscribe({
                    next: (chunk: string) => {
                        if (!mdStreamRenderer) {
                            mdStreamRenderer = createMdStreamRenderer(contentContainer);
                        }

                        mdStreamRenderer.next(chunk);
                    },
                    complete: () => {
                        if (mdStreamRenderer?.complete) {
                            mdStreamRenderer.complete();
                        }

                        mdStreamRenderer = undefined;
                    },
                });
            },
            unsubscribeFromContentStream: () => {
                if (mdStreamRenderer?.complete) {
                    mdStreamRenderer.complete();
                    mdStreamRenderer = undefined;
                }
            },
            appendText: (text: any) => {
                if (typeof text !== 'string' && !Array.isArray(text)) {
                    throw new NluxRenderingError({
                        source: source('text-message', 'render'),
                        message: `Unsupported text type: ${typeof text}! Only strings are supported!`,
                    });
                }

                if (mdStreamRenderer) {
                    throw new NluxRenderingError({
                        source: source('text-message', 'render'),
                        message: 'Content stream already subscribed! You should wait for stream completion before '
                            + 'appending text!',
                    });
                }

                const textAsArray = Array.isArray(text)
                    ? text.filter(item => typeof item === 'string') as string[]
                    : (typeof text === 'string' ? [text] : []);

                mdStreamRenderer = createMdStreamRenderer(contentContainer);
                for (const textItem of textAsArray) {
                    mdStreamRenderer.next(textItem);
                }

                if (mdStreamRenderer.complete) {
                    mdStreamRenderer.complete();
                }

                mdStreamRenderer = undefined;
            },
            scrollToMessageEndContainer: () => {
                container.scrollIntoView({
                    block: 'end',
                    inline: 'end',
                    behavior: 'smooth',
                });
            },
            setLoadingStatus: (status: TextMessageContentLoadingStatus) => {
                container.classList.remove(classFromLoadingStatus);
                classFromLoadingStatus = `loading-status-${status}`;
                container.classList.add(classFromLoadingStatus);
            },
        },
        onDestroy: () => {
            removeContentContainerListeners();
            resizeObserver.disconnect();
        },
    };
};
