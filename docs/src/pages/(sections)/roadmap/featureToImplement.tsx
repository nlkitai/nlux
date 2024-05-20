export const FeatureToImplement = ({ children } : any = {})  => {
    return (
        <h4 style={{
            flexGrow: 1,
            flexShrink: 0,
            textAlign: 'left',
            alignItems: 'start',
        }}>
            <span style={{
                display: 'inline-block',
                aspectRatio: '1.2',
                borderRadius: '20%',
                border: '3px solid #505050',
                width: '1em',
                height: '1em',
                marginRight: '0.5em',
            }}></span>
            &nbsp;
            <span style={{
                fontWeight: '500',
            }}>
                {children}
            </span>
        </h4>
    );
};
