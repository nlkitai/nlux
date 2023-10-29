import {CompUpdater} from '../../../types/comp';
import {CompChatRoomActions, CompChatRoomElements, CompChatRoomProps} from './types';

export const updateChatRoom: CompUpdater<CompChatRoomProps, CompChatRoomElements, CompChatRoomActions> = ({
    propName,
    newValue,
    dom: {elements, actions},
}) => {
    if (propName === 'visible') {
        if (elements?.chatRoomContainer) {
            elements.chatRoomContainer.style.display = newValue ? '' : 'none';
        }
        return;
    }

    if (propName === 'containerMaxHeight' && elements?.chatRoomContainer) {
        elements.chatRoomContainer.style.maxHeight = typeof newValue === 'number' ? `${newValue}px` : '';
        return;
    }
};
