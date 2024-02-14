import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { FormControl, InputLabel, FormHelperText, Select, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'react-toastify/dist/ReactToastify.css';

function AddActivity() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState("");

    const formik = useFormik({
        initialValues: {
            Name: "",
            Type: "",
            Description: "",
            Location: "",
            Vendor: "",
            ActivityDate: dayjs().add(1, 'day'),
            Price: 0.00
        },
        validationSchema: yup.object({
            Name: yup.string().trim()
                .min(3, 'Name must be at least 3 characters')
                .max(100, 'Name must be at most 100 characters')
                .required('Name is required'),
            Type: yup.string().trim()
                .required('Type is required'),
            Description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            Location: yup.string().trim()
                .min(3, 'Location must be at least 3 characters')
                .max(500, 'Location must be at most 500 characters')
                .required('Location is required'),
            Vendor: yup.string().trim()
                .min(3, 'Vendor must be at least 3 characters')
                .max(500, 'Vendor must be at most 500 characters')
                .required('Vendor is required'),
            ActivityDate: yup.date().typeError('Invalid date').required('Activity Date is required'),
            Price: yup.number().min(0).required('Price is required'),
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.ImageFile = imageFile;
            }
            data.Name = data.Name.trim();
            data.Type = data.Type.trim();
            data.Description = data.Description.trim();
            data.Location = data.Location.trim();
            data.Vendor = data.Vendor.trim();
            data.ActivityDate = data.ActivityDate;
            data.Price = data.Price;
            http.post("/Activity", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/activities");
                });
        }
    });

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            let formData = new FormData();
            formData.append('file', file);
            http.post('/File/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    console.log(res.data.filename)
                    setImageFile(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Activity
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Name"
                            name="Name"
                            value={formik.values.Name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.Name && Boolean(formik.errors.Name)}
                            helperText={formik.touched.Name && formik.errors.Name}
                        />
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth margin="dense"
                                error={formik.touched.Type && Boolean(formik.errors.Type)}>
                                <InputLabel>Type</InputLabel>
                                <Select label="Type"
                                    name="Type"
                                    value={formik.values.Type}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <MenuItem value={'Dining'}>Dine & Wine</MenuItem>
                                    <MenuItem value={'Family'}>Family Bonding</MenuItem>
                                    <MenuItem value={'Hobbies'}>Hobbies & Wellness</MenuItem>
                                    <MenuItem value={'Sports'}>Sports & Adventure</MenuItem>
                                    <MenuItem value={'Travel'}>Travel</MenuItem>
                                </Select>
                                <FormHelperText>{formik.touched.Type && formik.errors.Type}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            multiline minRows={2}
                            label="Description"
                            name="Description"
                            value={formik.values.Description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.Description && Boolean(formik.errors.Description)}
                            helperText={formik.touched.Description && formik.errors.Description}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            multiline minRows={2}
                            label="Location"
                            name="Location"
                            value={formik.values.Location}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.Location && Boolean(formik.errors.Location)}
                            helperText={formik.touched.Location && formik.errors.Location}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            multiline minRows={2}
                            label="Vendor"
                            name="Vendor"
                            value={formik.values.Vendor}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.Vendor && Boolean(formik.errors.Vendor)}
                            helperText={formik.touched.Vendor && formik.errors.Vendor}
                        />
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth margin="dense">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker format="DD/MM/YYYY"
                                        label="Select Date"
                                        name="ActivityDate"
                                        value={formik.values.ActivityDate}
                                        onChange={(ActivityDate) => formik.setFieldValue('date', ActivityDate)}
                                        onBlur={() => formik.setFieldTouched('date', true)}
                                        slotProps={{
                                            textField: {
                                                error: formik.touched.ActivityDate && Boolean(formik.errors.ActivityDate),
                                                helperText: formik.touched.ActivityDate && formik.errors.ActivityDate
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                type="number"
                                inputProps={{
                                    min: 0,
                                    step: 0.1,
                                }}
                                label="Price"
                                name="Price"
                                value={formik.values.Price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.Price && Boolean(formik.errors.Price)}
                                helperText={formik.touched.Price && formik.errors.Price} />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box sx={{ textAlign: 'center', mt: 2 }} >
                            <Button variant="contained" component="label">
                                Upload Image
                                <input hidden accept="image/*" multiple type="file"
                                    onChange={onFileChange} />
                            </Button>
                            {
                                imageFile && (
                                    <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                        <img alt="tutorial"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}>
                                        </img>
                                    </Box>
                                )
                            }
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>

            <ToastContainer />
        </Box>
    );
}

export default AddActivity;