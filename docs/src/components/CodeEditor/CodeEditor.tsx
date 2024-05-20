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
    const setPromptIntoSimulator = useMemo(() => {
        if (!simulatedPrompt) return '';
        return `setTimeout(() => { nluxSimulator?.setPrompt("${simulatedPrompt}"); }, 1000);`;
    }, [simulatedPrompt]);

    return (
        <SandpackProvider
            className={className}
            template="react-ts"
            theme="light"
            options={{
                recompileDelay: 250,
                visibleFiles: Object.keys(files) as Array<any>,
            }}
            customSetup={{
                dependencies: {
                    "react": "^18.2.0",
                    "react-dom": "^18.2.0",
                    "@nlux/react": "latest",
                    "@nlux/langchain-react": "latest",
                    "@nlux/themes": "latest",
                    "@nlux/highlighter": "latest",
                },
            }}
            files={{
                ...files,
                'public/index.html': indexHtmlContent,
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
