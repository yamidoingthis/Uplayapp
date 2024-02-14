import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ConfirmPassword() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            password: ''
        },
        validationSchema: yup.object({
            password: yup.string()
                .required('Password is required')
        }),
        onSubmit: (values) => {
            
            http.post('/user/confirm-password', { password: values.password })
                .then((response) => {
                    navigate('/editaccount');
                })
                .catch((error) => {                    
                    toast.error('Incorrect password');
                    
                });
        }
    });

    return (
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Confirm Password
            </Typography>
            <Box component="form" sx={{ maxWidth: '500px' }}
                onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Password"
                    name="password" type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
                <Button fullWidth variant="contained" sx={{ mt: 2 }}
                    type="submit">
                    Confirm Password
                </Button>
            </Box>

            <ToastContainer />
        </Box>
    );
}

export default ConfirmPassword;
