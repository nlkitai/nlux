import {useColorMode} from '@docusaurus/theme-common';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import {CodeEditor} from '@site/src/components/CodeEditor/CodeEditor';
import exampleIntroFileAiChatBot from '@site/src/pages/(examples)/intro/example';
import exampleIntroFilePersonas from '@site/src/pages/(examples)/intro/personas';
import exampleIntroFileSendFunction from '@site/src/pages/(examples)/intro/send';
import styles from '@site/src/pages/index.module.css';
import previewsStyle from './previews.module.css';

const getCategories = (colorScheme) => ([
    {
        name: 'NLUX with React',
        content: (
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
        )
    },
    {
        name: 'Generative UI With Next.js',
        content: (
            <iframe
                style={{
                    width: 840,
                    maxWidth: '100%',
                    height: 520,
                }}
                src={`https://genui-demo-rho.vercel.app/`}
            ></iframe>
        )
    },
    {
        name: 'ChatGPT-Inspired UI',
        content: (
            <iframe
                style={{
                    width: 840,
                    maxWidth: '100%',
                    height: 520,
                }}
                src={`https://nlux-shadcn-chatgpt-ui.vercel.app/?colorScheme=${colorScheme}`}
            ></iframe>
        )
    },
]);

export default function Previews() {
    const {colorMode} = useColorMode();
    const categories = getCategories(colorMode === 'dark' ? 'dark' : 'light');

    return (
        <div>
            <div>
                <TabGroup>
                    <TabList className={previewsStyle.tabList}>
                        {categories.map(({ name }) => (
                            <Tab key={name} className={previewsStyle.tab}>
                                {name}
                            </Tab>
                        ))}
                    </TabList>
                    <TabPanels>
                        {categories.map(({ name, content }) => (
                            <TabPanel key={name}>
                                {content}
                            </TabPanel>
                        ))}
                    </TabPanels>
                </TabGroup>
            </div>
        </div>
    )
}
