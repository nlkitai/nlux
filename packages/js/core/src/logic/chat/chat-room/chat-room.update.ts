import {CompUpdater} from '../../../types/comp';
import {CompChatRoomActions, CompChatRoomElements, CompChatRoomProps} from './chat-room.types';

export const updateChatRoom: CompUpdater<CompChatRoomProps<unknown>, CompChatRoomElements, CompChatRoomActions> = ({
    propName,
    newValue,
    dom: {elements},
}) => {
};
