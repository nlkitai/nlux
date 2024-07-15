import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {Hero} from '@site/src/pages/(sections)/hero/hero';
import {Newsletter} from '@site/src/pages/(sections)/newsletter/newsletter';
import {Roadmap} from '@site/src/pages/(sections)/roadmap/roadmap';
import {Talk} from '@site/src/pages/(sections)/talk/talk';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const headerDescription = 'NLUX is an open-source, zero dependency JavaScript '
    + 'and React library for rapidly building conversational AI interfaces. Integrate with ChatGPT and other LLMs. '
    + 'Highly customizable and configurable. Get outstanding NLU performance and usability with a focus on simplicity. '
    + 'Build chatbots, voice assistants, knowledge bases, and AI frontends in minutes with NLUX.';

export default function Home(): JSX.Element {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout
            title="The Powerful Conversational AI JavaScript Library"
            description={headerDescription}
        >
            <Hero className={styles.nluxHomeSection}/>
            <Roadmap className={styles.nluxHomeSection}/>
            <Talk className={styles.nluxHomeSection}/>
            <Newsletter className={styles.nluxHomeSection}/>
        </Layout>
    );
}
