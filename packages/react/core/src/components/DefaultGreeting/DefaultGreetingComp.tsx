import {useMemo} from 'react';
import {getNluxSmallPngLogo} from '@shared/components/Logo/getNluxSmallPngLogo';
import {GreetingComp} from '../Greeting/GreetingComp';

// Default message to show when no messages are present in the chat room
// and when no assistant persona is configured.
export const DefaultGreetingComp = () => {
    const urlEncodedLogo = useMemo(() => getNluxSmallPngLogo(), []);
    return (
        <GreetingComp avatar={urlEncodedLogo} name={''}/>
    );
};
