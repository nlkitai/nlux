import {ChatAdapterBuilder} from './hf/builder/builder';
import {ChatAdapterBuilderImpl} from './hf/builder/builderImpl';

export const createChatAdapter = <MessageType>(): ChatAdapterBuilder<MessageType> => new ChatAdapterBuilderImpl<MessageType>();
