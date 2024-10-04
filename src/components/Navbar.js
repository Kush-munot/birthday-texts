"use client";
import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Grid,
    Typography,
    Toolbar,
    Button,
} from "@mui/material";
import { useRouter } from 'next/navigation';


const btn = {
    marginRight: "20px",
    color: "white",
    fontFamily: 'Inter',
    backgroundColor: "#1976d2",
    height: "30px",
    width: "auto",
    textTransform: 'none',
    borderRadius: '5px',
    width: '90px',
    "&:hover": {
        backgroundColor: "#915831",
        color: "white",
    },
    "@media (max-width:780px)": {
        fontSize: '13px',
        width: '70px',
        height: '32px'
    },
};

export default function Navbar() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const getCookie = (name) => {
        const value = `${document.cookie}`;
        const parts = value.split(`${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    useEffect(() => {
        const checkLoginStatus = () => {
            const userCookie = getCookie('user');
            setIsLoggedIn(!!userCookie);
        };
        checkLoginStatus(); // Initial check

        const intervalId = setInterval(checkLoginStatus, 1000);

        return () => clearInterval(intervalId);
    }, [router]);
    /* useEffect(() => {
        const getCookie = (name) => {
            const value = `${document.cookie}`;
            const parts = value.split(`${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };

        const userCookie = getCookie('user');
        setIsLoggedIn(!!userCookie);  // Set the state based on cookie presence
    }, []); */

    const handleLogout = () => {
        document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        router.push('/');
    };

    return (
        <Grid container>
            <AppBar
                component="nav"
                position="fixed"
                sx={{
                    backgroundColor: "transparent",
                    height: "auto",
                    boxShadow: "none",
                }}
            >
                <Toolbar
                    sx={{
                        m: 2,
                        backgroundColor: "#FAFAFF",
                        borderRadius: "10px",
                        py: 0,
                        boxShadow: "1px 1px 1px 1px #DADDD8",
                    }}
                >
                    <Grid
                        container
                        sx={{
                            alignItems: "center",
                            justifyContent: "space-between",
                            display: { md: "flex" },
                        }}
                    >
                        <a href="/" style={{ textDecoration: "none", color: "black" }}>
                            <Grid
                                container
                                xs={12}
                                sx={{
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: "#915831",
                                        fontWeight: 600,
                                        fontSize: 20,
                                        width: "auto",
                                        ml: 2,
                                        fontFamily: 'Inter'
                                    }}
                                >
                                    Birthdayremind🎂
                                </Typography>
                            </Grid>
                        </a>
                        {
                            isLoggedIn ? <Button onClick={handleLogout} sx={btn}>Log Out</Button> : <Button sx={btn} onClick={() => router.push('/')}>Log In</Button>
                        }
                    </Grid>

                </Toolbar>
            </AppBar>
        </Grid>
    );
}
