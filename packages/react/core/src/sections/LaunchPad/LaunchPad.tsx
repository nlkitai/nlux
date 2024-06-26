import {warnOnce} from '@shared/utils/warn';
import {ReactNode, useEffect, useMemo} from 'react';
import {DefaultGreetingComp} from '../../components/DefaultGreeting/DefaultGreetingComp';
import {GreetingComp, GreetingContainer} from '../../components/Greeting/GreetingComp';
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
        userDefinedGreeting,
    } = props;

    const hasMessages = useMemo(() => segments.some((segment) => segment.items.length > 0), [segments]);
    const showDefaultGreeting = useMemo(
        () => !userDefinedGreeting // Only show the default greeting if the user has not provided a custom greeting
            && !hasMessages
            && personaOptions?.assistant === undefined
            && conversationOptions?.showWelcomeMessage !== false,
        [
            hasMessages,
            personaOptions?.assistant,
            conversationOptions?.showWelcomeMessage,
            userDefinedGreeting,
        ],
    );

    const showGreetingFromPersonaOptions = useMemo(
        () => !userDefinedGreeting
            && !hasMessages
            && personaOptions?.assistant !== undefined
            && conversationOptions?.showWelcomeMessage !== false,
        [
            userDefinedGreeting,
            hasMessages,
            personaOptions?.assistant,
            conversationOptions?.showWelcomeMessage,
        ],
    );

    const showConversationStarters = useMemo(
        () => !hasMessages && conversationOptions?.conversationStarters && conversationOptions?.conversationStarters.length > 0,
        [hasMessages, conversationOptions?.conversationStarters],
    );

    const showUserDefinedGreeting = useMemo(
        () => userDefinedGreeting !== undefined && conversationOptions?.showWelcomeMessage !== false,
        [userDefinedGreeting],
    );

    useEffect(() => {
        if (userDefinedGreeting && conversationOptions?.showWelcomeMessage === false) {
            warnOnce(
                'Configuration conflict: The greeting UI override provided via <AiChatUI.Greeting> will not be shown ' +
                'because conversationOptions.showWelcomeMessage is set to false.'
            );
        }
    }, [
        conversationOptions?.showWelcomeMessage,
        userDefinedGreeting,
    ]);

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
            {showUserDefinedGreeting && (
                <GreetingContainer>
                    {userDefinedGreeting}
                </GreetingContainer>
            )}
            {!showDefaultGreeting && !showGreetingFromPersonaOptions && !showUserDefinedGreeting && (
                <GreetingContainer>{null}</GreetingContainer>
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
