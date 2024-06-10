import {useMap} from "../../../context/MapboxContext";
import React, {useEffect, useState} from "react";
import {
    Box,
    ButtonBase,
    Card, CardContent,
    CircularProgress,
    IconButton,
    Paper, Stack,
    TextField,
    ToggleButton, ToggleButtonGroup,
    Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {getPlacesByLngLat, getPlacesByStr} from "../../../api/apiCore";


const fetchAbortTimeout = 30000;
const ChooseLocality = ({state, isLoading, setIsLoading}) => {
    const {
        map,
        showBoundaries,
        hideBoundaries,
        fitBounds,
        preventHideBoundaries
    } = useMap();

    const clickHandler = (e) => {
        fetchLocalities(e.lngLat);
        state.setInputValue(e.lngLat.lng.toString() + ", " + e.lngLat.lng.toString())
    };
    useEffect(() => {
        if (map.current) {
            map.current.on('click', clickHandler);
            return () => {
                map.current.off('click', clickHandler);
            };
        }
    }, []);
    useEffect(() => {
        if(!state.value) return;
        preventHideBoundaries.current = state.value.osm;
        showBoundaries(state.value.osm);
        fitBounds(state.value.boundingBox);
        return () => {
            preventHideBoundaries.current = null;
            hideBoundaries(state.value.osm);
        };
    }, [state.value]);
    const fetchLocalities = (query) => {
        if(!query) return;
        state.setValue(null);
        state.clean();

        const fetchByLngLat = (lngLat) => {
            setIsLoading(true);
            getPlacesByLngLat({ longitude: lngLat.lng, latitude: lngLat.lat })
                .then((response) => {
                    state.setPreview(response.data);
                    console.log(response)
                })
                .catch((error) => {
                    if(error && error.response && error.response.data && (typeof error.response.data === 'string')) state.setError(error.response.data);
                    else state.setError("Internal server error");
                })
                .finally(() => {
                    setIsLoading(false);
                    state.setIsChecked(true);
                });
        }
        const fetchByString = (q) => {
            setIsLoading(true);
            getPlacesByStr({q})
                .then((response) => {
                    state.setPreview(response.data);
                })
                .catch((error) => {
                    if(error && error.response && error.response.data && (typeof error.response.data === 'string')) state.setError(error.response.data);
                    else state.setError("Internal server error");
                })
                .finally(() => {
                    setIsLoading(false);
                    state.setIsChecked(true);
                });
        }

        const regexLngLat = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
        if(query.lng && query.lat) fetchByLngLat(query);
        else if(regexLngLat.test(query)){
            const [lng, lat] = query.split(",").map(coord => parseFloat(coord.trim()));
            fetchByLngLat({lng, lat});
        } else fetchByString(query);
    };
    const handleInputChange = (e) => {
        state.setInputValue(e.target.value);
        if(state.isChecked) {
            state.clean();
            state.setValue(null);
        }
    };
    const handleSearch = () => {
        if(isLoading) return;
        if (state.isChecked){
            state.clean();
            state.setValue(null);
        } else {
            fetchLocalities(state.inputValue)
        }
    };
    const SearchButton = () => (
        <IconButton onClick={handleSearch} disabled={isLoading}>
            {isLoading ? (
                <CircularProgress size={20} />
            ) : state.isChecked ? (
                <CloseIcon />
            ) : (
                <SearchIcon />
            )}
        </IconButton>
    )
    const LocalityPreview = () => {
    if(!state.preview) return null;
    return (
        <Box
            sx={{
                overflowY: "auto",
            }}
        >
            <Stack spacing={2}>
                {state.preview.map((l, index) => {
                    const commaIndex = l.displayName.indexOf(',');
                    const firstElement = commaIndex > 0 ? l.displayName.substring(0, commaIndex).trim() : l.displayName;
                    const secondElement = commaIndex > 0 ? l.displayName.substring(commaIndex + 1).trim() : null;

                    return (
                        <Card
                            elevation={10}
                            key={index}
                        >
                            <ToggleButton
                                value={l}
                                onChange={(event, newValue) => {state.setValue(newValue);}}
                                selected={state.value && state.value.osm === l.osm}
                                color={'primary'}
                                fullWidth
                                sx={{
                                    textTransform: 'none',
                                    p:0
                                }}
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
                            </ToggleButton >
                        </Card>
                    )
                })}
            </Stack>
        </Box>
    );
}
    return (
        <Stack spacing={3}>
            <Card elevation={10}>
                <TextField
                    value={state.inputValue}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    InputProps={{endAdornment: <SearchButton />}}
                    helperText={state.error}
                    error={state.error}
                    fullWidth
                    variant="outlined"
                    placeholder="type or click on the map"
                    size="small"
                />
            </Card>
            <LocalityPreview/>
        </Stack>
    );
}

export default ChooseLocality


// const LocalityPreview = () => {
//     if(!state.preview) return null;
//     return (
//         <Box
//             sx={{
//                 my: 3,
//                 maxHeight: `calc(100vh - 300px)`,
//                 overflowY: "auto",
//             }}
//         >
//             {state.preview.map((l, index) => {
//                 const commaIndex = l.displayName.indexOf(',');
//                 const firstElement = commaIndex > 0 ? l.displayName.substring(0, commaIndex).trim() : l.displayName;
//                 const secondElement = commaIndex > 0 ? l.displayName.substring(commaIndex + 1).trim() : null;
//
//                 return (
//                     <Card
//                         elevation={10}
//                         sx={{
//                             marginBottom: '20px',
//                             backgroundColor: (state.value && state.value.osm) && state.value.osm === l.osm ? '#c01111' : null,
//                         }}
//                     >
//                         <ButtonBase
//                             key={index}
//                             onClick={()=>{state.setValue(l)}}
//                             sx={{width: '100%'}}
//                         >
//                             <Box sx={{
//                                 width: '100%',
//                                 textAlign: 'left',
//                                 py: 0.7,
//                                 px: 2
//                             }}
//                             >
//                                 <Typography variant='inherit' sx={{fontWeight: 'bold'}}>{firstElement}</Typography>
//                                 <Typography variant='subtitle2'>{secondElement}</Typography>
//                             </Box>
//                         </ButtonBase >
//                     </Card>
//                 )
//             })}
//         </Box>
//     );
// }