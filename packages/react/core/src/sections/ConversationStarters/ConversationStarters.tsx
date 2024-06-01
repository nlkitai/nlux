import {ConversationStartersProps} from './props';

export const ConversationStarters = (props: ConversationStartersProps) => {
    return (
        <div className="nlux-comp-convStrts-cntr">
            <div className="nlux-comp-convStrts">
                {props.items.map((item, index) => (
                    <div key={index} className="nlux-comp-convStrt">
                        {item.prompt}
                    </div>
                ))}
            </div>
        </div>
    );
};
