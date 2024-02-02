import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, TextField, Button, Rating, FormControl, FormHelperText, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

function AddReview() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tutorial, setTutorial] = useState({
        name: "",
        description: "",
        location: "",
    });

    useEffect(() => {
        http.get(`/Activity/${id}`).then((res) => {
            console.log(res.data);
            setTutorial(res.data);
            setImageFile(res.data.imageFile);
            setLoading(false);
        });
    }, []);

    const formik = useFormik({
        initialValues: {
            RevStar: "",
            RevDesc: "",
            RevStatus: "Unedited",
            RevFlag: "Not Flagged"
        },

        validationSchema: yup.object({

            RevStar: yup.number()   
                .required('Rating is required'),

            RevDesc: yup.string().trim()
                .min(10, 'Your review must have a minimum of 10 characters')
                .required('Review is required'),
            
        }),

        onSubmit: (data) => {
            data.RevDesc = data.RevDesc.trim();
            http.post("/review", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/reviews");
                });
        }
    });
    
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
                Leave A Review
            </Typography>
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

                <Grid container justifyContent="space-between" sx={{ width: 650 }}>
                    <Box sx={{ mt: 3 }}>
                        <Button variant="contained" type="submit">
                            Post Review
                        </Button>
                    </Box>

                    <Typography variant="body2" sx={{ mt: 3.5 }}>
                        <Link to="/raiseissue">Raise a concern/issue instead</Link>
                    </Typography>
                </Grid>

            </Box>

        </Box>

        
    );
}

export default AddReview;