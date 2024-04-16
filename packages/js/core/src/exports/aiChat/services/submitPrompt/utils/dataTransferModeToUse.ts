import {ChatAdapter, DataTransferMode} from '../../../../../types/adapters/chat/chatAdapter';
import {isStandardChatAdapter, StandardChatAdapter} from '../../../../../types/adapters/chat/standardChatAdapter';

export const getDataTransferModeToUse = (adapter: ChatAdapter | StandardChatAdapter): DataTransferMode => {
    const supportedDataTransferModes: DataTransferMode[] = [];
    if (adapter.streamText !== undefined) {
        supportedDataTransferModes.push('stream');
    }
    if (adapter.fetchText !== undefined) {
        supportedDataTransferModes.push('fetch');
    }

    const adapterAsStandardAdapter: StandardChatAdapter | undefined = isStandardChatAdapter(adapter as any) ?
        adapter as any : undefined;

    const adapterDataTransferMode: DataTransferMode | undefined = adapterAsStandardAdapter?.dataTransferMode
        ?? undefined;

    const defaultDataTransferMode = supportedDataTransferModes.length === 1
        ? supportedDataTransferModes[0]
        : 'stream';

    return adapterDataTransferMode ?? defaultDataTransferMode;
};
