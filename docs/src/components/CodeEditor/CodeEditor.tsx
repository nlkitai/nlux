import {useColorMode} from '@docusaurus/theme-common';
import { useMemo } from 'react';
import {
    SandpackProvider,
    SandpackLayout,
    SandpackPreview,
    SandpackCodeEditor,
} from "@codesandbox/sandpack-react";
import { SandpackFiles } from '@codesandbox/sandpack-react';

import indexHtmlContent from './indexHtml';
import indexTsxContent from './indexTsx';
import simulatorTsContent from './simulatorJs';

export type CodeEditorProps = {
    className?: string;
    simulatedPrompt?: string;
    editorHeight?: number;
    direction?: 'row' | 'column';
    files: SandpackFiles;
}

export const CodeEditor = ({
    className,
    simulatedPrompt,
    editorHeight = 420,
    files,
    direction = 'column',
}: CodeEditorProps) => {
    const { colorMode } = useColorMode();
    const setPromptIntoSimulator = useMemo(() => {
        if (!simulatedPrompt) return '';
        return `setTimeout(() => { nluxSimulator?.setPrompt("${simulatedPrompt}"); }, 1000);`;
    }, [simulatedPrompt]);

    const uid = useMemo(() => Math.random().toString(36).substring(7), [colorMode]);

    return (
        <SandpackProvider
            key={uid}
            className={className}
            template="react-ts"
            theme={colorMode}
            options={{
                recompileDelay: 250,
                visibleFiles: Object.keys(files) as Array<any>,
            }}
            customSetup={{
                dependencies: {
                    "react": "^18.2.0",
                    "react-dom": "^18.2.0",
                    "@nlux/react": "beta",
                    "@nlux/langchain-react": "beta",
                    "@nlux/themes": "beta",
                    "@nlux/highlighter": "beta",
                },
            }}
            files={{
                ...files,
                'public/index.html': indexHtmlContent(colorMode),
                'index.tsx': indexTsxContent,
                'Simulator.ts': `${simulatorTsContent}\n${setPromptIntoSimulator}`,
            }}
        >
            <SandpackLayout style={{
                flexDirection: direction,
                height: direction === 'row' ? 'auto' : editorHeight * 2,
            }}>
                <SandpackPreview
                    style={{ height: editorHeight }}
                    showNavigator={false}
                    showOpenInCodeSandbox={true}
                    showRefreshButton={true}
                    showRestartButton={true}
                />
                <SandpackCodeEditor
                    style={{ height: editorHeight }}
                    showTabs
                    showLineNumbers={true}
                    showInlineErrors
                    wrapContent
                    closableTabs={false}
                />
            </SandpackLayout>
        </SandpackProvider>
    )
};
