import {useEffect, useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useColorMode} from '@docusaurus/theme-common';
import {CodeEditor} from '@site/src/components/CodeEditor/CodeEditor';
import exampleIntroFileSendFunction from '@site/src/pages/(examples)/intro/send';
import exampleIntroFileAiChatBot from '@site/src/pages/(examples)/intro/example';
import exampleIntroFilePersonas from '@site/src/pages/(examples)/intro/personas';
import styles from '@site/src/pages/index.module.css';
import borderStyles from './border.module.css';
import heroStyles from '@site/src/pages/(sections)/hero/hero.module.css';
import Heading from '@theme/Heading';

const NluxLogoLight = '/nlux/images/logos/nlux/black.png';
const NluxLogoDark = '/nlux/images/logos/nlux/white.png';
const JavaScriptLogo = '/nlux/images/logos/platforms/javascript-logo-60pxh.png';
const ReactJsLogo = '/nlux/images/logos/platforms/react-js-logo-60pxh.png';
const LangChainLogo = '/nlux/images/logos/platforms/langchain-logo-60pxh.png';
const NextJsLogoDark = '/nlux/images/logos/platforms/nextjs-logo-dark-120pxh.png';
const NextJsLogoLight = '/nlux/images/logos/platforms/nextjs-logo-light-120pxh.png';
const OpenAiLogo = '/nlux/images/logos/platforms/openai-logo-60pxh.png';
const AdapterLogo = '/nlux/images/logos/platforms/adapters-logo-60pxh.png';
const HuggingFaceLogo = '/nlux/images/logos/platforms/hugging-face-logo-60pxh.png';

export const Hero = ({className}: { className?: string }) => {
    const {colorMode} = useColorMode();
    const [nluxLogoForHeroBanner, setLogo] = useState(
        colorMode === 'dark' ? NluxLogoDark : NluxLogoLight,
    );

    useEffect(() => {
        setLogo(colorMode === 'dark' ? NluxLogoDark : NluxLogoLight);
    }, [colorMode]);

    const NextJsLogo = colorMode === 'dark' ? NextJsLogoDark : NextJsLogoLight;

    return (
        <header className={clsx(heroStyles.heroBanner, className)}>
            <div className={clsx('container', heroStyles.heroContent)}>
                <div className={heroStyles.heroTitleContainer}>
                    <Heading as="h1" className={heroStyles.heroTitle}>
                        <img src={nluxLogoForHeroBanner} alt="NLUX logo" width={200}/>
                        <a
                            href="https://github.com/nlkitai/nlux"
                            target="_blank"><img
                            src={'https://img.shields.io/badge/Free%20%26%20Open%20Source-%2348c342'}/></a>
                    </Heading>
                    <div className={heroStyles.heroSubtitleContainer}>
                        <p className={clsx('hero__subtitle', heroStyles.heroSubtitleContent)}>
                            The <strong>Powerful</strong> Conversational AI<br/>
                            JavaScript Library
                        </p>
                    </div>
                    <div className={heroStyles.adaptersShowcase}>
                        <div className={heroStyles.integrationsTitle}>
                            Available in
                        </div>
                        <div className={heroStyles.platformName}>
                            <img src={ReactJsLogo} alt="React JS Logo" width={40}/>
                            <h5 style={{textAlign: 'left'}}>React JS<br/>Components</h5>
                        </div>
                        <div className={heroStyles.platformName}>
                            <img src={JavaScriptLogo} alt="Vanilla JS Logo" width={40}/>
                            <h5 style={{textAlign: 'left'}}>Plain<br/>JavaScript</h5>
                        </div>
                        <div className={heroStyles.platformName}>
                            <img src={NextJsLogo} alt="Next.js Logo" height={60}/>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={heroStyles.adaptersShowcase}>
                        <div className={heroStyles.integrationsTitle}>
                            Integrates with
                        </div>
                        <div className={heroStyles.platformName}>
                            <img src={LangChainLogo} alt="LangChain Logo" width={60}/>
                            <h5 style={{textAlign: 'left'}}>LangChain</h5>
                        </div>
                        <div className={heroStyles.platformName}>
                            <img src={HuggingFaceLogo} alt="Hugging Face Logo" width={40}/>
                            <h5 style={{textAlign: 'left'}}>Hugging&nbsp;Face</h5>
                        </div>
                        <div className={heroStyles.platformName}>
                            <img src={OpenAiLogo} alt="OpenAI Logo" width={40}/>
                            <h5 style={{textAlign: 'left'}}>OpenAI</h5>
                        </div>
                        <div className={heroStyles.platformName}>
                            <img src={AdapterLogo} alt="Adapters Logo" width={40}/>
                            <h5 style={{textAlign: 'left'}}>Any AI Backend</h5>
                        </div>
                    </div>
                </div>
                <div className={styles.buttons}>
                    <Link
                        className={`shinyButton button button--primary button--lg ${borderStyles.shinyButton}`}
                        to="/learn/get-started"
                    >
                        <div>
                            Get Started Now
                        </div>
                    </Link>
                </div>
                <div className={styles.nluxInAction}>
                    <CodeEditor
                        className={styles.codeEditor}
                        direction="row"
                        files={{
                            'App.tsx': exampleIntroFileAiChatBot,
                            'send.ts': exampleIntroFileSendFunction,
                            'personas.tsx': exampleIntroFilePersonas,
                        }}
                        editorHeight={420}
                        simulatedPrompt="How an AI assistant can enhance my website's user experience?"
                    />
                </div>
            </div>
        </header>
    );
};