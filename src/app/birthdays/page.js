"use client";

import { Alert, Box, Button, Chip, Divider, FormControl, Grid, InputLabel, MenuItem, Modal, Select, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import { differenceInCalendarDays, addYears, format } from 'date-fns';
import { initializePaddle } from "@paddle/paddle-js";
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';

const filter = createFilterOptions();


const btn = {
    color: "white",
    fontFamily: 'Inter',
    fontSize: '0.75rem',
    backgroundColor: "#1976d2",
    height: "30px",
    textTransform: 'none',
    borderRadius: '5px',
    margin: '1rem 0',
    width: 'fit-content',
    padding: '0 0.5rem',
    float: 'right',
    "&:hover": {
        backgroundColor: "#915831",
        color: "white",
    },
    "@media (max-width:610px)": {
        float: 'left',
        margin: '1rem 0',
    },
};

const subsBtn = {
    color: "white",
    fontFamily: 'Inter',
    backgroundColor: "#1976d2",
    height: "40px",
    width: "140px",
    textTransform: 'none',
    borderRadius: '5px',
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
    fontFamily: 'Inter',
    backgroundColor: "#1976d2",
    height: "40px",
    width: "140px",
    textTransform: 'none',
    borderRadius: '5px',
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
    borderRadius: '5px',
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

const calculateDaysLeft = (day, month) => {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = monthNames.indexOf(month);
    const year = new Date().getFullYear();
    let birthday = new Date(year, monthIndex, day);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    birthday.setHours(0, 0, 0, 0);

    // If today is the birthday, return 0 days
    if (today.getTime() === birthday.getTime()) {
        return `Today !`;
    }

    if (birthday < today) {
        birthday = addYears(birthday, 1);
    }

    const daysLeft = differenceInCalendarDays(birthday, today);
    const label = daysLeft === 1 ? 'Day left' : 'Days left';

    return `${daysLeft} ${label}`;
};


const Page = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [birthDate, setBirthdate] = useState();
    const [birthMonth, setBirthMonth] = useState();
    const [name, setName] = useState();
    const [relation, setRelation] = useState();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [msg, setMsg] = useState('');
    const [severity, setSeverity] = useState('');
    const [subsId, setSubsId] = useState('');
    const [canceled, setCanceled] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(true);
    const [birthdayData, setBirthdayData] = useState([]);
    const [editingBirthday, setEditingBirthday] = useState(null);


    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleCloseSnackbar = () => setOpenSnackbar(false);
    const handleBirthDate = (event) => setBirthdate(event.target.value);
    const handleBirthMonth = (event) => setBirthMonth(event.target.value);
    const handleName = (event) => setName(event.target.value);
    const handleEdit = (birthday) => {
        console.log(birthday);
        setEditingBirthday(birthday);
        setName(birthday.name);
        setBirthdate(birthday.date);
        setBirthMonth(birthday.month);
        setRelation({ title: birthday.relationship });
        handleOpen();
    };
    const fetchBirthdays = useCallback(async () => {
        try {
            const response = await fetch(`/api/birthdays?phoneNumber=${phoneNumber}`, {
                method: 'GET',
            });

            const data = await response.json();

            //console.log("Data.isSubs", data);

            if (data.isSubscribed) {
                setIsSubscribed(true);
            }

            if (isLoggedIn && data.success) {
                const monthNames = [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];

                const sortedBirthdays = data.birthdays.sort((a, b) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);


                    // console.log(`Today's date: ${today}`);

                    // Find the index of the month from the monthNames array
                    const monthIndexA = monthNames.indexOf(a.month); // Get the month index for A
                    const monthIndexB = monthNames.indexOf(b.month); // Get the month index for B

                    // if (monthIndexA === -1) {
                    //     console.error(`Invalid month name for A: ${a.month}`);
                    //     return 0; // Skip sorting for invalid entries
                    // }
                    // if (monthIndexB === -1) {
                    //     console.error(`Invalid month name for B: ${b.month}`);
                    //     return 0; // Skip sorting for invalid entries
                    // }

                    // Construct Date objects using the month index
                    let nextA = new Date(today.getFullYear(), monthIndexA, a.date);
                    let nextB = new Date(today.getFullYear(), monthIndexB, b.date);

                    // Log constructed dates
                    // console.log(`Constructed nextA: ${nextA} for month: ${a.month}, date: ${a.date}`);
                    // console.log(`Constructed nextB: ${nextB} for month: ${b.month}, date: ${b.date}`);

                    // Check for invalid dates
                    if (isNaN(nextA.getTime())) {
                        console.error(`Invalid date for A: month = ${a.month}, date = ${a.date}`);
                    }
                    if (isNaN(nextB.getTime())) {
                        console.error(`Invalid date for B: month = ${b.month}, date = ${b.date}`);
                    }

                    // Adjust year for past birthdays
                    if (nextA.getTime() === today.getTime()) {
                        nextA.setFullYear(today.getFullYear()); // No year adjustment for today
                    } else if (nextA < today) {
                        // Adjust year for past birthdays
                        nextA.setFullYear(today.getFullYear() + 1);
                    }

                    if (nextB.getTime() === today.getTime()) {
                        nextB.setFullYear(today.getFullYear()); // No year adjustment for today
                    } else if (nextB < today) {
                        // Adjust year for past birthdays
                        nextB.setFullYear(today.getFullYear() + 1);
                    }
                    // Sort in ascending order of upcoming birthdays
                    return nextA - nextB;
                });
                console.log(sortedBirthdays);
                setBirthdayData(sortedBirthdays);
            }
        } catch (error) {
            console.error('Error fetching birthdays:', error);
            setMsg('An error occurred. Please try again.');
            setOpenSnackbar(true);
            setSeverity('error');
        }
    }, [phoneNumber]);
    const handleDelete = async (birthday) => {
        try {
            const response = await fetch('/api/birthdays', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber,
                    birthdayId: birthday.id, // Use the UUID of the birthday to delete
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMsg('Deleted Birthday Successfully !!');
                setOpenSnackbar(true);
                setSeverity('success');
                fetchBirthdays();
            } else {
                setMsg('An error occurred in deleting birthday. Please try again.');
                setOpenSnackbar(true);
                setSeverity('error');
                alert(data.message);
            }
        } catch (error) {
            console.error('Error deleting birthday:', error);
            setMsg('An error occurred in deleting birthday. Please try again.');
            setOpenSnackbar(true);
            setSeverity('error');
            alert('An error occurred while deleting the birthday');
        }
    };

    const getSubsId = useCallback(async () => {
        const apiUrl = `/api/subsId?phoneNumber=${phoneNumber}`;

        const response = await fetch(apiUrl);

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            setSubsId(data.subsId);
            console.log(subsId);
        } else {
            console.error('Error fetching customer ID:', response.statusText);
        }
    });

    const openCheckout = () => {
        router.push('/pricing')
    }

    useEffect(() => {
        const getCookie = (name) => {
            const value = `${document.cookie}`;
            const parts = value.split(`${name}=`);
            //console.log(parts[1]);
            setPhoneNumber(parts[1]);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };

        const userCookie = getCookie('user');

        if (!userCookie) {
            setIsLoggedIn(false);
            router.push('/');
        } else {
            console.log("into else");
            setIsLoggedIn(true);
            fetchBirthdays();
        }
    }, [router, fetchBirthdays]);

    useEffect(() => {
        if (isLoggedIn && phoneNumber) {
            getSubsId();
        }
    }, [isLoggedIn, phoneNumber]);



    const openCancelSubscription = async () => {
        console.log("cancel clicked");
        setCanceled(!canceled);
        console.log(subsId);
        try {
            // Call your backend API route instead of Paddle's API
            const response = await fetch('/api/cancelSubscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subsId
                }),
            });


            const data = await response.json();
            //console.log(response.ok);
            if (!response.ok) {
                setMsg(`Error: ${response.status}. Unable to Cancel the Subscription.`);
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

                //console.log(updateSubscriptionResponse.ok);

                if (!updateSubscriptionResponse.ok) {
                    setMsg(`Error: ${updateSubscriptionResponse.status}. Unable to Cancel Subscription`);
                    setOpenSnackbar(true);
                    setSeverity('error');
                } else {
                    setMsg('Subscription cancelled successfully!!', data);
                    setOpenSnackbar(true);
                    setSeverity('success');
                    router.push('/success')
                }

            }

        } catch (error) {
            console.error('Error in API calls:', error);
            setMsg(`${error}- Unable to Cancel Subscription.`);
            setOpenSnackbar(true);
            setSeverity('error');
        }
    };



    const handleSubmit = async () => {
        if (!birthDate || !birthMonth) {
            setMsg('Please select both a day and a month.');
            setOpenSnackbar(true);
            setSeverity('error');
            return;
        }

        const updatedBirthday = {
            id: editingBirthday ? editingBirthday.id : uuidv4(),
            name: name,
            date: birthDate,
            month: birthMonth,
            relationship: relation.title
        };
        const birthdayData = {
            phoneNumber: phoneNumber,
            birthdays: [updatedBirthday]
        };

        /* const newBirthday = {
            name: name,
            date: birthDate,
            month: birthMonth,
            relationship: relation.title
        };

        const birthdayData = {
            phoneNumber: phoneNumber,
            birthdays: [newBirthday]
        }; */

        console.log(birthdayData);

        try {
            const response = await fetch('/api/birthdays', {
                method: editingBirthday ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(birthdayData),
            });

            const data = await response.json();
            if (data.success) {
                setMsg(editingBirthday ? 'Birthday updated successfully!' : 'Birthday added successfully!');
                setOpenSnackbar(true);
                setSeverity('success');
                handleClose();

                // Clear modal fields after successful submission
                setName('');
                setBirthdate('');
                setBirthMonth('');
                setRelation('')
                setEditingBirthday(null)

                fetchBirthdays();
            } else {
                setMsg(editingBirthday ? 'Failed to update birthday.' : 'Failed to add birthday.');
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



    return (
        <>
            {isLoggedIn ?
                <Box style={{ padding: '8rem 0rem', minHeight: '100vh', }}>
                    {
                        !isSubscribed ?
                            <Box sx={{ padding: '0 15%', "@media (max-width:760px)": { padding: '0 1rem' }, }}>
                                <Grid container spacing={2} sx={{
                                    width: '100%', marginLeft: '0', marginTop: '0', padding: '0 2% 0% 2%', border: '1px solid #1976d2', borderRadius: '10px', fontFamily: 'Inter',
                                    "@media (max-width:760px)": { padding: '0 1rem' }
                                }}>
                                    <Grid sx={{ marginLeft: '0', marginTop: '0', }} md={8} sm={8} xs={12}>
                                        <h2>Upcoming Birthdays 📆</h2>
                                    </Grid>
                                    <Grid sx={{
                                        marginLeft: '0', marginTop: '0',
                                    }} md={4} sm={4} xs={12}>
                                        <Button onClick={openCheckout} sx={btn}>Subscribe</Button>
                                    </Grid>
                                </Grid>
                            </Box>
                            :
                            <div>
                                <Box sx={{ padding: '0 15%', "@media (max-width:760px)": { padding: '0 1rem' }, }}>
                                    <Grid container spacing={2} sx={{
                                        width: '100%', marginLeft: '0', marginTop: '0', border: '1px solid #1976d2', borderRadius: '10px', fontFamily: 'Inter'
                                    }}>
                                        {/* <Grid container spacing={2} sx={{
                                            padding: '0 1rem', marginLeft: '0', marginTop: '0', fontFamily: 'Inter',
                                        }}>
                                            <Grid sx={{ marginLeft: '0', marginTop: '0', }} md={8} sm={8} xs={12}>
                                                <h2>Upcoming Birthdays 📆</h2>
                                            </Grid>
                                            <Grid md={4} sm={4} xs={12} sx={{
                                                marginLeft: '0', marginTop: '0', display: 'flex', alignItems: 'center', justifyContent: 'right', "@media (max-width:760px)": {
                                                    justifyContent: 'center',
                                                }
                                            }}>
                                                <Button onClick={handleOpen} sx={btn}>+ Add Birthday</Button>
                                            </Grid>
                                        </Grid>
                                        <Grid sx={{ marginLeft: '0', marginTop: '0' }} md={12} sm={12} xs={12}>
                                            <Box sx={{
                                                display: 'flex',
                                                position: 'relative',
                                                justifyContent: 'space-between',
                                                padding: '0 1rem',
                                                "@media (max-width:760px)": {
                                                    padding: '0 1rem 1rem 1rem'
                                                }
                                            }}>
                                                <h6>Whatsapp reminders sent @9AM EST
                                                    to {phoneNumber}</h6>
                                                <Button onClick={openCancelSubscription} sx={btn}>Cancel Subscription</Button>
                                            </Box>
                                        </Grid> */}

                                        <Grid container spacing={2} sx={{
                                            padding: '0 1rem', marginLeft: '0', marginTop: '0', fontFamily: 'Inter',
                                        }}>

                                            <Grid sx={{ marginLeft: '0', marginTop: '0', }} md={8} sm={8} xs={12}>
                                                <h2 style={{ margin: '0.8rem 0' }}>Upcoming Birthdays 📆</h2>
                                                <h6 style={{ margin: '0.4rem 0', fontWeight: '400' }}>Whatsapp reminders sent @9AM EST
                                                    to {phoneNumber}</h6>
                                            </Grid>
                                            <Grid sx={{
                                                marginLeft: '0',
                                                marginTop: '0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }} md={4} sm={4} xs={12}>
                                                <Button onClick={handleOpen} sx={btn}>+ Add Birthday</Button>
                                            </Grid>
                                        </Grid>
                                        {birthdayData.map((birthday, index) => {
                                            const daysLeft = calculateDaysLeft(birthday.date, birthday.month);
                                            return (
                                                <Grid key={index} container spacing={2} sx={{
                                                    marginLeft: '0', marginTop: '0',
                                                    fontFamily: 'Inter'
                                                }}>
                                                    <Divider sx={{ width: '100%', backgroundColor: '#1976d2', height: '0.1px' }} />
                                                    <Grid sx={{ marginLeft: '0', marginTop: '0', padding: '0.5rem' }} md={10} sm={10} xs={10}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Stack sx={{ backgroundColor: '#dbeafe', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                <Typography sx={{ height: '25px', width: '60px', fontSize: '0.85rem', color: '#2563eb', fontWeight: '500', fontFamily: 'Inter', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                    {birthday.month.slice(0, 3)}
                                                                </Typography>
                                                                <Typography sx={{ height: '25px', width: '60px', fontSize: '1rem', color: '#2563eb', fontWeight: '700', fontFamily: 'Inter', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                    {birthday.date}
                                                                </Typography>
                                                            </Stack>
                                                            <Stack sx={{ width: '100%' }}>

                                                                <Typography sx={{
                                                                    margin: '0 5%', fontSize: '1rem', fontWeight: '500', fontFamily: 'Inter', display: 'flex', alignItems: 'center',
                                                                    "@media (max-width:600px)": {
                                                                        fontSize: '1.2rem'
                                                                    },
                                                                }}>
                                                                    {birthday.name}
                                                                </Typography>
                                                                {/* <Typography sx={{
                                                                margin: '0 5%', height: '25px', width: 'fit-content', fontSize: '0.7rem', color: 'gray', fontWeight: '500', fontFamily: 'Inter', display: 'flex', justifyContent: 'center', alignItems: 'center', float: 'right',

                                                            }}>
                                                                {calculateDaysLeft(birthday.date, birthday.month)}
                                                            </Typography> */}
                                                                <Chip sx={{ width: 'fit-content', padding: '0 0.05rem', fontSize: '0.7rem', color: daysLeft === 'Today !' ? '#ffffff' : '#6b7280', height: '25px', margin: '0 5%', borderRadius: '5px', backgroundColor: daysLeft === 'Today !' ? '#ef4444' : '#f9fafb' }} label={`${calculateDaysLeft(birthday.date, birthday.month)}`} />
                                                            </Stack>

                                                        </Box>
                                                    </Grid>
                                                    <Grid md={2} sm={2} xs={2} sx={{
                                                        marginLeft: '0', marginTop: '0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', "@media (max-width:760px)": {
                                                            paddingRight: '0.2rem'
                                                        }
                                                    }}>
                                                        <EditIcon
                                                            onClick={() => handleEdit(birthday)}
                                                            sx={{ cursor: 'pointer', color: '#374151', fontSize: '1.1rem' }}
                                                        />
                                                        <DeleteIcon
                                                            onClick={() => handleDelete(birthday)}
                                                            sx={{ cursor: 'pointer', color: '#374151', fontSize: '1.1rem' }}
                                                        />
                                                    </Grid>
                                                    {/* <Grid md={3.5} sm={3.5} xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                                                <Typography sx={{
                                                    height: '35px', width: 'fit-content', padding: '0 0.5rem', fontSize: '1rem', color: 'white', fontWeight: '500', fontFamily: 'Inter', backgroundColor: '#C75B7A', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', float: 'right',
                                                    "@media (max-width:780px)": {
                                                        display: 'none'
                                                    },
                                                }}>
                                                    {calculateDaysLeft(birthday.date, birthday.month)} Days to go..
                                                </Typography>
                
                                            </Grid> */}
                                                </Grid>
                                            )
                                        })}
                                        <Grid container spacing={2} sx={{
                                            marginLeft: '0', marginTop: '0',
                                            fontFamily: 'Inter'
                                        }}>
                                            <Divider sx={{ width: '100%', backgroundColor: '#1976d2', height: '0.1px' }} />
                                            <Grid sx={{ marginLeft: '0', marginTop: '0', display:'flex', alignItems:'center', justifyContent:'center' }} md={12} sm={12} xs={12}>
                                                <Button onClick={openCancelSubscription} sx={btn}>Cancel Subscription</Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </div>
                    }
                </Box>
                :
                <div style={{ paddingTop: '4rem', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h1>Loading...</h1>
                </div>
            }
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Typography sx={{ fontFamily: 'Inter', fontSize: '1.5rem', fontWeight: '700' }}>Add a new Birthday 🎉</Typography>
                    <TextField fullWidth value={name} id="outlined-basic" label="Name" variant="outlined" sx={{ margin: '0.5rem 0' }} onChange={handleName}
                    />
                    <FormControl fullWidth sx={{ margin: '0.5rem 0' }} >
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
                    <FormControl fullWidth sx={{ margin: '0.5rem 0' }}>
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

                    <Autocomplete
                        fullWidth
                        value={relation}
                        sx={{ margin: '0.5rem 0' }}
                        onChange={(event, newValue) => {
                            if (typeof newValue === 'string') {
                                setRelation({
                                    title: newValue,
                                });
                            } else if (newValue && newValue.inputValue) {
                                // Create a new value from the user input
                                setRelation({
                                    title: newValue.inputValue,
                                });
                            } else {
                                setRelation(newValue);
                            }
                        }}
                        filterOptions={(options, params) => {
                            const filtered = filter(options, params);

                            const { inputValue } = params;
                            // Suggest the creation of a new value
                            const isExisting = options.some((option) => inputValue === option.title);
                            if (inputValue !== '' && !isExisting) {
                                filtered.push({
                                    inputValue,
                                    title: `Add "${inputValue}"`,
                                });
                            }

                            return filtered;
                        }}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        id="free-solo-with-text-demo"
                        options={relationshipValues}
                        getOptionLabel={(option) => {
                            // Value selected with enter, right from the input
                            if (typeof option === 'string') {
                                return option;
                            }
                            // Add "xxx" option created dynamically
                            if (option.inputValue) {
                                return option.inputValue;
                            }
                            // Regular option
                            return option.title;
                        }}
                        renderOption={(props, option) => {
                            const { key, ...optionProps } = props;
                            return (
                                <li key={key} {...optionProps}>
                                    {option.title}
                                </li>
                            );
                        }}
                        freeSolo
                        renderInput={(params) => (
                            <TextField {...params} label="Relation" />
                        )}
                    />
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

const relationshipValues = [
    { title: 'Father' },
    { title: 'Mother' },
    { title: 'Son' },
    { title: 'Daughter' },
    { title: 'Brother' },
    { title: 'Sister' },
    { title: 'Husband' },
    { title: 'Wife' },
    { title: 'Uncle' },
    { title: 'Aunt' },
    { title: 'Nephew' },
    { title: 'Niece' },
    { title: 'Grandfather' },
    { title: 'Grandmother' },
    { title: 'Grandson' },
    { title: 'Granddaughter' },
    { title: 'Cousin' },
    { title: 'Friend' },
    { title: 'Partner' }
];


export default Page