import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Rating, FormControl, FormHelperText, Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton } from '@mui/material';
import { Clear, AccessTime, AccountCircle } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditReviewAdmin() {
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
                RevStatus: res.data.revStatus,
                RevFlag: res.data.revFlag
            });
        });
    }, [id]);

    const formik = useFormik({
        initialValues: review,
        enableReinitialize: true,
        validationSchema: yup.object({
        }),
        onSubmit: (data) => {
            http.put(`/review/${id}`, data)
            .then((res) => {
                console.log(res.data);
                navigate("/reviewsadmin");
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

    const hideReview = () => {
        const updatedReview = { ...review, revStatus: "Hidden"};
        http.put(`/review/${id}`, updatedReview)
        .then((res) => {
            console.log(res.data);
            navigate("/rejectedreviewsadmin");
        });
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Moderate Review
            </Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Box sx={{ alignItems: 'center', mb: 2.5, mt: 3 }}>
                            <Typography variant='body2' sx={{ color: 'text.secondary', mb: 0.5 }}>
                                User:
                            </Typography>
                            <Box sx={{ display: 'flex'}}>
                                <AccountCircle sx={{ mr: 1 }} />
                                <Typography fontSize={17.5}>
                                    {review.user?.name}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2.5, mt: 3 }}>
                            <Typography variant='body2' sx={{ color: 'text.secondary', mb: 0.5 }}>
                                Stars:
                            </Typography>
                            
                            <Rating
                            name="star"
                            value={review.revStar}
                            size="large"
                            readOnly />
                        </Box>
                        
                        <Box sx={{ alignItems: 'center', mb: 2.5, mt: 3 }}>
                            <Typography variant='body2' sx={{ color: 'text.secondary', mb: 0.5 }}>
                                Description:
                            </Typography>
                            
                            <Typography fontSize={17.5}>
                                {review.revDesc}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                            <AccessTime sx={{ fontSize: 20, mr: 1 }} />
                            <Typography variant='body2'>
                                Posted on {dayjs(review.createdAt).format('MMMM D, YYYY')}
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 3 }}>
                            <Button variant="contained" type="submit" sx={{ mr: 2 }}>
                                Approve
                            </Button>
                            <Button variant="contained"color="error" onClick={handleOpen}>
                                Reject & Hide
                            </Button>
                        </Box>
                    </Box>
                )
            }

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Rejecting Review
                </DialogTitle>
                <IconButton
                onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <Clear />
                </IconButton>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to reject and hide this review?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error"
                        onClick={hideReview}>
                        Reject & Hide
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EditReviewAdmin;