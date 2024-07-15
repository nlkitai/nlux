import {ChatAdapterBuilder} from './bedrock/builder/builder';
import {ChatAdapterBuilderImpl} from './bedrock/builder/builderImpl';

export const createChatAdapter = <
    AiMsg = string
>(): ChatAdapterBuilder<AiMsg> => {
    return new ChatAdapterBuilderImpl<AiMsg>();
};
