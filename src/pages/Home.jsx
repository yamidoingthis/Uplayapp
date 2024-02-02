import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
    const [itemList, setItemList] = useState([]);
    const [search, setSearch] = useState('');

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getItems = () => {
        // Your implementation for fetching items
    };

    const searchItems = () => {
        // Your implementation for searching items
    };

    useEffect(() => {
        getItems();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchItems();
        }
    };

    const onClickSearch = () => {
        searchItems();
    }

    const onClickClear = () => {
        setSearch('');
        getItems();
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Home
            </Typography>
        </Box>
    );
}

export default Home;