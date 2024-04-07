import {CompUpdater} from '../../../types/comp';
import {CompChatRoomActions, CompChatRoomElements, CompChatRoomProps} from './chat-room.types';

export const updateChatRoom: CompUpdater<CompChatRoomProps, CompChatRoomElements, CompChatRoomActions> = ({
    propName,
    newValue,
    dom: {elements},
}) => {
    if (propName === 'containerMaxHeight' && elements?.chatRoomContainer) {
        elements.chatRoomContainer.style.maxHeight = typeof newValue === 'number'
            ? `${newValue}px`
            : (typeof newValue === 'string' ? newValue : '');
        return;
    }

    if (propName === 'containerHeight' && elements?.chatRoomContainer) {
        elements.chatRoomContainer.style.height = typeof newValue === 'number'
            ? `${newValue}px`
            : (typeof newValue === 'string' ? newValue : '');
        return;
    }

    if (propName === 'containerMaxWidth' && elements?.chatRoomContainer) {
        elements.chatRoomContainer.style.maxWidth = typeof newValue === 'number'
            ? `${newValue}px`
            : (typeof newValue === 'string' ? newValue : '');
        return;
    }

    if (propName === 'containerWidth' && elements?.chatRoomContainer) {
        elements.chatRoomContainer.style.width = typeof newValue === 'number'
            ? `${newValue}px`
            : (typeof newValue === 'string' ? newValue : '');
        return;
    }
};
