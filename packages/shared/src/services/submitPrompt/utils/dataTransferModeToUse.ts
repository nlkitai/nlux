import {ChatAdapter as CoreChatAdapter, DataTransferMode} from '../../../types/adapters/chat/chatAdapter';
import {ServerComponentChatAdapter} from '../../../types/adapters/chat/serverComponentChatAdapter';
import {isStandardChatAdapter, StandardChatAdapter} from '../../../types/adapters/chat/standardChatAdapter';

export const getDataTransferModeToUse = <AiMsg>(
    adapter: CoreChatAdapter<AiMsg> | ServerComponentChatAdapter<AiMsg> | StandardChatAdapter<AiMsg>,
): DataTransferMode => {
    const supportedDataTransferModes: DataTransferMode[] = [];
    const adapterAsCoreAdapter: CoreChatAdapter<AiMsg> | undefined = adapter as CoreChatAdapter<AiMsg> | undefined;
    const adapterAsEsmAdapter: ServerComponentChatAdapter<AiMsg> | undefined = adapter as ServerComponentChatAdapter<AiMsg> | undefined;

    if (adapterAsCoreAdapter?.streamText !== undefined || adapterAsEsmAdapter?.streamServerComponent !== undefined) {
        supportedDataTransferModes.push('stream');
    }
    if (adapterAsCoreAdapter?.batchText !== undefined) {
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
