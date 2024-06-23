import {Button} from '@/components/ui/button.tsx';
import {ChatBubbleIcon} from '@radix-ui/react-icons';
import {ChevronDown} from 'lucide-react';

export const ChatTrigger = ({ pos, mode, isChatOpen, setIsChatOpen } : {
    pos: "bottom" | "center",
    mode: "popover" | "drawer" | "dialog",
    isChatOpen: boolean,
    setIsChatOpen: (val: boolean) => void
}) => (
    <Button
        size={mode === "popover" ? "icon" : "lg"}
        className={`${pos === 'bottom' ? 'absolute right-4 bottom-5' : 'mx-auto'} rounded-full z-40`}
        onClick={() => setIsChatOpen(!isChatOpen)}
    >
        {!isChatOpen ? (
            <ChatBubbleIcon className="h-4 w-4" />
        ) : (
            <ChevronDown className="h-4 w-4" />
        )}
    </Button>
);
