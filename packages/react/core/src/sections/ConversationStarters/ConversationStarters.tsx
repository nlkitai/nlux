import {ConversationStartersProps} from './props';

export const ConversationStarters = (props: ConversationStartersProps) => {
    const {onConversationStarterSelected} = props;
    return (
        <div className="nlux-comp-convStrts-cntr">
            <div className="nlux-comp-convStrts">
                {props.items.map((conversationStarter, index) => (
                    <button
                        key={index}
                        className="nlux-comp-convStrt"
                        onClick={() => onConversationStarterSelected(conversationStarter)}
                    >
                        {conversationStarter.prompt}
                    </button>
                ))}
            </div>
        </div>
    );
};
