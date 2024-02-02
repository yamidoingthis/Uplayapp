import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function ActivitiesPriceAscending() {
    const [tutorialList, setTutorialList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getTutorials = () => {
        http.get('/Activity/sortedpriceascending').then((res) => {
            console.log(res.data);
            setTutorialList(res.data);
        });
    };

    const searchTutorials = () => {
        http.get(`/Activity?search=${search}`).then((res) => {
            setTutorialList(res.data);
        });
    };

    useEffect(() => {
        getTutorials();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchTutorials();
        }
    };

    const onClickSearch = () => {
        searchTutorials();
    }

    const onClickClear = () => {
        setSearch('');
        getTutorials();
    };

    return (
        <Box>
            <Typography variant="h3" sx={{ my: 5, textAlign: 'center' }}>
                Activities
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Sort By
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item><Link to="/activities">Recently Added</Link></Dropdown.Item>
                        <Dropdown.Item><Link to="/activitiespricedescending">Most Expensive First</Link></Dropdown.Item>
                        <Dropdown.Item><Link to="/activitiespriceascending">Cheapest First</Link></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                {
                    user && (
                        <Link to="/addactivity" style={{ textDecoration: 'none' }}>
                            <Button variant='contained'>
                                Add
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Grid container spacing={2}>
                {
                    tutorialList.map((tutorial, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={tutorial.id}>
                                <Card>
                                    {
                                        tutorial.imageFile && (
                                            <Box className="aspect-ratio-container">
                                                <img alt="tutorial"
                                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${tutorial.imageFile}`}>
                                                </img>
                                            </Box>
                                        )
                                    }
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {tutorial.name}
                                            </Typography>
                                            {
                                                user && user.id === tutorial.vendorId && (
                                                    <Link to={`/editactivity/${tutorial.id}`}>
                                                        <IconButton color="primary" sx={{ padding: '4px' }}>
                                                            <Edit />
                                                        </IconButton>
                                                    </Link>
                                                )
                                            }
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AccountCircle sx={{ mr: 1 }} />
                                            <Typography>
                                                {tutorial.vendor?.name}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AccessTime sx={{ mr: 1 }} />
                                            <Typography>
                                                {dayjs(tutorial.activityDate).format(global.datetimeFormat)}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            Price: ${tutorial.price}
                                        </Typography>
                                        <Link to={`/activity/${tutorial.id}`}>
                                            <Typography>
                                                View More
                                            </Typography>
                                        </Link>
                                        <Link to={`/addreview/${tutorial.id}`}>
                                            <Typography>
                                                Add Review
                                            </Typography>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    );
}

export default ActivitiesPriceAscending;