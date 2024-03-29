import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';


function AddBooking() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const showToastMessage = () => {
        toast.success("Booking successfully added to cart", {
        });
    };
    const urlSearchParams = new URLSearchParams(window.location.search);
    const nameFromURL = urlSearchParams.get('name');
    const priceFromURL = urlSearchParams.get('price');

    const formik = useFormik({
        initialValues: {
            name: user.name,
            activity: nameFromURL || "",
            date: dayjs(),
            time: "",
            quantity: "",
            price: priceFromURL || "",
        },
        validationSchema: yup.object({

            activity: yup.string().trim()
                .min(3, 'Activity must be at least 3 characters')
                .max(100, 'Activity must be at most 100 characters')
                .required('Activity is required'),
            time: yup.string().trim()
                .matches(/^(0?[1-9]|1[0-2]):[0-5][0-9] (am|pm)$/i, 'Time must be in 12-hour format (hh:mm am/pm)')
                .required('Time is required'),
            quantity: yup.number().integer()
                .min(1, 'Quantity cannot be below 1')
                .max(100, 'Quantity cannot be above 100')
                .required('Quantity is required')

        }),
        onSubmit: (data) => {
            data.activity = data.activity;
            data.date = new Date(data.date);
            data.time = data.time.trim();
            data.quantity = data.quantity;
            data.date = dayjs(data.date).format("DD/MM/YYYY");
            console.log(data.date)

            http.post("/booking", data)
                .then((res) => {
                    console.log(res.data);
                    showToastMessage();
                    navigate("/cart");
                })
                .catch((error) => {
                    console.error(error);
                    toast.error("Failed to add booking to cart");
                });
        }
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Booking
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Typography sx={{ mb: 2 }}>Name: {user.name}</Typography>
                <Typography sx={{ mb: 2 }}>Price: {priceFromURL}</Typography>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Activity Name"
                    name="activity"
                    value={formik.values.activity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.activity && Boolean(formik.errors.activity)}
                    helperText={formik.touched.activity && formik.errors.activity}
                    sx={{ marginBottom: 2 }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Date"
                        name="date"
                        format="DD/MM/YYYY"
                        value={formik.values.date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        sx={{ width: '100%' }}
                        renderInput={(params) => (
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                {...params}
                                InputLabelProps={{ shrink: true }}
                                error={formik.touched.date && Boolean(formik.errors.date)}
                                helperText={formik.touched.date && formik.errors.date}
                                sx={{ marginBottom: 2 }}
                            />
                        )}
                    />
                </LocalizationProvider>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Time"
                    name="time"
                    value={formik.values.time}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.time && Boolean(formik.errors.time)}
                    helperText={formik.touched.time && formik.errors.time}
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Number of tickets"
                    name="quantity"
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                    helperText={formik.touched.quantity && formik.errors.quantity}
                    sx={{ marginBottom: 2 }}
                />

                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit" >
                        Add
                    </Button>
                    <ToastContainer />
                </Box>
            </Box>
        </Box>
    );
}

export default AddBooking;
