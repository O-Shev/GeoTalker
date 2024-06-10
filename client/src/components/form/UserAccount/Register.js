import * as yup from 'yup';
import {useFormik} from "formik";
import {Button, Grid, Link, TextField, Typography} from "@mui/material";
import axios from "axios";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {LoadingButton} from "@mui/lab";
import {useSnackbar} from "notistack";
import {TaskAlt} from "@mui/icons-material";
import {postUserAccountUrl} from "../../../api/apiCore";


const validationSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .min(6, 'Password should be of minimum 6 characters length')
        .required('Password is required'),
});
const Register = () => {
    const [accepted, setAccepted] = useState(false);

    const { enqueueSnackbar } = useSnackbar();
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
                    url: postUserAccountUrl(),
                    data: values
                })
                .then((response) => {
                    setAccepted(true);
                    setTimeout(()=> {navigate('/authorize/login')}, 5000)
                })
                .catch((error) => {
                    if (error.response && error.response.status === 409) {
                        setErrors({ email: "User with such email already exist" });
                        enqueueSnackbar('Registration error: User with such email already exist', { variant : 'error' });
                    } else {
                        setErrors({ password: "Something went wrong" });
                        enqueueSnackbar('Registration error: Something went wrong', { variant : 'error' });
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
            {accepted ?
                <>
                    <TaskAlt sx={{ fontSize: 150, color: 'green', mt:7.5 }} />
                    <Typography variant="subtitle1" sx={{mb:7 }}>Check your mail for verification</Typography>
                </>
            :
                <>
                    <Typography component="h1" variant="h5">Sign up</Typography>
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
                        <LoadingButton loading={formik.isSubmitting} color="primary" variant="contained" fullWidth type="submit" sx={{mt: 3, mb: 2}}>
                            sign up
                        </LoadingButton>
                    </form>
                    <Grid container>
                        <Grid item xs>
                        </Grid>
                        <Grid item>
                            <Link component="button" variant="body2"
                                  onClick={() => navigate('/authorize/login')}>
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </>
            }
        </>
    );
};

export default Register;