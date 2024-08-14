"use client";

import { Box, Button, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const btn = {
    color: "white",
    fontFamily: 'Rubik',
    backgroundColor: "#1976d2",
    height: "40px",
    width: "auto",
    textTransform: 'none',
    borderRadius: '25px',
    width: '130px',
    "&:hover": {
        backgroundColor: "#915831",
        color: "white",
    },
    "@media (max-width:780px)": {
        display: 'none',
    },
};

const Page = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState();
    useEffect(() => {
        // Check if the 'user' cookie is present
        const getCookie = (name) => {
            const value = `${document.cookie}`;
            console.log(value);
            const parts = value.split(`${name}=`);
            console.log(parts);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };

        const userCookie = getCookie('user');

        if (!userCookie) {
            // Redirect to login page if the cookie is not found
            setIsLoggedIn(false);
            router.push('/');
        } else {
            setIsLoggedIn(true)
        }
    }, [router]);
    return (
        <>
            {isLoggedIn ? (
                <div style={{ paddingTop: '4rem' }}>
                    <Box sx={{ margin: '5%', padding: '0 2% 2% 2%', border: '2px solid #1976d2', borderRadius: '25px', fontFamily: 'Rubik' }}>
                        <Grid container>
                            <Grid item md={6} sx={12}>
                                <h2>Upcoming Birthdays 🎂</h2>
                            </Grid>
                            <Grid item md={4} sx={12}>
                                <Button sx={btn}>+ Add Birthday</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
            ) : (
                <div style={{ paddingTop: '4rem' }}>
                    {/* Content for users who are being redirected */}
                    <h1>Redirecting...</h1>
                </div>
            )}
        </>
    )
}

export default Page