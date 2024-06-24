import { ConversationStarter } from "../../types/conversationStarter";
import { ConversationStartersProps } from "./props";

export const ConversationStarters = (props: ConversationStartersProps) => {
  const { onConversationStarterSelected } = props;
  return (
    <div className="nlux-comp-conversationStarters">
      {props.items.map((conversationStarter, index) => (
        <button
          key={index}
          className="nlux-comp-conversationStarter"
          onClick={() => onConversationStarterSelected(conversationStarter)}
        >
          <ConversationStarterIcon icon={conversationStarter.icon} />
          <span className="nlux-comp-conversationStarter-prompt">
            {conversationStarter.label ?? conversationStarter.prompt}
          </span>
        </button>
      ))}
    </div>
  );
};

export const ConversationStarterIcon = ({
  icon,
}: {
  icon: ConversationStarter["icon"];
}) => {
  if (!icon) return null;
  if (typeof icon === "string") return <img src={icon} width={16} />;
  return icon;
};
