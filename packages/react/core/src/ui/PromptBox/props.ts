import {PromptBoxStatus} from '../../../../../shared/src/ui/PromptBox/props';

export type PromptBoxProps = {
    status: PromptBoxStatus;
    prompt?: string;
    placeholder?: string;
    autoFocus?: boolean;

    hasValidInput?: boolean;
    submitShortcut?: 'Enter' | 'CommandEnter';

    onChange?: (value: string) => void;
    onSubmit?: () => void;
};
