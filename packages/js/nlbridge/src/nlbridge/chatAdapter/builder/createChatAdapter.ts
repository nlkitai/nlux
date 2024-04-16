import {ChatAdapterBuilder} from './builder';
import {ChatAdapterBuilderImpl} from './builderImpl';

export const createChatAdapter = <MessageType>(): ChatAdapterBuilder<MessageType> => new ChatAdapterBuilderImpl<MessageType>();
