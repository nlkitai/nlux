import {ReactNode, useMemo} from 'react';
import {DefaultGreetingComp} from '../../components/DefaultGreeting/DefaultGreetingComp';
import {GreetingComp} from '../../components/Greeting/GreetingComp';
import {ConversationStarters} from '../../components/ConversationStarters/ConversationStarters';
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
    const showDefaultGreeting = useMemo(
        () => !hasMessages && personaOptions?.assistant === undefined && conversationOptions?.showWelcomeMessage !== false,
        [hasMessages, personaOptions?.assistant, conversationOptions?.showWelcomeMessage],
    );

    const showGreetingFromPersonaOptions = useMemo(
        () => !hasMessages && personaOptions?.assistant !== undefined && conversationOptions?.showWelcomeMessage !== false,
        [hasMessages, personaOptions?.assistant, conversationOptions?.showWelcomeMessage],
    );

    const showConversationStarters = useMemo(
        () => !hasMessages && conversationOptions?.conversationStarters && conversationOptions?.conversationStarters.length > 0,
        [hasMessages, conversationOptions?.conversationStarters],
    );

    return (
        <>
            {showDefaultGreeting && (
                <DefaultGreetingComp/>
            )}
            {showGreetingFromPersonaOptions && (
                <GreetingComp
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
