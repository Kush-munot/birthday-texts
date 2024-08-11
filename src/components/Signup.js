import React, { useState } from 'react';
import { Box, TextField, Button, Snackbar, Alert } from '@mui/material';

const Signup = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [smsSent, setSmsSent] = useState(false);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    const handleOtpChange = (event) => {
        setOtp(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (phoneNumber.length !== 10) {
            setError('Invalid phone number. Please try again.');
            setOpen(true);
            return;
        }

        try {
            const response = await fetch('/api/sendOtp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber }),
            });

            const data = await response.json();

            if (data.success) {
                setSmsSent(true);
                setError('');
                setOpen(false);
            } else {
                setError('Failed to send OTP. Please try again.');
                setOpen(true);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            setOpen(true);
        }
    };

    const handleOtpSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('/api/verifyOtp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber, otp }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('OTP Verified successfully!');
                setError('');
                console.log(data);
            } else {
                setError('Invalid OTP. Please try again.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Box sx={{ width: '300px', margin: '0 auto', padding: '2px 20px 20px 20px', textAlign: 'center', border: '2px solid #1976d2', borderRadius: '25px', fontFamily: 'Rubik' }}>
                <form onSubmit={handleSubmit}>
                    <p>Sign in or sign up for your free account:</p>
                    <TextField
                        label="Enter Phone Number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        error={!!error}
                        sx={{ margin: '0 10px 10px 0' }}
                    />
                    <Button variant="contained" color="primary" type="submit" fullWidth>
                        Send OTP
                    </Button>
                </form>

                {smsSent && (
                    <form onSubmit={handleOtpSubmit}>
                        <TextField
                            label="Please Enter OTP for verification"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={otp}
                            onChange={handleOtpChange}
                            error={!!error}
                        />
                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            Verify OTP
                        </Button>
                    </form>
                )}

                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            </Box>
        </div>
    )
}

export default Signup