import {ParticipantRole} from '../../../../js/core/src/index';

const defaultAiName = 'AI';
const defaultHumanName = 'You';

export const participantNameFromRoleAndPersona = (
    role: ParticipantRole,
    personaOptions: {
        // Only using names as PersonaOptions differs between React and Vanilla JS
        bot?: { name?: string };
        user?: { name?: string }
    } | undefined
): string => {
    if (role === 'ai') {
        return personaOptions?.bot?.name ?? defaultAiName;
    }

    if (role === 'user') {
        return personaOptions?.user?.name ?? defaultHumanName;
    }

    return '';
};
