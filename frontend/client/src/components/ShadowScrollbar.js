import React, { useRef, useEffect, forwardRef  } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

const ShadowScrollbar = forwardRef(({ style, ...props }, ref) => {
    const scrollbarsRef = useRef(null);
    const shadowTopRef = useRef(null);
    const shadowBottomRef = useRef(null);

    useEffect(() => {
        if (ref) {
            ref.current = scrollbarsRef.current;
        }
    }, [ref]);

    const handleUpdate = (values) => {
        const { scrollTop, scrollHeight, clientHeight } = values;

        const shadowTop = shadowTopRef.current;
        const shadowBottom = shadowBottomRef.current;

        const shadowTopOpacity = 1 / 20 * Math.min(scrollTop, 20);
        const bottomScrollTop = scrollHeight - clientHeight;
        const shadowBottomOpacity = 1 / 20 * (bottomScrollTop - Math.max(scrollTop, bottomScrollTop - 20));

        if (shadowTop) {
            shadowTop.style.opacity = shadowTopOpacity;
        }
        if (shadowBottom) {
            shadowBottom.style.opacity = shadowBottomOpacity;
        }
    };

    const containerStyle = {
        ...style,
        position: 'relative'
    };

    const shadowTopStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 10,
        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%)'
    };

    const shadowBottomStyle = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 10,
        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%)'
    };

    return (
        <div style={containerStyle}>
            <Scrollbars
                ref={scrollbarsRef}
                onUpdate={handleUpdate}
                {...props}
            />
            <div
                ref={shadowTopRef}
                style={shadowTopStyle}
            />
            <div
                ref={shadowBottomRef}
                style={shadowBottomStyle}
            />
        </div>
    );
});

export default ShadowScrollbar;
