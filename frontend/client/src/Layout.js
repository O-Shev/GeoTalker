import {Box, Drawer} from "@mui/material";
import React, {useEffect} from "react";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import DrawerWrapper from "./components/DrawerWrapper";

import {useMoveMap} from "./hooks/mapbox/useMoveMap";
import {calculateFeatureWidth} from "./utils/calculateFeatureWidth";
import {useWiretaps} from "./context/WiretapsContext"
import {useMap} from "./context/MapboxContext";
import {breakpoints, featureWidthMedia, useBreakpointFeature} from "./context/BreakpointFeatureContext";


const Layout = () => {
    const navigate = useNavigate();

    const {feature, variant, breakpoint} = useBreakpointFeature();
    const {moveBack, slideBack, slideLeft, slideRight, slideLeftAndFitBounds} = useMoveMap();
    const params = useParams();
    const {getWiretap, getLocality} = useWiretaps();
    const map = useMap();

    useEffect(() => {
        return moveBack;
    }, []);



    useEffect(() => {
        const f_w = calculateFeatureWidth(breakpoints[breakpoint].featureWidth);

        let l = null;
        if(feature === 1) {
            const wiretap_id = Number(params.id);
            l = getLocality(getWiretap(wiretap_id).localityId);
            map.preventHideBoundaries.current=l.osm;
            map.showBoundaries(l.osm);
            slideLeftAndFitBounds(l.boundingBox, f_w)
        }
        else if(feature > 0) {
            switch (breakpoint) {
                case 'b':
                case 'c':
                case 'd': {
                    slideLeft(f_w);
                    break;
                }
                case 'a': {
                    //slideRight(calculateFeatureWidth(breakpoints[breakpoint].featureWidth));
                    break;
                }
            }
        }

        return ()=>{
            slideBack();
            if(l){
                map.preventHideBoundaries.current=null;
                map.hideBoundaries(l.osm)
            }
        }
    }, [feature, breakpoint]);





    return(
        <Box>
            <DrawerWrapper />
            <Drawer
                variant={variant}
                anchor={'right'}
                open={feature > 0}
                onClose={()=>navigate("/")}
                PaperProps={{
                    sx: {
                        backgroundColor: feature !== 3 ? 'rgba(100, 100, 100, 0.3)' : null,
                        height: '100%',
                        ...featureWidthMedia
                    }
                }}
            >
                <Outlet />
            </Drawer>
        </Box>
    )
}
export default Layout;

// <Box
//     sx={{
//         display: feature <= 0 ? 'none' : 'block',
//         position: 'absolute',
//         top:0,
//         right: 0,
//         backgroundColor: 'rgba(100, 100, 100, 0.3)',
//         width: '100%',
//         height: '100vh',
//         ...featureWidthMedia
//     }}
// >
//     <Outlet />
// </Box>