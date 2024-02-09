import {NluxRenderingError} from '../../../core/error';
import {createMdStreamRenderer} from '../../../core/markdown/streamParser';
import {BotPersona} from '../../../core/options/personaOptions';
import {CompRenderer} from '../../../types/comp';
import {StandardStreamParserOutput} from '../../../types/markdown/streamParser';
import {listenToElement} from '../../../utils/dom/listenToElement';
import {textToHtml} from '../../../x/parseTextMessage';
import {render} from '../../../x/render';
import {source} from '../../../x/source';
import {
    CompMessageActions,
    CompMessageElements,
    CompMessageEvents,
    CompMessageProps,
    MessageContentLoadingStatus,
} from './message.types';
import {createPersonaDom} from './utils/createPersonaDom';

export const __ = (styleName: string) => `nluxc-text-message-${styleName}`;

const html = ({content}: CompMessageProps) => `` +
    `<div class="${__('content')}" tabindex="0">${content ? textToHtml(content) : ''}</div>` +
    ``;

const loaderHtml = () => `` +
    `<div class="${__('loader')}">` +
    `<div class="spinning-loader-container"><span class="spinning-loader"></span></div>` +
    `</div>`
    + ``;

export const renderMessage: CompRenderer<
    CompMessageProps, CompMessageElements, CompMessageEvents, CompMessageActions
> = ({appendToRoot, props, context, compEvent}) => {
    if (props.format !== 'text') {
        throw new NluxRenderingError({
            source: source('message', 'render'),
            message: `Unsupported format: ${props.format}! Only text is currently supported!`,
        });
    }

    const dom = render(html(props));
    if (!dom) {
        throw new NluxRenderingError({
            source: source('prompt-box', 'render'),
            message: 'Message could not be rendered',
        });
    }

    // Render and append persona photo
    let personaDom: HTMLElement | undefined;
    if (props.direction === 'in' && props.botPersona) {
        personaDom = createPersonaDom(props.botPersona);
    } else {
        if (props.direction === 'out' && props.userPersona) {
            personaDom = createPersonaDom(props.userPersona);
        }
    }

    // Render and attach persona - if provided
    const container = document.createElement('div');
    if (personaDom) {
        container.prepend(personaDom);
    }

    // Render main message HTML
    const classFromDirection = props.direction === 'in' ? 'received' : 'sent';
    let classFromLoadingStatus = `message-status-${props.loadingStatus}`;
    container.append(dom);

    // Render and attach loader
    const loaderRendered = render(loaderHtml()) as any;
    const loader = loaderRendered instanceof HTMLElement ? loaderRendered : undefined;
    if (loader && (props.loadingStatus === 'loading' || props.loadingStatus === 'connecting')) {
        container.append(loader);
    }

    container.classList.add(__('container'));
    container.classList.add(__(classFromDirection));
    container.classList.add(classFromLoadingStatus);

    const [contentContainer, removeContentContainerListeners] = listenToElement(
        container,
        `:scope > .${__('content')}`,
    )
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
            if (event && event.target && !(event.target instanceof HTMLAnchorElement)) {
                event.stopPropagation();
                event.preventDefault();
            }
        })
        .get();

    //
    // Append the container to the root
    //
    appendToRoot(container);

    //
    // Other logic related to markdown rendering and resize/scroll tracking
    //
    const {trackResize, trackDomChange} = props;
    let mdStreamRenderer: StandardStreamParserOutput | undefined;

    // Only track resize and dom change if trackResize prop is explicitly set to true.
    let resizeObserver: ResizeObserver | undefined;
    if (trackResize) {
        resizeObserver = new ResizeObserver(() => {
            compEvent('message-container-resized')();
        });

        resizeObserver.observe(contentContainer);
    }

    // Only track dom change if trackDomChange prop is explicitly set to true.
    let domChangeObserver: MutationObserver | undefined;
    if (trackDomChange) {
        domChangeObserver = new MutationObserver(() => {
            compEvent('message-container-dom-changed')();
        });

        domChangeObserver.observe(contentContainer, {
            childList: true,
            subtree: true,
            characterData: true,
        });
    }

    // Clean up DOM observers once the MD stream renderer is done rendering
    const cleanUpOnMdStreamRendererCompletion = () => {
        resizeObserver?.disconnect();
        domChangeObserver?.disconnect();

        resizeObserver = undefined;
        domChangeObserver = undefined;
        mdStreamRenderer = undefined;
    };

    return {
        elements: {
            container,
            contentContainer,
            loader,
        },
        actions: {
            focus: () => {
                contentContainer.focus();
            },
            appendContent: (content: string) => {
                if (!mdStreamRenderer) {
                    mdStreamRenderer = createMdStreamRenderer(
                        contentContainer,
                        context.syntaxHighlighter,
                        {
                            streamingAnimationSpeed: props.streamingAnimationSpeed,
                            skipAnimation: false,
                            skipCopyToClipboardButton: false,
                        },
                    );

                    mdStreamRenderer.onComplete(cleanUpOnMdStreamRendererCompletion);
                }

                mdStreamRenderer.next(content);
            },
            commitContent: () => {
                if (mdStreamRenderer?.complete) {
                    mdStreamRenderer.complete();
                }
            },
            setContentStatus: (status: MessageContentLoadingStatus) => {
                container.classList.remove(classFromLoadingStatus);
                classFromLoadingStatus = `message-status-${status}`;
                container.classList.add(classFromLoadingStatus);

                // Check status and display loader if needed
                if (loader) {
                    if (status === 'loading' || status === 'connecting') {
                        !loader.parentNode && container.append(loader);
                    } else {
                        loader.parentNode && loader.remove();
                    }
                }
            },
            updatePersona: (botPersona: BotPersona | undefined) => {
                personaDom?.remove();
                personaDom = undefined;

                if (botPersona) {
                    personaDom = createPersonaDom(botPersona);
                    if (personaDom) {
                        container.prepend(personaDom);
                    }
                }
            },
        },
        onDestroy: () => {
            removeContentContainerListeners();
            resizeObserver?.disconnect();
            domChangeObserver?.disconnect();

            resizeObserver = undefined;
            domChangeObserver = undefined;
        },
    };
};
