import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton } from '@mui/material';
import { Clear } from '@mui/icons-material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditComplaint() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState({
        ComTitle: "",
        ComDesc: "",
        ComSugg: "",
        ComStatus: "Unaddressed"
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/complaint/${id}`).then((res) => {
            setComplaint(res.data);
            setLoading(false);
    
            formik.setValues({
                ComTitle: res.data.comTitle,
                ComDesc: res.data.comDesc,
                ComSugg: res.data.comSugg,
            });
        });
    }, [id]);

    const formik = useFormik({
        initialValues: complaint,
        enableReinitialize: true,
        validationSchema: yup.object({

            ComTitle: yup.string().trim()
                .min(5, 'Your title must have a minimum of 5 characters')
                .required('Title is required'),

            ComDesc: yup.string().trim()
                .min(10, 'Your description must have a minimum of 10 characters')
                .required('Description is required'),

        }),

        onSubmit: (data) => {
            data.ComTitle = data.ComTitle.trim();
            data.ComDesc = data.ComDesc.trim();
            data.ComSugg = data.ComSugg.trim();
            http.put(`/complaint/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/issuesraised");
                });
        }
    });

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteComplaint = () => {
        http.delete(`/complaint/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/issuesraised");
            });
    }
    
    const [titleCharacterCount, setTitleCharacterCount] = useState(0);

    const ComTitleMinCharacterLimit = 5;

    const ComTitleMaxCharacterLimit = 100;

    let titleCharacterText;
    if (parseInt(titleCharacterCount, 10) <= ComTitleMinCharacterLimit) {
        titleCharacterText = `${titleCharacterCount}/5 min characters`;
    } else {
        titleCharacterText = `${titleCharacterCount}/100 max characters`;
    }

    const [descCharacterCount, setDescCharacterCount] = useState(0);

    const ComDescMinCharacterLimit = 10;

    const ComDescMaxCharacterLimit = 2000;

    let descCharacterText;
    if (parseInt(descCharacterCount, 10) <= ComDescMinCharacterLimit) {
        descCharacterText = `${descCharacterCount}/10 min characters`;
    } else {
        descCharacterText = `${descCharacterCount}/2000 max characters`;
    }

    const [suggCharacterCount, setSuggCharacterCount] = useState(0);

    const ComSuggMaxCharacterLimit = 500;

    let suggCharacterText;
    suggCharacterText = `${suggCharacterCount}/500 max characters`;

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Raise An Issue
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                
                <Grid container justifyContent="space-between" sx={{ width: 650 }}>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Title
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 3, color:'gray' }}>
                        {titleCharacterText}
                    </Typography>
                </Grid>
 
                <TextField
                    fullWidth margin="normal" autoComplete="off"
                    name="ComTitle"
                    placeholder="Summarize your problem"
                    value={formik.values.ComTitle}
                    onChange={(e) => {
                        if (e.target.value.length <= ComTitleMaxCharacterLimit) {
                            formik.handleChange(e);
                            setTitleCharacterCount(e.target.value.length);
                        }
                    }}
                    error={formik.touched.ComTitle && Boolean(formik.errors.ComTitle)}
                    helperText={formik.touched.ComTitle && formik.errors.ComTitle}
                    sx={{ width: 650 }}
                />
                
                <Grid container justifyContent="space-between" sx={{ width: 650 }}>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Describe the issue
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 3, color:'gray' }}>
                        {descCharacterText}
                    </Typography>
                </Grid>

                <TextField
                    fullWidth margin="normal" autoComplete="off"
                    multiline minRows={6}
                    name="ComDesc"
                    placeholder="Elaborate on the problem(s) you faced"
                    value={formik.values.ComDesc}
                    onChange={(e) => {
                        if (e.target.value.length <= ComDescMaxCharacterLimit) {
                            formik.handleChange(e);
                            setDescCharacterCount(e.target.value.length);
                        }
                    }}
                    error={formik.touched.ComDesc && Boolean(formik.errors.ComDesc)}
                    helperText={formik.touched.ComDesc && formik.errors.ComDesc}
                    sx={{ width: 650 }}
                />
                
                <Grid container justifyContent="space-between" sx={{ width: 650 }}>
                    <Grid container alignItems="center" sx={{ width: 400 }}>
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Propose solution
                        </Typography>

                        <Typography variant="body2" sx={{ color: 'gray', mt: 2, ml: 1 }}>
                            (Optional)
                        </Typography>
                    </Grid>

                    <Typography variant="body2" sx={{ mt: 3, color:'gray' }}>
                        {suggCharacterText}
                    </Typography>
                </Grid>
                
                <TextField
                    fullWidth margin="normal" autoComplete="off"
                    multiline minRows={4}
                    name="ComSugg"
                    placeholder="Suggest possible solution(s)"
                    value={formik.values.ComSugg}
                    onChange={(e) => {
                        if (e.target.value.length <= ComSuggMaxCharacterLimit) {
                            formik.handleChange(e);
                            setSuggCharacterCount(e.target.value.length);
                        }
                    }}
                    error={formik.touched.ComSugg && Boolean(formik.errors.ComSugg)}
                    helperText={formik.touched.ComSugg && formik.errors.ComSugg}
                    sx={{ width: 650 }}
                />
                
                <Box sx={{ my: 3 }}>
                    <Button variant="contained" type="submit">
                        Save Changes
                    </Button>
                    <Button variant="contained" sx={{ ml: 2 }} color="error"
                    onClick={handleOpen}>
                        Remove
                    </Button>
                </Box>
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Removing submission
                </DialogTitle>
                <IconButton
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8
                }}
                >
                    <Clear />
                </IconButton>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove this submission?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="text" color="error"
                        onClick={deleteComplaint}>
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>

        
    );
}

export default EditComplaint;