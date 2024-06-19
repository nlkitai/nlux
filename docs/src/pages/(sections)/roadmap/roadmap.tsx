import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './roadmap.module.css';
import {FeatureImplemented} from '@site/src/pages/(sections)/roadmap/featureImplemented';
import {FeatureToImplement} from '@site/src/pages/(sections)/roadmap/featureToImplement';

export const Roadmap = ({className}: { className?: string }) => {
    return (
        <div className={clsx(styles.roadmapContainer, className)}>
            <h2 className={styles.roadmapTitle}>
                Feature Roadmap
            </h2>
            <p className={styles.roadmapDescription}>
                Over the past months since launching <code>NLUX</code>, we&apos;ve been heads-down delivering rapid
                value.
                Here&apos;s a quick overview of some key features that we&apos;ve already built, and a glimpse of
                what&apos;s to come:
            </p>
            <div>
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/reference/ui/ai-chat"
                    text="AI Chat Component"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/examples/react-js-ai-assistant"
                    text="React Support"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/learn/get-started/vercel-ai"
                    text="Next.js Support"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/learn/adapters/hugging-face/overview"
                    text="Hugging Face Adapter"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/learn/adapters/langchain/overview"
                    text="LangChain LangServe Adapters"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/learn/adapters/custom-adapters/create-custom-adapter"
                    text="Custom Adapters"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/examples/assistant-persona"
                    text="Assistant and User Personas"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/examples/markdown-streaming"
                    text="Markdown Streaming"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/examples/syntax-highlighter"
                    text="Syntax Highlighter"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/reference/ui/events"
                    text="Event Listeners"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/examples/conversation-history"
                    text="Conversation History"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/learn/context-aware-conversations"
                    text="Context-Aware Conversations"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/examples/conversation-starters"
                    text="Conversation Starters"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/learn/customize-theme"
                    text="Advanced Theming"
                />
                <FeatureToImplement>Function Calling</FeatureToImplement>
                <FeatureToImplement>File Uploads</FeatureToImplement>
                <FeatureToImplement>Enhanced Accessibility</FeatureToImplement>
                <FeatureToImplement>Voice Chat</FeatureToImplement>
                <FeatureToImplement>[&nbsp;
                    Add Your Feature Request
                    &nbsp;]
                </FeatureToImplement>
            </div>
            <p style={{textAlign: 'center'}}>
                <div>
                    Community members are welcome to contribute to the roadmap<br/>
                    by submitting feature requests on our&nbsp;
                    <Link href="https://discord.com/invite/SRwDmZghNB">Discord</Link> server or via <Link
                    href="https://github.com/nlkitai/nlux/issues">GitHub issues</Link>.<br/>
                </div>
                <div style={{marginTop: '8px'}}>
                    For companies seeking prioritized feature requests and support,<br/>
                    please consider our&nbsp;
                    <Link href="https://nlkit.com/enterprise">Enterprise package</Link>.
                </div>
            </p>
        </div>
    );
};
