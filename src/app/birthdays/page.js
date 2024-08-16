"use client";

import { Alert, Box, Button, FormControl, Grid, InputLabel, MenuItem, Modal, Select, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import { differenceInCalendarDays, addYears, format } from 'date-fns';


const btn = {
    color: "white",
    fontFamily: 'Rubik',
    backgroundColor: "#1976d2",
    height: "40px",
    width: "140px",
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
const mbtn = {
    color: "white",
    fontFamily: 'Rubik',
    backgroundColor: "#1976d2",
    height: "40px",
    width: "140px",
    textTransform: 'none',
    borderRadius: '25px',
    margin: '1.2rem 0 0 0',
    "&:hover": {
        backgroundColor: "#915831",
        color: "white",
    },
    "@media (max-width:610px)": {
        margin: '1.2rem 0 0 0',

    },
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '25px',
    boxShadow: 24,
    p: 4,
    "@media (max-width:780px)": {
        width: '80%',
    },
};

const month = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const day = Array.from({ length: 31 }, (_, i) => i + 1);

const calculateWeeksLeft = (day, monthh) => {
    console.log(day, monthh);
    const monthIndex = month.indexOf(monthh);
    console.log(monthIndex);
    const year = new Date().getFullYear();
    let birthday = new Date(year, monthIndex, day);

    const today = new Date();

    if (birthday < today) {
        birthday = addYears(birthday, 1);
    }
    const daysLeft = differenceInCalendarDays(birthday, today);
    const weeksLeft = Math.ceil(daysLeft / 7);

    return weeksLeft;
};

const calculateDaysLeft = (day, monthh) => {
    console.log(day, monthh);
    const monthIndex = month.indexOf(monthh); // Assuming 'month' is an array of month names
    console.log(monthIndex);
    const year = new Date().getFullYear();
    let birthday = new Date(year, monthIndex, day);

    const today = new Date();

    if (birthday < today) {
        birthday = addYears(birthday, 1);
    }

    const daysLeft = differenceInCalendarDays(birthday, today);

    return daysLeft;
};

const Page = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [birthDate, setBirthdate] = useState();
    const [birthMonth, setBirthMonth] = useState();
    const [name, setName] = useState();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [msg, setMsg] = useState('');
    const [severity, setSeverity] = useState('');
    const [birthdayData, setBirthdayData] = useState([]);


    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleCloseSnackbar = () => setOpenSnackbar(false);
    const handleBirthDate = (event) => setBirthdate(event.target.value);
    const handleBirthMonth = (event) => setBirthMonth(event.target.value);
    const handleName = (event) => setName(event.target.value);


    const handleSubmit = async () => {
        if (!birthDate || !birthMonth) {
            setMsg('Please select both a day and a month.');
            setOpenSnackbar(true);
            setSeverity('error');
            return;
        }
        const calculatedDaysLeft = calculateDaysLeft(birthDate, birthMonth);
        console.log(calculatedDaysLeft);
        const birthdayData = {
            phoneNumber: phoneNumber,
            birthdays: [
                {
                    name: name,
                    date: birthDate,
                    month: birthMonth,
                    daysLeft: calculatedDaysLeft,
                }
            ]
        };

        try {
            const response = await fetch('/api/birthdays', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(birthdayData),
            });

            const data = await response.json();
            if (data.success) {
                setMsg('Birthday added successfully!');
                setOpenSnackbar(true);
                setSeverity('success');
                handleClose();
                setBirthdate('');
                setBirthMonth('');
                fetchBirthdays();
            } else {
                setMsg('Failed to add birthday.');
                setOpenSnackbar(true);
                setSeverity('error');
            }
        } catch (error) {
            console.error('Error submitting birthday:', error);
            setMsg('An error occurred. Please try again.');
            setOpenSnackbar(true);
            setSeverity('error');
        }
    };

    const fetchBirthdays = useCallback(async () => {
        try {
            const response = await fetch(`/api/birthdays?phoneNumber=${phoneNumber}`, {
                method: 'GET',
            });

            const data = await response.json();

            if (isLoggedIn && data.success) {
                setBirthdayData(data.birthdays);
            } else {
                setMsg('No birthdays found.');
                setOpenSnackbar(true);
                setSeverity('error')
            }
        } catch (error) {
            console.error('Error fetching birthdays:', error);
            setMsg('An error occurred. Please try again.');
            setOpenSnackbar(true);
            setSeverity('error');
        }
    }, [phoneNumber]);

    useEffect(() => {
        const getCookie = (name) => {
            const value = `${document.cookie}`;
            const parts = value.split(`${name}=`);
            setPhoneNumber(parts[1]);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };

        const userCookie = getCookie('user');

        if (!userCookie) {
            setIsLoggedIn(false);
            router.push('/');
        } else {
            setIsLoggedIn(true);
            fetchBirthdays();
        }
    }, [router, fetchBirthdays]);
    console.log(birthdayData);
    return (
        <>
            {isLoggedIn ? (
                <div style={{ padding: '8rem 1rem 5rem 2rem' }}>
                    <Grid container spacing={2} sx={{
                        padding: '0 2% 0% 2%', border: '2px solid #1976d2', borderRadius: '25px', fontFamily: 'Rubik', "@media (max-width:600px)": {
                            padding: '4%'
                        },
                    }}>
                        <Grid md={8} sm={8} xs={12}>
                            <h2>Upcoming Birthdays 📆</h2>
                        </Grid>
                        <Grid md={4} sm={4} xs={12}>
                            <Button onClick={handleOpen} sx={btn}>+ Add Birthday</Button>
                        </Grid>
                    </Grid>
                    {birthdayData.map((birthday, index) => (
                        <Grid key={index} container spacing={2} sx={{
                            padding: '4% 2% 0 0', fontFamily: 'Rubik', "@media (max-width:600px)": {
                                padding: '7% 2% 0 0'
                            },
                        }}>
                            <Grid md={8} sm={8} xs={12}>
                                <Box sx={{ display: 'flex' }}>
                                    <Typography sx={{ height: '35px', width: '80px', fontSize: '1rem', color: 'white', fontWeight: '500', fontFamily: 'Rubik', backgroundColor: '#6EACDA', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {birthday.date} {birthday.month.slice(0, 3)}
                                    </Typography>
                                    <Typography sx={{
                                        margin: '0 5%', fontSize: '1.7rem', fontWeight: '500', fontFamily: 'Rubik', display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        "@media (max-width:600px)": {
                                            fontSize: '1.2rem'
                                        },
                                    }}>
                                        {birthday.name}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid md={4} sm={4} xs={12}>
                                <Typography sx={{
                                    height: '35px', width: '70%', fontSize: '1rem', color: 'white', fontWeight: '500', fontFamily: 'Rubik', backgroundColor: '#C75B7A', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', float: 'right',
                                    "@media (max-width:780px)": {
                                        display: 'none'
                                    },
                                }}>
                                    {calculateWeeksLeft(birthday.date, birthday.month)} Weeks to go..
                                </Typography>
                            </Grid>
                        </Grid>
                    ))}

                </div>
            ) : (
                <div style={{ paddingTop: '4rem' }}>
                    <h1>Redirecting...</h1>
                </div>
            )}
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Typography sx={{ fontFamily: 'Rubik', fontSize: '2rem', fontWeight: '700' }}>Add a new Birthday 🎉</Typography>
                    <TextField fullWidth id="outlined-basic" label="Name" variant="outlined" sx={{ margin: '1rem 0' }} onChange={handleName} />
                    <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                        <InputLabel id="birth-date-label">Enter Birth Day</InputLabel>
                        <Select
                            labelId="Birth Date"
                            id="birth-date"
                            value={birthDate}
                            label="Birth Date"
                            onChange={handleBirthDate}
                        >
                            {day.map((d, index) => (
                                <MenuItem key={index} value={d}>
                                    {d}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                        <InputLabel id="birth-month-label">Enter Birth Month</InputLabel>
                        <Select
                            labelId="Birth Month"
                            id="birth-month"
                            value={birthMonth}
                            label="Birth Month"
                            onChange={handleBirthMonth}
                        >
                            {month.map((m, index) => (
                                <MenuItem key={index} value={m}>
                                    {m}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button onClick={handleSubmit} sx={mbtn}>Submit</Button>
                </Box>
            </Modal>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
                    {msg}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Page