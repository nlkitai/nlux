import {ChatAdapter, DataTransferMode} from '../../../types/adapters/chat/chatAdapter';
import {isStandardChatAdapter, StandardChatAdapter} from '../../../types/adapters/chat/standardChatAdapter';

export const getDataTransferModeToUse = <AiMsg>(
    adapter: ChatAdapter<AiMsg> | StandardChatAdapter<AiMsg>,
): DataTransferMode => {
    const supportedDataTransferModes: DataTransferMode[] = [];
    if (adapter.streamText !== undefined) {
        supportedDataTransferModes.push('stream');
    }
    if (adapter.batchText !== undefined) {
        supportedDataTransferModes.push('batch');
    }

    const adapterAsStandardAdapter: StandardChatAdapter<AiMsg> | undefined = isStandardChatAdapter(
        adapter,
    ) ? adapter as StandardChatAdapter<AiMsg> : undefined;

    const adapterDataTransferMode: DataTransferMode | undefined = adapterAsStandardAdapter?.dataTransferMode
        ?? undefined;

    const defaultDataTransferMode = supportedDataTransferModes.length === 1
        ? supportedDataTransferModes[0]
        : 'stream';

    return adapterDataTransferMode ?? defaultDataTransferMode;
};
