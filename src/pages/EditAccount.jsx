import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';

function EditAccount() {
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handlebutton = () => {
        navigate('/changepassword');
    };

    const formik = useFormik({
        initialValues: {
            phone: user.phone || '',
            nric: user.nric || '',
            birthDate: user.birthDate || '',
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            phone: yup.string().trim().max(8, 'Phone must be at most 8 characters').nullable(),
            nric: yup.string().trim().max(4, 'NRIC must be at most 4 characters').nullable(),
            birthDate: yup.date().nullable(),
        }),
        onSubmit: (data) => {
            const updatedData = {}; // Create an object to store only updated fields
        
            // Check if each field has changed and add it to the updatedData object if it has
            if (data.phone !== user.phone) {
                updatedData.phone = data.phone.trim();
            }
            if (data.nric !== user.nric) {
                updatedData.nric = data.nric.trim();
            }
            if (data.birthDate !== user.birthDate) {
                updatedData.birthDate = data.birthDate;
            }
        
            console.log('Updated Data:', updatedData); // Log the updatedData object
        
            // Send updatedData to the server
            http.put(`/user/update/${user.id}`, updatedData)
                .then((res) => {
                    toast.success('Account updated successfully');
                    navigate('/viewaccount');
                })
                .catch((error) => {
                    toast.error('Failed to update account');
                    console.error(error);
                });
        }
        
        
    });

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Account
            </Typography>
            {!loading && (
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={8}>
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Phone"
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.phone && Boolean(formik.errors.phone)}
                                helperText={formik.touched.phone && formik.errors.phone}
                            />
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="NRIC (Last 3 digits and letter)"
                                name="nric"
                                value={formik.values.nric}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.nric && Boolean(formik.errors.nric)}
                                helperText={formik.touched.nric && formik.errors.nric}
                            />
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Birth Date"
                                name="birthDate"
                                type="date"
                                value={formik.values.birthDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.birthDate && Boolean(formik.errors.birthDate)}
                                helperText={formik.touched.birthDate && formik.errors.birthDate}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button variant="contained" type="submit">
                            Update
                        </Button>
                        <Button variant="contained" onClick={handlebutton}>
                            Change password
                        </Button>
                    </Box>
                </Box>

            )}

            <ToastContainer />
        </Box>
    );
}

export default EditAccount;
