import {useWiretaps} from "../context/WiretapsContext";
import {
    Box,
    List,
    ListItemButton, Accordion, AccordionSummary, Typography, AccordionDetails, Grid
} from "@mui/material";
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import React, {useEffect, useState} from "react";
import {useMap} from "../context/MapboxContext";
import ShadowScrollbar from "./ShadowScrollbar";
import LocalityItemContent from "./item-content/LocalityItemContent";
import WiretapItemContent from "./item-content/WiretapItemContent";
import {useNavigate} from "react-router-dom";

const PopupWiretap = () => {
    const navigate = useNavigate();
    const {popupLocalityCallback, showBoundaries, hideBoundaries} = useMap();
    const {getWiretapsForLocality, getLocality} = useWiretaps();

    const [expandedLocality, setExpandedLocality] = useState(false);
    const [localities, setLocalities] = useState([]);

    useEffect(() => {
        popupLocalityCallback.current= (l_ids) => {
            if(!l_ids) setLocalities([]);
            else setLocalities(l_ids.map((id)=>getLocality(id)));
        };
        return () => {popupLocalityCallback.current = null;}
    }, []);

    useEffect(() => {
        if(localities.length !== 1) {
            setExpandedLocality(false);
            return;
        }
        setExpandedLocality(localities[0].id);
    }, [localities]);

    useEffect(() => {
        if(!expandedLocality) return;
        const osm = getLocality(expandedLocality).osm;

        showBoundaries(osm);
        return () => {
            hideBoundaries(osm);
        }
    }, [expandedLocality]);

    const handleExpandLocality = (l_id) => (event, isExpanded) => {
        setExpandedLocality(isExpanded ? l_id : false);
    };
    // frontate pls leave my brozer alone hes as is fucking burning he wana to play hearthstone


    return <>
        <div id={'PopupWiretap'} style={{display: 'none'}}>
            <Box sx={{
                width: 320
            }}>
                {localities.map((l, i) => (
                        <Accordion
                            expanded={expandedLocality === l.id}
                            onChange={handleExpandLocality(l.id)}
                            disableGutters
                            key={i}
                        >
                            <AccordionSummary
                                expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
                                sx={{
                                    flexDirection: 'row-reverse',
                                    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                                        transform: 'rotate(90deg)',
                                    },
                                    '& .MuiAccordionSummary-content': {
                                        marginLeft: 1,
                                        marginY: 0.3,
                                    }
                                }}
                            >
                                <LocalityItemContent l={l} />
                            </AccordionSummary>
                            <AccordionDetails sx={{p:0}}>
                                <ShadowScrollbar autoHeight autoHeightMax={115}>
                                    <List sx={{m:0, p:0}}>
                                        {getWiretapsForLocality(l.id).map((w, i, array) => (
                                                <ListItemButton
                                                    key={w.id}
                                                    onClick={()=>navigate(`/wiretap/${w.id}`)}
                                                    sx={{pt:0, pb: i === array.length - 1 ? 0.625 : 0}}
                                                >
                                                    <WiretapItemContent w={w} sx={{p:0, m:0}}/>
                                                </ListItemButton>
                                        ))}
                                    </List>
                                </ShadowScrollbar>
                            </AccordionDetails>
                        </Accordion>
                ))}
            </Box>
        </div>
    </>
}
export default PopupWiretap;