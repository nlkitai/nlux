import {useColorMode} from '@docusaurus/theme-common';
import {useMemo} from 'react';
import {
    SandpackCodeEditor,
    SandpackFiles,
    SandpackLayout,
    SandpackPreview,
    SandpackProvider,
} from '@codesandbox/sandpack-react';

import indexHtmlContent from './indexHtml';
import indexTsxContent from './indexTsx';
import simulatorTsContent from './simulatorJs';

export type CodeEditorProps = {
    className?: string;
    previewOnly?: boolean;
    simulatedPrompt?: string | false;
    editorHeight?: number;
    direction?: 'row' | 'column';
    files: Record<string, string | ((colorScheme: 'light' | 'dark') => string)>;
}

export const CodeEditor = ({
                               className,
                               simulatedPrompt,
                               previewOnly = false,
                               editorHeight = 420,
                               files,
                               direction = 'column',
                           }: CodeEditorProps) => {
    const {colorMode} = useColorMode();
    const setPromptIntoSimulator = useMemo(() => {
        if (simulatedPrompt === false) {
            return '';
        }

        const promptToType = simulatedPrompt || 'How can AI chatbots improve the user experience on my website?';
        return `setTimeout(() => { nluxSimulator?.enableSimulator();\n nluxSimulator?.setPrompt("${promptToType}"); }, 1000);\n`;
    }, [simulatedPrompt]);

    const uid = useMemo(() => Math.random().toString(36).substring(7), [colorMode]);
    const filesContent: SandpackFiles = {};

    for (const [key, value] of Object.entries(files)) {
        filesContent[key] = typeof value === 'function' ? value(colorMode) : value;
    }

    return (
        <SandpackProvider
            key={uid}
            className={className}
            template="react-ts"
            theme={colorMode}
            options={{
                recompileDelay: 500,
                visibleFiles: Object.keys(files) as Array<any>,
                initMode: 'lazy',
            }}
            customSetup={{
                dependencies: {
                    'react': '^18',
                    'react-dom': '^18',
                    '@nlux/react': '^2',
                    '@nlux/langchain-react': '^2',
                    '@nlux/themes': '^2',
                    '@nlux/highlighter': '^2',
                },
            }}
            files={{
                ...filesContent,
                'public/index.html': indexHtmlContent(colorMode),
                'index.tsx': indexTsxContent,
                'simulator.ts': `${simulatorTsContent}\n${setPromptIntoSimulator}`,
            }}
        >
            <SandpackLayout style={{
                flexDirection: direction,
                height: direction === 'row' ? 'auto' : (previewOnly ? editorHeight : editorHeight * 2),
            }}>
                <SandpackPreview
                    style={{height: editorHeight}}
                    showNavigator={false}
                    showOpenInCodeSandbox={true}
                    showRefreshButton={true}
                    showRestartButton={true}
                />
                {!previewOnly && (
                    <SandpackCodeEditor
                        style={{height: editorHeight}}
                        showTabs
                        showLineNumbers={true}
                        showInlineErrors
                        wrapContent
                        closableTabs={false}
                    />
                )}
            </SandpackLayout>
        </SandpackProvider>
    );
};
