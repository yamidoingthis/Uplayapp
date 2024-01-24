import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

function AddBooking() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            title: "",
            description: ""
        },
        validationSchema: yup.object({
                name: yup.string().trim()
                .min(3, 'Name must be at least 3 characters')
                .max(100, 'Name must be at most 100 characters')
                .required('Name is required'),
            date: yup.string().trim()
                .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, 'Date must be in DD/MM/YYYY format')
                .required('Date is required'),
            time: yup.string().trim()
                .matches(/^(0?[1-9]|1[0-2]):[0-5][0-9] (am|pm)$/i, 'Time must be in 12-hour format (hh:mm am/pm)')
                .required('Time is required'),
            purchase_date: yup.string().trim()
                .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, 'Date must be in DD/MM/YYYY format')
                .required('Purchase Date is required'),
            quantity: yup.number().integer()
                .min(1, 'Quantity cannot be below 1')
                .max(10, 'Quantity cannot be above 10')
                .required('Quantity is required')

        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.date = data.date.trim();
            data.time = data.time.trim();
            data.purchase_date = data.purchase_date.trim();
            data.quantity = data.quantity;
            http.post("/booking", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/bookings");
                });
        }
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Booking
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Date"
                    name="date"
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.date && Boolean(formik.errors.date)}
                    helperText={formik.touched.date && formik.errors.date}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Time"
                    name="time"
                    value={formik.values.time}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.time && Boolean(formik.errors.time)}
                    helperText={formik.touched.time && formik.errors.time}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Purchase Date"
                    name="purchase_date"
                    value={formik.values.purchase_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.purchase_date && Boolean(formik.errors.purchase_date)}
                    helperText={formik.touched.purchase_date && formik.errors.purchase_date}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Quantity"
                    name="quantity"
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                    helperText={formik.touched.quantity && formik.errors.quantity}
                />

                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default AddBooking;