const MessageContentWrapper = ({ children, disableBottom, disableTop }) => {
    if (disableBottom && disableTop) {
        return <div style={{overflow: 'hidden', position: 'relative' }}>{children}</div>;
    } else if (disableBottom && !disableTop) {
        return (
            <div style={{
                backgroundColor: '#f0f0f0',
                borderRadius: '15px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {children}
            </div>
        );
    } else {
        return (
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{
                    backgroundColor: '#f0f0f0',
                    borderRadius: '15px 15px 15px 0',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {children}
                </div>
                <svg width="9" height="20" viewBox="0 -3 9 20"
                     style={{
                         position: 'absolute',
                         bottom: 0,
                         left: -9,
                     }}>
                    <path
                        d="M3 17h6V0c-.193 2.84-.876 5.767-2.05 8.782-.904 2.325-2.446 4.485-4.625 6.48A1 1 0 003 17z"
                        fill="#f0f0f0"
                    />
                </svg>
            </div>
        );
    }
};

export default MessageContentWrapper;
