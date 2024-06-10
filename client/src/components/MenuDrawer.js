import {
    Avatar,
    Box,
    Button, ButtonBase, Card,
    Divider, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Menu, MenuItem,
    Paper, Stack,
    Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import React from "react";
import {useNavigate} from "react-router-dom";
import {useUserAccountContext} from "../context/UserAccountContext";
import {Logout} from "@mui/icons-material";
import axios from "axios";
import {enqueueSnackbar} from "notistack";
import {logoutUserAccount} from "../api/apiCore";


const MenuDrawer = ({close}) => {
    const navigate = useNavigate();
    const {isAuthorized, userAccount, loadUserAccount} = useUserAccountContext();



    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleUserAccountClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogoutClick = () => {
        logoutUserAccount()
            .then((response)=>{
                console.log(response);
            })
            .catch((error)=>{
                console.log(error);
            })
            .finally(()=>{
                loadUserAccount()
                setAnchorEl(null)
            });
    };




    return (
        <Paper
            square
            sx={{
                backgroundColor: 'rgb(33,33,33)',
                height: '100%',
                width: 250,
                py:2,
                px:1
            }}
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Typography variant={'h5'} sx={{color: '#dad8d8', pl:1}} >GeoTalker</Typography>
            <Box
                style={{
                    flex: 1,
                    overflowY: 'auto',
                }}
                sx={{
                    mt: 2
                }}
            >
                <Button disabled={!isAuthorized} fullWidth startIcon={<AddIcon />} sx={{ justifyContent: 'flex-start' }} onClick={() => {navigate("/addGeoChat"); close()}}>Add telegram chat</Button>
            </Box>
            <Divider />
            <Button color='secondary' startIcon={<InfoIcon />} sx={{ justifyContent: 'flex-start' }} onClick={()=>{enqueueSnackbar('not implement yet', { variant : 'info' })}}>About project</Button>
            <Button color='secondary'  startIcon={<VolunteerActivismIcon />} sx={{ justifyContent: 'flex-start' }} onClick={()=>{enqueueSnackbar('not implement yet', { variant : 'info' })}}>Donate</Button>
            <Divider />
            {isAuthorized ?
                <>
                    <ButtonBase
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleUserAccountClick}
                    >
                        <ListItem sx={{py: 0, px:0.5}}>
                            <ListItemAvatar>
                                {userAccount.profilePhoto ? <Avatar src={userAccount.profilePhoto} alt={userAccount.name ? userAccount.name[0] : 'A'} /> : <Avatar children={userAccount?.username ? userAccount.username[0] : 'A'}/>}
                            </ListItemAvatar>
                            <ListItemText
                                primary={userAccount.name}
                                secondary={userAccount.email}
                                primaryTypographyProps={{
                                    noWrap: true,
                                }}
                                primaryTypographyProps={{
                                    noWrap: true,
                                }}
                            />
                        </ListItem>
                    </ButtonBase>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleLogoutClick}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </>
                :
                <Box>
                    <Box sx={{mt:1, mb:2, color: '#f6f6f6'}}>
                        <Typography variant={'subtitle2'}>Sign up or log in for add telegram chat on map</Typography>
                        {/*<Typography variant={'body2'}>Add new telegram chat on map, save chats to bookmarks</Typography>*/}
                    </Box>
                    <Stack spacing={1}>
                        <Button fullWidth variant='contained' color='info' onClick={()=>{navigate(`/authorize/register`); close()}}>sign up</Button>
                        <Button fullWidth variant='outlined' color='info' onClick={()=>{navigate(`/authorize/login`); close()}}>sign in</Button>
                    </Stack>
                </Box>
            }
        </Paper>
    )
}

export default MenuDrawer;