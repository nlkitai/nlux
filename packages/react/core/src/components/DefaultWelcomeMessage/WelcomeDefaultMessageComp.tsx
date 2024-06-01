import {useMemo} from 'react';
import {getNluxSmallPngLogo} from '../../../../../shared/src/components/Logo/getNluxSmallPngLogo';
import {WelcomeMessageComp} from '../WelcomeMessage/WelcomeMessageComp';

// Default message to show when no messages are present in the chat room
// and when no assistant persona is configured.
export const WelcomeDefaultMessageComp = () => {
    const urlEncodedLogo = useMemo(() => getNluxSmallPngLogo(), []);
    return (
        <WelcomeMessageComp avatar={urlEncodedLogo} name={''}/>
    );
};
