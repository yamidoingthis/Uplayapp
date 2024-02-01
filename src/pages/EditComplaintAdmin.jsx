import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditComplaintAdmin() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState({
        ComTitle: "",
        ComDesc: "",
        ComSugg: "",
        ComStatus: "Unaddressed",
        ComResp: ""
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
                ComResp: res.data.comResp
            });
        });
    }, [id]);

    const formik = useFormik({
        initialValues: complaint,
        enableReinitialize: true,
        validationSchema: yup.object({

            ComResp: yup.string().trim()
                .required('Response is required'),

        }),

        onSubmit: (data) => {
            data.ComResp = data.ComResp.trim();
            http.put(`/complaint/respond/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/issuesraisedadmin");
                });
        }
    });

    const respTempA = "Thank you for bringing this to our attention. We sincerely apologize for the inconvenience you've encountered. We understand the frustration this may have caused, and our team is actively investigating the matter. Rest assured that actions will be taken to resolve your issue(s).";

    const respTempB = "Thank you for reaching out to us with your concerns. We sincerely apologize for any inconvenience you've experienced. We have thoroughly investigated the matter, and we have made sure that [Action Taken]. Rest assured that you will not face similar issues again.";

    const [selectedTemplate, setSelectedTemplate] = React.useState([null]);

    const handleFormat = (event, newFormats) => {
        setSelectedTemplate(newFormats);
    
        if (newFormats === "1") {
            formik.setValues({ ...complaint, ComResp: respTempA });
        } else if (newFormats === "2") {
            formik.setValues({ ...complaint, ComResp: respTempB });
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Response To Issue
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Box sx={{ alignItems: 'center', mb: 2.5, mt: 3 }}>
                    <Typography variant='body2' sx={{ color: 'text.secondary', mb: 0.5 }}>
                        User:
                    </Typography>
                    <Box sx={{ display: 'flex'}}>
                        <AccountCircle sx={{ mr: 1 }} />
                        <Typography fontSize={17.5}>
                            {complaint.user?.name}
                            </Typography>
                    </Box>
                </Box>

                <Box sx={{ alignItems: 'center', mb: 2.5, mt: 3 }}>
                    <Typography variant='body2' sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Title:
                    </Typography>
                    
                    <Typography fontSize={17.5}>
                        {complaint.comTitle}
                    </Typography>
                </Box>

                <Box sx={{ alignItems: 'center', mb: 2.5, mt: 3 }}>
                    <Typography variant='body2' sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Description:
                    </Typography>
                    
                    <Typography fontSize={17.5}>
                        {complaint.comDesc}
                    </Typography>
                </Box>

                <Box sx={{ alignItems: 'center', mb: 2.5, mt: 3 }}>
                    <Typography variant='body2' sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Proposed Solution:
                    </Typography>
                    
                    <Typography fontSize={17.5}>
                        {complaint.comSugg ? complaint.comSugg : 'No solution proposed'}
                    </Typography>
                </Box>
                
                <Typography variant='body1' sx={{ color: 'text.secondary', mt: 2 }}>
                    Response:
                </Typography>

                <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 2, mb: 1, width: 480 }}>
                    
                    <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={selectedTemplate}
                    onChange={(event, newFormats) => handleFormat(event, newFormats)}
                    >
                        <ToggleButton value="1">
                            <Box sx={{ textTransform: 'none', ml: 1, mr: 1 }}><Typography variant='body2'>Response Template 1</Typography></Box>
                        </ToggleButton>
                        <ToggleButton value="2">
                            <Box sx={{ textTransform: 'none', ml: 1, mr: 1 }}><Typography variant='body2'>Response Template 2</Typography></Box>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                
                <TextField
                    fullWidth margin="normal" autoComplete="off"
                    multiline minRows={9}
                    name="ComResp"
                    placeholder="Reply to the issue"
                    value={formik.values.ComResp}
                    onChange={formik.handleChange}
                    error={formik.touched.ComResp && Boolean(formik.errors.ComResp)}
                    helperText={formik.touched.ComResp && formik.errors.ComResp}
                    sx={{ width: 650 }}
                />
                
                <Box sx={{ my: 3 }}>
                    <Button variant="contained" type="submit">
                        Save Response
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default EditComplaintAdmin;