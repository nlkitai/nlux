import {ReactNode, useMemo} from 'react';
import {WelcomeDefaultMessageComp} from '../../components/DefaultWelcomeMessage/WelcomeDefaultMessageComp';
import {WelcomeMessageComp} from '../../components/WelcomeMessage/WelcomeMessageComp';
import {ConversationStarters} from '../ConversationStarters/ConversationStarters';
import {LaunchPadProps} from './props';

export type LaunchPadCompType = <AiMsg>(
    props: LaunchPadProps<AiMsg>,
) => ReactNode;

export const LaunchPad: LaunchPadCompType = (props) => {
    const {
        segments,
        personaOptions,
        conversationOptions,
    } = props;

    const hasMessages = useMemo(() => segments.some((segment) => segment.items.length > 0), [segments]);
    const showWelcomeDefaultMessage = useMemo(
        () => !hasMessages && personaOptions?.assistant === undefined && conversationOptions?.showWelcomeMessage !== false,
        [hasMessages, personaOptions?.assistant, conversationOptions?.showWelcomeMessage],
    );

    const showWelcomeMessage = useMemo(
        () => !hasMessages && personaOptions?.assistant !== undefined && conversationOptions?.showWelcomeMessage !== false,
        [hasMessages, personaOptions?.assistant, conversationOptions?.showWelcomeMessage],
    );

    const showConversationStarters = useMemo(
        () => !hasMessages && conversationOptions?.conversationStarters && conversationOptions?.conversationStarters.length > 0,
        [hasMessages, conversationOptions?.conversationStarters],
    );

    return (
        <>
            {showWelcomeDefaultMessage && (
                <WelcomeDefaultMessageComp/>
            )}
            {showWelcomeMessage && (
                <WelcomeMessageComp
                    name={personaOptions!.assistant!.name}
                    avatar={personaOptions!.assistant!.avatar}
                    message={personaOptions!.assistant!.tagline}
                />
            )}
            <div className="nlux-conversationStarters-container">
                {showConversationStarters && (
                    <ConversationStarters
                        items={conversationOptions!.conversationStarters ?? []}
                        onConversationStarterSelected={props.onConversationStarterSelected}
                    />
                )}
            </div>
        </>
    );
};
