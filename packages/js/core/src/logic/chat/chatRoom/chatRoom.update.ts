import {AnyAiMsg} from '../../../../../../shared/src/types/anyAiMsg';
import {CompUpdater} from '../../../types/comp';
import {CompChatRoomActions, CompChatRoomElements, CompChatRoomProps} from './chatRoom.types';

export const updateChatRoom: CompUpdater<CompChatRoomProps<AnyAiMsg>, CompChatRoomElements, CompChatRoomActions> = (
    {
        propName,
        newValue,
        dom: {elements},
    }) => {
};
