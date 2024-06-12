import * as yup from 'yup';
import {useFormik} from "formik";
import {Box, Button, Grid, Link, TextField, Typography} from "@mui/material";
import axios from "axios";
import React, {useState} from "react";
import {LoadingButton} from "@mui/lab";
import {useNavigate} from "react-router-dom";
import {enqueueSnackbar} from "notistack";
import {useUserAccountContext} from "../../../context/UserAccountContext";
import {loginUserAccountUrl} from "../../../api/apiCore";


const validationSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .required('Password is required'),
});
const Login = () => {
    const {loadUserAccount} = useUserAccountContext();
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, { setSubmitting, setErrors }) => {
            axios
                .request({
                    method: "POST",
                    url: loginUserAccountUrl(),
                    data: values
                })
                .then((response) => {
                    enqueueSnackbar('Login successful', { variant : 'success' });
                    navigate('/');
                    loadUserAccount();
                })
                .catch((error) => {
                    if (error.response && error.response.status === 401) {

                        setErrors({ password: error.response.data});
                    } else {
                        setErrors({ password: "Something went wrong" });
                        enqueueSnackbar('Login error: something went wrong', { variant : 'error' });
                        console.log(error);
                    }
                })
                .finally(()=>{
                    setSubmitting(false);
                })
        },
    });


    return (
        <>
            <Typography component="h1" variant="h5">Sign in</Typography>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    margin="normal"
                    id="email"
                    name="email"
                    label="Email"
                    disabled={formik.isSubmitting}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    disabled={formik.isSubmitting}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
                <LoadingButton loading={formik.isSubmitting} loadingPosition={'end'} color="primary" variant="contained" fullWidth type="submit" sx={{mt: 3, mb: 2}}>
                    sign in
                </LoadingButton>
            </form>
            <Grid container>
                <Grid item xs>
                    <Link href="#" variant="body2">
                        Forgot password?
                    </Link>
                </Grid>
                <Grid item>
                    <Link component="button" variant="body2" onClick={()=> navigate('/authorize/register')}>
                        Don't have an account? Sign Up
                    </Link>
                </Grid>
            </Grid>
        </>
    );
};

export default Login;