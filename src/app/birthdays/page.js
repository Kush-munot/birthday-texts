"use client";

import { Alert, Box, Button, FormControl, Grid, InputLabel, MenuItem, Modal, Select, Snackbar, Stack, TextField, Typography } from '@mui/material';
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

const calculateDaysLeft = (day, month) => {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = monthNames.indexOf(month);
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
    const [relation, setRelation] = useState();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [msg, setMsg] = useState('');
    const [severity, setSeverity] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
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

    const openCheckout = () => {
        router.push('/pricing')
    }

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
                setBirthdayData(data.birthdays);
            }
        } catch (error) {
            console.error('Error fetching birthdays:', error);
            setMsg('An error occurred. Please try again.');
            setOpenSnackbar(true);
            setSeverity('error');
        }
    }, [phoneNumber]);

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
            setIsLoggedIn(true);
            fetchBirthdays();
        }
    }, [router, fetchBirthdays]);

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
                            {
                                isSubscribed ?
                                    <Button onClick={handleOpen} sx={btn}>+ Add Birthday</Button>
                                    :
                                    <Button onClick={openCheckout} sx={btn}>Subscribe</Button>
                            }
                        </Grid>
                    </Grid>
                    {birthdayData.map((birthday, index) => (
                        <Grid key={index} container spacing={2} sx={{
                            padding: '4% 2% 0 0', fontFamily: 'Rubik', "@media (max-width:600px)": {
                                padding: '7% 2% 0 0'
                            },
                        }}>
                            <Grid md={8} sm={8} xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                                    height: '35px', width: '55%', fontSize: '1rem', color: 'white', fontWeight: '500', fontFamily: 'Rubik', backgroundColor: '#C75B7A', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', float: 'right',
                                    "@media (max-width:780px)": {
                                        display: 'none'
                                    },
                                }}>
                                    {calculateDaysLeft(birthday.date, birthday.month)} Days to go..
                                </Typography>
                                <EditIcon
                                    onClick={() => handleEdit(birthday)}
                                    sx={{ cursor: 'pointer', color: '#1976d2' }}
                                />
                                <DeleteIcon
                                    onClick={() => handleDelete(birthday)}
                                    sx={{ cursor: 'pointer', color: '#1976d2' }}
                                />
                            </Grid>
                        </Grid>
                    ))}

                </div>
            ) : (
                <div style={{ paddingTop: '4rem' }}>
                    <h1>Loading...</h1>
                </div>
            )}
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Typography sx={{ fontFamily: 'Rubik', fontSize: '2rem', fontWeight: '700' }}>Add a new Birthday 🎉</Typography>
                    <TextField fullWidth value={name} id="outlined-basic" label="Name" variant="outlined" sx={{ margin: '1rem 0' }} onChange={handleName} />
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

                    <Autocomplete
                        fullWidth
                        value={relation}
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