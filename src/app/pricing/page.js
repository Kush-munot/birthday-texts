/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Button, Grid, Link, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { initializePaddle } from "@paddle/paddle-js";

const title = {
    fontFamily: 'Rubik',
    fontSize: '2rem',
    fontWeight: '700',
    margin: '1% 0'
}
const btn = {
    color: "white",
    fontFamily: 'Rubik',
    backgroundColor: "#1976d2",
    height: "40px",
    width: "100%",
    textTransform: 'none',
    borderRadius: '25px',
    margin: '1.2rem 0 0 2rem',
    float: 'right',
    "&:hover": {
        backgroundColor: "#915831",
        color: "white",
    },
    "@media (max-width:610px)": {
        float: 'left',
        margin: '1.2rem 0 0 0.5rem',

    },
};

const text = {
    fontFamily: 'Rubik',
    fontSize: '1rem',
    paddingBottom: '1rem'
}

const pro_plan = [
    "Track unlimited birthdays",
    "Additional reminders 3 days away",
    "Receive SMS birthday reminder texts",
    "Visualize upcoming birthdays",
    "Never check Facebook Birthdays ever again",
];
const page = () => {
    const [paddle, setPaddle] = useState();
    const [custId, setCustId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const getCustomerId = useCallback(async () => {
        const apiUrl = `/api/customerId?phoneNumber=${phoneNumber}`;

        const response = await fetch(apiUrl);

        if (response.ok) {
            const data = await response.json();
            setCustId(data.customerId);
        } else {
            console.error('Error fetching customer ID:', response.statusText);
        }
    });

    useEffect(() => {
        const getCookie = (name) => {
            const value = `${document.cookie}`;
            const parts = value.split(`${name}=`);
            console.log(parts[1]);
            setPhoneNumber(parts[1]);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };

        const userCookie = getCookie('user');
        getCustomerId();
    }, [phoneNumber, getCustomerId]);

    useEffect(() => {
        void initializePaddle({
            environment: "sandbox",
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_ID,
        }).then((paddleInstance) => {
            if (paddleInstance) {
                setPaddle(paddleInstance);
            }
        });
    }, [])

    const openCheckoutMonthly = () => {
        if (custId) {
            paddle?.Checkout.open({
                items: [
                    { priceId: process.env.NEXT_PUBLIC_PADDLE_M_PRICE_ID, quantity: 1 },
                ],
                settings: {
                    successUrl: "https://lived-elect-managed-go.trycloudflare.com/birthdays",
                },
                customer: {
                    id: custId,
                },
            });
        }
    };
    const openCheckoutYearly = () => {
        if (custId) {
            paddle?.Checkout.open({
                items: [
                    { priceId: process.env.NEXT_PUBLIC_PADDLE_Y_PRICE_ID, quantity: 1 },
                ],
                settings: {
                    successUrl: "https://lived-elect-managed-go.trycloudflare.com/birthdays",
                },
                customer: {
                    id: custId,
                },
            });
        }
    };
    const openCheckoutPaused = () => {
        console.log("paused clicked");
    };
    const openCheckoutResumed = () => {
        console.log("resumed clicked");
    };
    return (
        <div style={{ padding: '10% 2%' }}>
            <Typography sx={title}>Pricing</Typography>
            <Typography sx={text}>Get complimentary Free 7-days trial 🥳</Typography>
            <Grid container >
                <Grid item lg={5.5} md={5.5} xs={11} sx={{ height: 'auto', border: '2px solid #1976d2', borderRadius: '20px', marginLeft: '3%', backgroundColor: '#ffff', mt: '5px' }}>
                    <Button sx={{
                        backgroundColor: '#915831',
                        color: 'white',
                        ml: 2, mt: 2,
                        borderRadius: '20px',
                        "&:hover": {
                            backgroundColor: '#1976d2',
                            color: 'white',
                            cursor: 'default'
                        },
                    }}>
                        <Typography sx={{ textTransform: 'none', fontWeight: '500' }}>Monthly</Typography>
                    </Button>
                    <Typography sx={{ fontSize: '62px', fontFamily: 'Nunito Sans', fontWeight: '700', ml: '5%' }}>$ 1.99 <span style={{ fontSize: '22px', fontFamily: 'Nunito Sans', fontWeight: '700' }}>/per month</span></Typography>
                    <List sx={{ mt: '5%' }}>
                        {pro_plan.map((feature, index) => (
                            <ListItem key={index}>
                                <ListItemIcon>
                                    <CheckCircleOutlineIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={feature}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Button sx={{
                        borderRadius: "5px",
                        border: 0,
                        color: "white",
                        textTransform: 'none',
                        backgroundColor: '#000',
                        opacity: '60%',
                        fontSize: '1.2rem',
                        width: '75%',
                        padding: "10px",
                        m: '4% 10%',
                        "&:hover": {
                            backgroundColor: '#000',
                            color: 'white',
                        },

                    }} onClick={openCheckoutMonthly} > Subscribe Monthly Plan </Button>
                </Grid>
                <Grid item lg={5.5} md={5.5} xs={11} sx={{ height: 'auto', border: '2px solid #1976d2', borderRadius: '20px', marginLeft: '3%', backgroundColor: '#ffff', mt: '5px' }}>
                    <Button sx={{
                        backgroundColor: '#915831',
                        color: 'white',
                        ml: 2, mt: 2,
                        borderRadius: '20px',
                        "&:hover": {
                            backgroundColor: '#1976d2',
                            color: 'white',
                            cursor: 'default'
                        },
                    }}>
                        <Typography sx={{ textTransform: 'none', fontWeight: '500' }}>Annually</Typography>
                    </Button>
                    <Typography sx={{ fontSize: '62px', fontFamily: 'Nunito Sans', fontWeight: '700', ml: '5%' }}>$ 19.99 <span style={{ fontSize: '22px', fontFamily: 'Nunito Sans', fontWeight: '700' }}>/per year</span></Typography>
                    <List sx={{ mt: '5%' }}>
                        {pro_plan.map((feature, index) => (
                            <ListItem key={index}>
                                <ListItemIcon>
                                    <CheckCircleOutlineIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={feature}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Button sx={{
                        borderRadius: "5px",
                        border: 0,
                        color: "white",
                        textTransform: 'none',
                        backgroundColor: '#000',
                        opacity: '60%',
                        fontSize: '1.2rem',
                        width: '75%',
                        padding: "10px",
                        m: '4% 10%',
                        "&:hover": {
                            backgroundColor: '#000',
                            color: 'white',
                        },

                    }} onClick={openCheckoutYearly}> Subscribe Yearly Plan </Button>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{
                padding: '0 2% 0% 2%', border: '2px solid #1976d2', borderRadius: '25px', fontFamily: 'Rubik', "@media (max-width:600px)": {
                    padding: '4%'
                },
            }}>
                <Grid md={8} sm={8} xs={12}>
                    <Button onClick={openCheckoutPaused} sx={btn}>Pause Subscription</Button>
                </Grid>
                <Grid md={4} sm={4} xs={12}>
                    <Button onClick={openCheckoutResumed} sx={btn}>Resume Subscription</Button>
                </Grid>
            </Grid>


        </div>
    )
}

export default page