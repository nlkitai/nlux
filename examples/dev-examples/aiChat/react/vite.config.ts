import react from '@vitejs/plugin-react';
import {getSharedViteConfig} from '../../sharedViteConfig';

export default getSharedViteConfig(
    '../../../..',
    true,
    [react()],
);
