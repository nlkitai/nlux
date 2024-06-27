export default `import * as setup from './setup';

type LastMessageProps = {
    message?: string;
};

const LastMessage = ({ message } : LastMessageProps) => {
    if (!message) {
        return (
            <div style={setup.lastMessageReceivedStyle}>
                <span style={{ fontSize: '0.8em', color: '#808080' }}>No new messages received yet.</span>
            </div>
        );
    }

    return (
        <div style={setup.lastMessageReceivedStyle}>
            {message && (
                <strong>Last message received:</strong>
            )}
            <p style={{ color: '#808080' }}>{message}</p>
        </div>
    );
};

export default LastMessage;
`;
