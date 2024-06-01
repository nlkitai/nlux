import {ChatSegmentStatus} from '@shared/types/chatSegment/chatSegment';
import {debug} from '@shared/utils/debug';
import {getChatSegmentClassName} from '@shared/utils/dom/getChatSegmentClassName';
import {CompUpdater} from '../../../types/comp';
import {CompChatSegmentActions, CompChatSegmentElements, CompChatSegmentProps} from './chatSegment.types';

export const updateChatSegment: CompUpdater<
    CompChatSegmentProps, CompChatSegmentElements, CompChatSegmentActions
> = ({propName, newValue, dom}) => {
    if (propName === 'status') {
        const rootContainer: HTMLElement | undefined = dom.elements?.chatSegmentContainer;
        if (!rootContainer) {
            return;
        }

        const newStatus = newValue as ChatSegmentStatus;
        rootContainer.className = getChatSegmentClassName(newStatus);
        if (newStatus === 'active') {
            dom.actions?.showLoader();
        } else {
            dom.actions?.hideLoader();
        }
    }

    if (propName === 'uid') {
        debug('updateChatSegment — uid is not updatable');
        // Do nothing
    }
};
