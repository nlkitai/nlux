import styles from './newsletter.module.css';

export const Newsletter = () => {
    return (
        <div className={styles.newsletterContainer}>
            <h3>Don’t Miss Out ― Get nlux Updates 💌</h3>
            <p>
                Must-know news on major releases, key features and relevant updates.<br />
                Only big and vital announcements. No spam, ever.
            </p>
            <div className={styles.newsletterIframeContainer}>
                <iframe src="//eepurl.com/iHMVLc" width="480" height="350"
                        style={{border: 'none', borderRadius: '10px', background: 'transparent'}} frameBorder="0"
                        scrolling="no"></iframe>
            </div>
        </div>
    );
};
