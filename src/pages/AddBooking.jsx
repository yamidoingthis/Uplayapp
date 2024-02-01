import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

function AddBooking() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            activity: "",
            date: dayjs(),
            time: "",
            quantity: "",
        },
        validationSchema: yup.object({
            name: yup.string().trim()
                .min(3, 'Name must be at least 3 characters')
                .max(100, 'Name must be at most 100 characters')
                .required('Name is required'),
            activity: yup.string().trim()
                .min(3, 'Activity must be at least 3 characters')
                .max(100, 'Activity must be at most 100 characters')
                .required('Activity is required'),
            time: yup.string().trim()
                .matches(/^(0?[1-9]|1[0-2]):[0-5][0-9] (am|pm)$/i, 'Time must be in 12-hour format (hh:mm am/pm)')
                .required('Time is required'),
            quantity: yup.number().integer()
                .min(1, 'Quantity cannot be below 1')
                .max(10, 'Quantity cannot be above 10')
                .required('Quantity is required')

        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.activity = data.activity;
            data.date = new Date(data.date);
            data.time = data.time.trim();
            data.quantity = data.quantity;

            data.date = dayjs(data.date).format("DD/MM/YYYY");
            console.log(data.date)

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
                    label="Activity Name"
                    name="activity"
                    value={formik.values.activity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.activity && Boolean(formik.errors.activity)}
                    helperText={formik.touched.activity && formik.errors.activity}
                />
               <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Date"
                        name="date"
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
