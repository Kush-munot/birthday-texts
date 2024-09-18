/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Alert, Button, Grid, Link, List, ListItem, ListItemIcon, ListItemText, Snackbar, Typography } from '@mui/material'
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
    width: "200px",
    textTransform: 'none',
    borderRadius: '25px',
    margin: '2rem',
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
    const [subsId, setSubsId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [paused, setPaused] = useState(false)

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [msg, setMsg] = useState('');
    const [severity, setSeverity] = useState('');
    const handleCloseSnackbar = () => setOpenSnackbar(false);

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
    const getSubsId = useCallback(async () => {
        const apiUrl = `/api/subsId?phoneNumber=${phoneNumber}`;

        const response = await fetch(apiUrl);

        if (response.ok) {
            const data = await response.json();
            setSubsId(data.subsId);
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
        getSubsId();
    }, [phoneNumber, getCustomerId, getSubsId]);

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
                    successUrl: `${process.env.NEXT_PUBLIC_LINK}/birthdays`,
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
                    successUrl: `${process.env.NEXT_PUBLIC_LINK}/birthdays`,
                },
                customer: {
                    id: custId,
                },
            });
        }
    };

    const openCheckoutPaused = async () => {
        console.log("paused clicked");
        setPaused(!paused);
        console.log(subsId);
        console.log(custId);

        try {
            // Call your backend API route instead of Paddle's API
            const response = await fetch('/api/pauseSubscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subsId
                }),
            });


            const data = await response.json();
            console.log(response.ok);
            if (!response.ok) {
                setMsg(`Error: ${response.status}. Unable to Pause because the subscription is in trial period or already paused.`);
                setOpenSnackbar(true);
                setSeverity('error');
                throw new Error(`Error: ${response.status} ${response.statusText}`)
            } else {
                // Now make the second API call to /api/updateSubscription
                const updateSubscriptionResponse = await fetch('/api/updateSubscription', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        subscriptionId: subsId,
                        isSubscribed: false
                    }),
                });

                console.log(updateSubscriptionResponse.ok);

                if (!updateSubscriptionResponse.ok) {
                    setMsg(`Error: ${updateSubscriptionResponse.status}. Unable to Pause because the subscription is in trial period or already paused.`);
                    setOpenSnackbar(true);
                    setSeverity('error');
                } else {
                    setMsg('Subscription paused successfully!!', data);
                    setOpenSnackbar(true);
                    setSeverity('success');
                }

            }

        } catch (error) {
            console.error('Error in API calls:', error);
            setMsg(`${error}- Unable to Pause because the subscription is in trial period or already paused.`);
            setOpenSnackbar(true);
            setSeverity('error');
        }
    };

    const openCheckoutResumed = async () => {
        console.log("resume clicked");
        setPaused(!paused);
        console.log(subsId);
        console.log(custId);

        try {
            // Call your backend API route instead of Paddle's API
            const response = await fetch('/api/resumeSubscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subsId
                }),
            });


            const data = await response.json();
            if (!response.ok) {
                setMsg(`Error: ${response.status}- Unable to Resume because the subscription is in trial period or already resumed.`);
                setOpenSnackbar(true);
                setSeverity('error');
            } else {
                const updateSubscriptionResponse = await fetch('/api/updateSubscription', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        subscriptionId: subsId,
                        isSubscribed: true
                    }),
                });

                if (!updateSubscriptionResponse.ok) {
                    setMsg(`Error: ${updateSubscriptionResponse.status}- Unable to Pause because the subscription is in trial period or already paused.`);
                    setOpenSnackbar(true);
                    setSeverity('error');
                } else {
                    console.log('Subscription updated successfully.', data);
                    setMsg('Subscription resumed successfully!!');
                    setOpenSnackbar(true);
                    setSeverity('success');
                }
            }

        } catch (error) {
            console.error('Error in API calls:', error);
            setMsg(`${error}. Unable to Resume because the subscription is in trial period or already resumed.`);
            setOpenSnackbar(true);
            setSeverity('error');
        }
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
                margin: '3% 0',
                width: 'auto'
            }}>
                <Grid md={4} sm={4} xs={12}>
                    <Button onClick={openCheckoutPaused} sx={btn}>Pause Subscription</Button>
                </Grid>
                <Grid md={4} sm={4} xs={12}>
                    <Button onClick={openCheckoutResumed} sx={btn}>Resume Subscription</Button>
                </Grid>
                <Grid md={4} sm={4} xs={12}>
                    <Button href='/birthdays' sx={btn}>Dashboard</Button>
                </Grid>
            </Grid>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
                    {msg}
                </Alert>
            </Snackbar>


        </div>
    )
}

export default page