import {useEffect, useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useColorMode} from '@docusaurus/theme-common';
import {CodeEditor} from '@site/src/components/CodeEditor/CodeEditor';
import exampleIntroFileStreamAdapter from '@site/src/pages/(examples)/intro/adapter';
import exampleIntroFileAiChatBot from '@site/src/pages/(examples)/intro/aiChatBot';
import exampleIntroFilePersonas from '@site/src/pages/(examples)/intro/personas';
import styles from '@site/src/pages/index.module.css';
import heroStyles from '@site/src/pages/(sections)/hero/hero.module.css';
import Heading from '@theme/Heading';

const NluxLogoLight = '/nlux/logo/nlux-hero-logo-light.png';
const NluxLogoDark = '/nlux/logo/nlux-hero-logo-dark.png';
const JavascriptLogo = '/nlux/images/platform-logos/javascript-logo-60pxh.png';
const ReactJsLogo = '/nlux/images/platform-logos/react-js-logo-60pxh.png'
const LangChainLogo = '/nlux/images/platform-logos/langchain-logo-60pxh.png';
const OpenAiLogo = '/nlux/images/platform-logos/openai-logo-60pxh.png';
const HuggingFaceLogo = '/nlux/images/platform-logos/hugging-face-logo-60pxh.png'

export const Hero = ({className}: {className?: string}) => {
    const { colorMode } = useColorMode();
    const [nluxLogoForHeroBanner, setLogo] = useState(
        colorMode === 'dark' ? NluxLogoDark : NluxLogoLight
    );

    useEffect(() => {
        setLogo(colorMode === 'dark' ? NluxLogoDark : NluxLogoLight);
    }, [colorMode]);

    return (
        <header className={clsx(heroStyles.heroBanner, className)}>
            <div className={clsx('container', heroStyles.heroContent)}>
                <Heading as="h1" className={heroStyles.heroTitle}>
                    <img src={nluxLogoForHeroBanner} alt="NLUX logo" width={120}/>
                    <a
                        style={{marginTop: '50px'}}
                        href="https://github.com/nluxai/nlux"
                        target="_blank"><img src={'https://img.shields.io/badge/Free%20%26%20Open%20Source-%2348c342'}/></a>
                </Heading>
                <div className={heroStyles.heroSubtitleContainer}>
                    <p className={clsx('hero__subtitle', heroStyles.heroSubtitleContent)}>
                        The Open-Source Javascript Library
                        To Build Conversational AI Interfaces
                    </p>
                </div>
                <div className={heroStyles.adaptersShowcase}>
                    <div className={heroStyles.platformName}>
                        <img src={LangChainLogo} alt="LangChain Logo" width={40}/>
                        <h5 style={{textAlign: 'left'}}>LangChain<br/>Adapters</h5>
                    </div>
                    <div className={heroStyles.platformName}>
                        <img src={HuggingFaceLogo} alt="Hugging Face Logo" width={40}/>
                        <h5 style={{textAlign: 'left'}}>Hugging&nbsp;Face<br/>Adapters</h5>
                    </div>
                    <div className={heroStyles.platformName}>
                        <img src={OpenAiLogo} alt="OpenAI Logo" width={40}/>
                        <h5 style={{textAlign: 'left'}}>OpenAI<br/>Adapters</h5>
                    </div>
                    <div className={heroStyles.platformName}>
                        <img src={JavascriptLogo} alt="Vanilla JS Logo" width={40}/>
                        <h5 style={{textAlign: 'left'}}>Javascript<br/>API</h5>
                    </div>
                    <div className={heroStyles.platformName}>
                        <img src={ReactJsLogo} alt="React JS Logo" width={40}/>
                        <h5 style={{textAlign: 'left'}}>React JS<br/>Components</h5>
                    </div>
                </div>
                <div className={styles.buttons}>
                    <Link
                        className="button button--primary button--lg"
                        to="/learn/get-started"
                    >
                        Get Started
                    </Link>
                    <Link
                        className="button button--primary button--lg"
                        to="/examples/react-js-ai-chatbot"
                    >
                        Examples
                    </Link>
                    <Link
                        className="button button--primary button--lg"
                        to="/api/overview"
                    >
                        API Reference
                    </Link>
                </div>
                <div className={styles.nluxInAction}>
                    <p>
                        <strong><code>@nlux/react</code> in action</strong> 👇 ―
                        You can edit the code below to see how it works.
                    </p>
                    <CodeEditor
                        className={styles.codeEditor}
                        direction="row"
                        files={{
                            'App.tsx': exampleIntroFileAiChatBot(colorMode),
                            'adapter.ts': exampleIntroFileStreamAdapter,
                            'personas.tsx': exampleIntroFilePersonas,
                        }}
                        editorHeight={420}
                        simulatedPrompt="How can AI chatbots improve the user experience on my website?"
                    />
                </div>
            </div>
        </header>
    );
};