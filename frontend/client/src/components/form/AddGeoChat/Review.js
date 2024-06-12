import {Avatar, Box, Card, ToggleButton, Typography} from "@mui/material";
import React, {useEffect} from "react";
import {useMap} from "../../../context/MapboxContext";


const Review = ({interlink, locality}) => {
    const {
        showBoundaries,
        hideBoundaries,
        fitBounds
    } = useMap();

    const l = locality.value;
    const commaIndex = l.displayName.indexOf(',');
    const firstElement = commaIndex > 0 ? l.displayName.substring(0, commaIndex).trim() : l.displayName;
    const secondElement = commaIndex > 0 ? l.displayName.substring(commaIndex + 1).trim() : null;
    useEffect(() => {
        if(!locality.value) return;
        showBoundaries(locality.value.osm);
        fitBounds(locality.value.boundingBox);
        return () => {
            hideBoundaries(locality.value.osm);
        };
    }, []);
    return <>
        <Box>
            <Card elevation={10}
                  sx={{
                      p: 3,
                      mb: 2,
                      textAlign:"center",
                  }}
            >
                <Avatar
                    alt='Avatar'
                    src={interlink.preview.photoUrl}
                    sx={{
                        width: '122px',
                        height: '122px',
                        margin: 'auto'
                    }}
                />
                <Typography variant='h6'>{interlink.preview.title}</Typography>
                <Typography variant='subtitle1' gutterBottom>{interlink.preview.extra}</Typography>
                <Typography variant='body1'>{interlink.preview.description}</Typography>
            </Card>
            <Card
                elevation={10}
            >
                <Typography sx={{
                    width: '100%',
                    textAlign: 'left',
                    py: 0.7,
                    px: 1.5
                }}
                >
                    <Typography variant='inherit' sx={{fontWeight: 'bold'}}>{firstElement}</Typography>
                    <Typography variant='subtitle2'>{secondElement}</Typography>
                </Typography>
            </Card>
        </Box>
    </>
}
export default  Review;