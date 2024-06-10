import MenuDrawer from "./MenuDrawer";
import {Box, Drawer, IconButton, Typography} from "@mui/material";
import React, {useState} from "react";
import MenuIcon from '@mui/icons-material/Menu';

const DrawerWrapper = () => {
    const [openDriver, setOpenDriver] = useState(false);
    const close = () => {
        setOpenDriver(false);
    }


    return(<>
        <Drawer
            open={openDriver}
            onClose={()=>{setOpenDriver(false)}}
        >
            <MenuDrawer close={()=> close()} />
        </Drawer>
        <Box sx={{display: 'flex', flexDirection: 'row', ml:1, mt:1}}>
            <IconButton
                aria-label="open driver"
                onClick={()=> setOpenDriver(true)}
            >
                <MenuIcon color={'info'} fontSize={'large'}/>
            </IconButton>
            <Typography variant={'h4'} sx={{color: '#dad8d8', pl:1, mt:0.7}} >GeoTalker</Typography>
        </Box>
    </>)
}

export default DrawerWrapper;