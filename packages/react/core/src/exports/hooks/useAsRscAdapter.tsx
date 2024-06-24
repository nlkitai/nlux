import {ChatAdapter} from '../../types/chatAdapter';

export const useAsRscAdapter = function <AiMsg = string>(): ChatAdapter<AiMsg> {

    // This feature is only available in the packaged version of NLUX published on NPM.
    // Please reference to documentation for more information on how to use it in your project.

    throw new Error('useAsRscAdapter() is not included in the public repository of NLUX at the moment. You still can ' +
        'use the feature (RSC and Gen UI) via @nlux/react package, and as documented in the official documentation. ' +
        'If you are interested in the implementation details, you can reach out to the NLUX team via Discord or email.'
    );
};
