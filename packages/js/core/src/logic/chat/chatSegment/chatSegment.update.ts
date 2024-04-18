import {ChatSegmentStatus} from '../../../../../../shared/src/types/chatSegment/chatSegment';
import {debug} from '../../../../../../shared/src/utils/debug';
import {getChatSegmentClassName} from '../../../../../../shared/src/utils/dom/getChatSegmentClassName';
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

        rootContainer.className = getChatSegmentClassName(newValue as ChatSegmentStatus);
    }

    if (propName === 'uid') {
        debug('updateChatSegment — uid is not updatable');
        // Do nothing
    }
};
