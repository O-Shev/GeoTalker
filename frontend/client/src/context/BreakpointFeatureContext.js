import {createContext, useContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

export const breakpoints = {
    a: {
        minWidth: 0,
        featureWidth: '100%'
    },
    b: {
        minWidth: 700,
        featureWidth: '55%'
    },
    c: {
        minWidth: 800,
        featureWidth: '440px'
    },
    d: {
        minWidth: 1257,
        featureWidth: '35%'
    },
}

const paths = {
    0: '^/$',
    1: '^/wiretap/.*',
    2: '^/addGeoChat$',
    3: '^/authorize/.*',
};
const variants = {
    persistent: [0, 1, 2],
    temporary: [3]
};
export const featureWidthMedia = Object.entries(breakpoints).reduce((acc, [key, value]) => {
    acc[`@media (min-width: ${value.minWidth}px)`] = { width: value.featureWidth };
    return acc;
}, {});




const context = createContext(null);
export const BreakpointFeatureProvider = ({children}) => {
    const [featureOpen, setFeatureOpen] = useState(false);
    const [feature, setFeature] = useState(-1);
    const [breakpoint, setBreakpoint] = useState('a');
    const [variant, setVariant] = useState(null);
    const [regExpPaths, setRegExpPaths] = useState({});

    const location = useLocation();
    const navigate = useNavigate();

    const toDoMatch = () => {
        let f = -1;
        for (const [key, value] of Object.entries(regExpPaths)) {
            if(value.test(location.pathname)) {
                f = key;
                break;
            }
        }

        f = parseInt(f);
        setFeature(f);

        if(variants){
            let v = null;
            for (const [key, value] of Object.entries(variants)) {
                value.forEach(vv => {
                    if(vv === f) v = key;
                })
            }

            setVariant(v);
        }


        if(f <= 0) setFeatureOpen(false)
        else setFeatureOpen(true)
    }

    useEffect(() => {
        const newRegExpPaths = {};
        for (const [key, value] of Object.entries(paths)) {
            newRegExpPaths[key] = new RegExp(value);
        }
        setRegExpPaths(newRegExpPaths);



        const handleResize = () => {
            const windowWidth = window.innerWidth;
            let breakpoint = 'a';
            for (const key in breakpoints) {
                if (windowWidth >= breakpoints[key].minWidth) {
                    breakpoint = key;
                }
            }
            setBreakpoint(breakpoint);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (Object.keys(regExpPaths).length > 0) {
            toDoMatch();
        }
    }, [regExpPaths]);

    useEffect(() => {
        toDoMatch();
    }, [location.pathname]);


    const goHome = () => {
        setFeatureOpen(false);

        setTimeout(() => {
            navigate('/');
        }, 500);
    }

    return (
        <context.Provider value={{
            feature,
            variant,
            breakpoint,
            featureOpen
        }} >
            {children}
        </context.Provider>
    );
};

export const useBreakpointFeature = () => useContext(context);