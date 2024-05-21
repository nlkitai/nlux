import clsx from 'clsx';
import styles from './talk.module.css';

export const Talk = ({className}: {className?: string}) => {
    return (
        <div className={clsx(styles.youtubeTalkContainer, className)}>
            <h2 className={styles.talkTitle}>
                Building Context-Aware AI Assistants<br />
                With React JS and <code>NLUX</code>
            </h2>
            <p className={styles.talkDescription}>
                Learn more ― Watch the presentation of <code>NLUX</code> founder at React Advanced London
                where he talks about the future of conversational AI and how to build
                context-aware AI apps with NLUX and React JS.
            </p>
            <iframe width="560" height="315"
                    src="https://www.youtube-nocookie.com/embed/iI95_WTdtao?si=AGvd5Z3U7B51vWPA"
                    title="YouTube video player" frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen></iframe>
        </div>
    );
};
