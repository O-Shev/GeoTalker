import {
    Box, ButtonBase, Collapse,
    IconButton, Paper,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import WiretapItemContent from "./item-content/WiretapItemContent";
import {useWiretaps} from "../context/WiretapsContext";
import TelegramChat from "./telegram-chat/TelegramChat";
import {ArrowBack} from "@mui/icons-material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useNavigate, useParams} from "react-router-dom";

const Wiretap = () => {
    const params = useParams();
    const id = Number(params.id);
    const navigate = useNavigate();
    const close = () => {
        navigate('/');
    }
    const {getWiretapDetails, getWiretap} = useWiretaps();
    const wiretap = getWiretap(id);

    const [wiretapDetails, setWiretapDetails] = useState(null);
    const [expandedDetails, setExpandedDetails] = useState(false);


    useEffect(() => {
        const f = async () => {
            setWiretapDetails(await getWiretapDetails(id));
        }
        f();
    }, []);

    const handleBackButtonClick = (event) => {
        // Prevent the event from bubbling up to the accordion
        event.stopPropagation();
        close();
    };

    return <>
        <Box
            sx={{
                width: '100%',
                height: `100%`,
                display: 'flex',
                flexDirection: 'column',
            }}
        >

            <Paper
                square
                elevation={0}
                sx={{
                    display: 'flex',
                    px:2
                }}
            >
                <ButtonBase
                    disableRipple
                    disableTouchRipple
                    onClick={()=>setExpandedDetails(!expandedDetails)}
                    sx={{width: '100%'}}
                >
                    <IconButton
                        edge="start"
                        aria-label="back"
                        sx={{ px: 1.5 }}
                        onClick={handleBackButtonClick}
                    >
                        <ArrowBack />
                    </IconButton>
                    <div style={{
                        width: '100%'
                    }}>
                        <WiretapItemContent w={wiretap} sx={{p:0, m:0, width: 300}}/>
                    </div>
                    <ExpandMoreIcon sx={{
                        transform: !expandedDetails ? 'rotate(0deg)' : 'rotate(180deg)',
                        transition: 'transform 0.3s ease'
                    }}/>
                </ButtonBase>
            </Paper>
            <div style={{flex: 1, overflowY: 'auto'}}>
                <Collapse
                    in={expandedDetails}
                    timeout="auto"
                    sx={{
                        zIndex: 99,
                        position: 'absolute',
                        width: '100%'
                    }}
                >
                    <Paper
                        square
                        elevation={0}
                        sx={{p:3, pl:9}}
                    >
                        <Typography variant='body2'>
                            <div dangerouslySetInnerHTML={{__html: wiretapDetails ? wiretapDetails.description.replace(/\n/g, '<br>') : null}}/>
                        </Typography>
                    </Paper>
                </Collapse>
                {expandedDetails ?
                    <div style={{
                        zIndex: 98,
                        position: 'fixed',
                        width: '100%',
                        height: '100%',
                        backgroundColor: `rgba(0, 0, 0, 0.35)`
                    }}></div>
                    : null
                }
                <TelegramChat wiretap={wiretap}/>
            </div>
        </Box>
    </>
}

export default Wiretap;


// <Accordion
//     disableGutters
//     style={{
//         borderRadius: 0,
//         boxShadow: 'none',
//         position: 'relative', // Ensure Accordion has relative positioning
//         zIndex: 1,
//     }}
// >
//     <AccordionSummary
//         sx={{
//             borderRadius:0,
//             '& .MuiAccordionSummary-content': {
//                 marginY: 0.3,
//             }
//         }}
//     >
//         <IconButton
//             edge="start"
//             aria-label="back"
//             sx={{ marginRight: 1 }}
//             onClick={handleBackButtonClick}
//         >
//             <ArrowBack />
//         </IconButton>
//         <WiretapItemContent w={wiretap} sx={{p:0, m:0, width: 300}}/>
//     </AccordionSummary>
//
//     <AccordionDetails style={{}}>
//         <Typography variant='body2'>
//             <div dangerouslySetInnerHTML={{__html: wiretapDetails ? wiretapDetails.description.replace(/\n/g, '<br>') : null}}/>
//         </Typography>
//     </AccordionDetails>
// </Accordion>