import {ConversationStartersProps} from './props';

export const ConversationStarters = (props: ConversationStartersProps) => {
    return (
        <div>
            {props.items.map((item, index) => (
                <div key={index} className="nlux-comp-convStrt">
                    {item.prompt}
                </div>
            ))}
        </div>
    )
};
