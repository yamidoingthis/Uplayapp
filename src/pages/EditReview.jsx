import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Rating, FormControl, FormHelperText, Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton } from '@mui/material';
import { Clear } from '@mui/icons-material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditReview() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [review, setReview] = useState({
        RevStar: 0,
        RevDesc: "",
        RevStatus: ""
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/review/${id}`).then((res) => {
            setReview(res.data);
            setLoading(false);
    
            formik.setValues({
                RevStar: res.data.revStar,
                RevDesc: res.data.revDesc,
                RevStatus: "Edited",
                RevFlag: res.data.revFlag
            });
        });
    }, [id]);

    const formik = useFormik({
        initialValues: review,
        enableReinitialize: true,
        validationSchema: yup.object({

            RevStar: yup.number()   
                .required('Rating is required'),

            RevDesc: yup.string().trim()
                .min(10, 'Your review must have a minimum of 10 characters')
                .required('Review is required')

        }),
        onSubmit: (data) => {
            data.RevDesc = data.RevDesc.trim();
            http.put(`/review/${id}`, data)
            .then((res) => {
                console.log(res.data);
                navigate("/reviews");
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

    const deleteReview = () => {
        const updatedReview = { ...review, revStatus: "Deleted"};
        http.put(`/review/${id}`, updatedReview)
        .then((res) => {
            console.log(res.data);
            navigate("/reviews");
        });
    };

    const [characterCount, setCharacterCount] = useState(0);

    const RevDescMinCharacterLimit = 10;

    const RevDescMaxCharacterLimit = 500;

    let characterText;
    if (parseInt(characterCount, 10) <= RevDescMinCharacterLimit) {
        characterText = `${characterCount}/10 min characters`;
    } else {
        characterText = `${characterCount}/500 max characters`;
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Your Review
            </Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        
                        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                            Rate your experience
                        </Typography>
                        
                        <FormControl error={formik.touched.RevStar && Boolean(formik.errors.RevStar)}>
                            <Rating
                            name="RevStar"
                            value={formik.values.RevStar}
                            onChange={(event, newValue) => { formik.setFieldValue('RevStar', newValue);}}
                            precision={1}
                            size="large"
                        />
                            <FormHelperText>
                                {formik.touched.RevStar && formik.errors.RevStar}
                                </FormHelperText>
                        </FormControl>
                        
                        <Grid container justifyContent="space-between" sx={{ width: 650 }}>
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Write your review
                            </Typography>
                            
                            <Typography variant="body2" sx={{ mt: 3, color:'gray' }}>
                                {characterText}
                            </Typography> 
                        </Grid>
                        
                        <TextField
                        fullWidth margin="normal" autoComplete="off"
                        multiline minRows={4}
                        name="RevDesc"
                        placeholder="Describe your experience"
                        value={formik.values.RevDesc}
                        onChange={(e) => {
                            if (e.target.value.length <= RevDescMaxCharacterLimit) {
                                formik.handleChange(e);
                                setCharacterCount(e.target.value.length);
                            }
                        }}
                        error={formik.touched.RevDesc && Boolean(formik.errors.RevDesc)}
                        helperText={formik.touched.RevDesc && formik.errors.RevDesc}
                        sx={{ width: 650 }}
                        />
                        
                        <Typography variant="body1" sx={{ my: 2, width: 490 }}>
                            I acknowledge that this review is about my genuine experience and it does not contain any inappropriate or irrelevant information.
                        </Typography>

                        <Box sx={{ mt: 3 }}>
                            <Button variant="contained" type="submit" sx={{ mr: 2 }}>
                                Update Review
                            </Button>
                            <Button variant="contained"color="error" onClick={handleOpen}>
                                Delete Review
                            </Button>
                        </Box>
                    </Box>
                )
            }

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Deleting Review
                </DialogTitle>
                <IconButton
                onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <Clear />
                </IconButton>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this review?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error"
                        onClick={deleteReview}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EditReview;