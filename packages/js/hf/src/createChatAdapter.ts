import {ChatAdapterBuilder} from './hf/builder/builder';
import {ChatAdapterBuilderImpl} from './hf/builder/builderImpl';

export const createChatAdapter = <AiMsg = string>(): ChatAdapterBuilder<AiMsg> => {
    return new ChatAdapterBuilderImpl<AiMsg>();
};
