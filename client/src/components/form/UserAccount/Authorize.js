import React, { useState } from 'react';
import {Avatar, Box, Button, Card, Container, Divider, Grid, IconButton, Link, Paper, Typography} from '@mui/material';
import Register from "./Register";
import {ArrowBack} from "@mui/icons-material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useNavigate, useParams} from "react-router-dom";
import Login from "./Login";
import Copyright from "../../Copyright";
import {useGoogleLogin} from "@react-oauth/google";
import axios from "axios";
import {enqueueSnackbar} from "notistack";
import {useUserAccountContext} from "../../../context/UserAccountContext";
import {loginUserAccountOAuth2} from "../../../api/apiCore";


const Authorize = () => {
    const navigate = useNavigate();
    const {variant} = useParams();
    const {loadUserAccount} = useUserAccountContext();


    const close = () => {
        navigate('/');
    }

    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: accessToken => {
            accessToken['registrationId'] = 'GOOGLE';
            loginUserAccountOAuth2(accessToken)
                .then((response) => {
                    console.log(response)
                    enqueueSnackbar('Login successful', { variant : 'success' });
                    navigate('/');
                    loadUserAccount();
                })
                .catch((error) => {
                    console.log(error)
                })
        },
    });

    // const googleLogin = async () => {
    //     try {
    //         const response = await axios.get('/auth/google');
    //         console.log(response)
    //         // window.location.href = response.data.redirectUrl;
    //     } catch (error) {
    //         console.error('Error initiating Google login:', error);
    //     }
    // }


    return (
        <Box
            sx={{
                px: 4,
                py: 2,
                height: `100vh`,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <IconButton onClick={close} sx={{ alignSelf: 'flex-start' }}>
                <ArrowBack />
            </IconButton>
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    py: 2
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                {variant === 'login' ?
                    <Login />
                : variant === 'register' ?
                    <Register />
                : null
                }
                <Divider orientation="horizontal" sx={{ width: '100%', mt: 4, mb: 2}}>
                    <Typography variant="body1" sx={{ px: 2 }}>OR</Typography>
                </Divider>
                <Button
                    fullWidth
                    startIcon={<img src="/googleIcon.svg" alt="G" style={{height: '18px'}}/>}
                    onClick={googleLogin}
                    variant="outlined"
                >Continue with google</Button>
            </Box>
            <Copyright />
        </Box>
    );
};


export default Authorize;