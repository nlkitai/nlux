import styles from './roadmap.module.css';
import {FeatureImplemented} from '@site/src/pages/(sections)/roadmap/featureImplemented';
import {FeatureToImplement} from '@site/src/pages/(sections)/roadmap/featureToImplement';

export const Roadmap = () => {
    return (
        <div className={styles.roadmapContainer}>
            <h2 className={styles.roadmapTitle}>
                Feature Roadmap
            </h2>
            <p className={styles.roadmapDescription}>
                Over the past months since launching <code>NLUX</code>, we&apos;ve been heads-down delivering rapid value.
                Here&apos;s a quick overview of some key features that we&apos;ve already built, and a glimpse of what&apos;s to come:
            </p>
            <div>
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/api/ui/ai-chat"
                    text="AI Chat Component"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/examples/react-js-ai-chatbot"
                    text="React JS Support"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/learn/adapters/open-ai/chat-gpt"
                    text="ChatGPT Adapter"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/learn/adapters/hugging-face/overview"
                    text="Hugging Face Adapter"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/learn/adapters/custom-adapters/create-custom-adapter"
                    text="Custom LLM Adapters"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/examples/bot-persona"
                    text="Bot and User Personas"
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
                    href="https://docs.nlkit.com/nlux/examples/customized-theme"
                    text="Theme Customization"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/api/ui/events"
                    text="Event Listeners"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/learn/adapters/langchain/overview"
                    text="LangChain Adapters"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/examples/conversation-history"
                    text="Conversation History Hydration"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/learn/context-aware-conversations"
                    text="Context-Aware Conversations"
                    suffix="⭐️"
                />
                <FeatureImplemented
                    href="https://docs.nlkit.com/nlux/learn/context-aware-conversations"
                    text="Co-Pilot Mode"
                />
                <FeatureToImplement>File Uploads</FeatureToImplement>
                <FeatureToImplement>Voice Chat</FeatureToImplement>
                <FeatureToImplement>Enhanced Accessibility</FeatureToImplement>
                <FeatureToImplement>Advanced Theming</FeatureToImplement>
            </div>
        </div>
    )
};
