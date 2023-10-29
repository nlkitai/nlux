import {ConversationOptions} from '../core/options/conversationOptions.ts';
import {MessageOptions} from '../core/options/messageOptions.ts';
import {PromptBoxOptions} from '../core/options/promptBoxOptions.ts';

export type NluxProps = Partial<{
    themeId?: string;
    containerMaxHeight?: number;
    promptBoxOptions?: Partial<PromptBoxOptions>;
    messageOptions?: Partial<MessageOptions>;
    conversationOptions?: Partial<ConversationOptions>;
}>;
