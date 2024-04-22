import {createLoaderDom} from '../../../../../../shared/src/ui/Loader/create';
import {getChatSegmentClassName} from '../../../../../../shared/src/utils/dom/getChatSegmentClassName';
import {CompRenderer} from '../../../types/comp';
import {
    CompChatSegmentActions,
    CompChatSegmentElements,
    CompChatSegmentEvents,
    CompChatSegmentProps,
} from './chatSegment.types';

export const renderChatSegment: CompRenderer<
    CompChatSegmentProps, CompChatSegmentElements, CompChatSegmentEvents, CompChatSegmentActions
> = ({
    props,
    compEvent,
    appendToRoot,
}) => {

    // Create container
    let loaderContainer: HTMLElement | undefined;
    const container = document.createElement('div');
    container.className = getChatSegmentClassName(props.status);

    const showLoader = () => {
        if (!loaderContainer) {
            loaderContainer = document.createElement('div');
            loaderContainer.className = 'nlux-chtSgm-ldr-cntr';

            const loaderDom = createLoaderDom();
            loaderContainer.appendChild(loaderDom);
            container.appendChild(loaderContainer);
            compEvent('loader-shown')(loaderContainer);
        }
    };

    const hideLoader = () => {
        if (loaderContainer) {
            loaderContainer.remove();
            loaderContainer = undefined;
            compEvent('loader-hidden')();
        }
    };

    if (props.status === 'active') {
        showLoader();
    }

    appendToRoot(container);
    compEvent('chat-segment-ready')();

    return {
        elements: {
            chatSegmentContainer: container,
            loaderContainer: loaderContainer,
        },
        actions: {
            showLoader,
            hideLoader,
        },
        onDestroy: () => {
            container.remove();
        },
    };
};
