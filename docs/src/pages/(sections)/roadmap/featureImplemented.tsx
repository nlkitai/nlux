import Link from '@docusaurus/Link';
import {useColorMode} from '@docusaurus/theme-common';

export const FeatureImplemented = ({ href, text, suffix } : any = {})  => {
    const { colorMode } = useColorMode();
    const isInDarkMode = colorMode === 'dark';
    const textDecorationColor = isInDarkMode ? 'rgba(200, 200, 200, 0.7)' : 'rgba(90, 90, 90, 0.7)';

    return (
        <h4 style={{
            flexGrow: 1,
            flexShrink: 0,
            textAlign: 'left',
            alignItems: 'start',
        }}>
            ✔️
            &nbsp;
            <span style={{
                fontWeight: '500',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(90, 90, 90, 0.7)',
                textDecorationThickness: '2px',
                flexGrow: 1,
            }}>
                <Link color="secondary.dark" href={href} target="_blank">{text}</Link>
            </span>
            {suffix && <span style={{fontSize: '1.5rem'}}>&nbsp;{suffix}</span>}
        </h4>
    );
};
