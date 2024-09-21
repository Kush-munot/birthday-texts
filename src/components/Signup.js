import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { isValidNumber, parsePhoneNumberFromString } from 'libphonenumber-js';
import Image from 'next/image';


const Signup = () => {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [smsSent, setSmsSent] = useState(false);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [otpVerified, setOtpVerified] = useState('');
    const [severity, setSeverity] = useState('');

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    const handleOtpChange = (event) => {
        setOtp(event.target.value);
    };

    const validatePhoneNumber = async () => {
        const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber);
        let isValid = false;
        if (parsedPhoneNumber && isValidNumber(parsedPhoneNumber.number)) {
            isValid = true;
        } else {
            isValid = false;
        }
        return isValid;
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        const isValid = await validatePhoneNumber();
        //console.log(phoneNumber);
        if (!isValid) {
            setMsg('Invalid phone number. Please check if you are entering proper Country Codes.');
            setSeverity('error')
            setOpen(true);
            return;
        } else {
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
                    setMsg('OTP Sent Successfully!!')
                    setSmsSent(true)
                    setOpen(true);
                    setSeverity('success')
                } else {
                    setMsg('Failed to send OTP. Please try again.');
                    setOpen(true);
                    setSeverity('error')
                }
            } catch (error) {
                setMsg('An error occurred. Please try again.');
                setOpen(true);
                setSeverity('error')
            }
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
            //console.log(data);

            if (data.success) {
                setMsg('OTP Verified successfully!');
                setOpen(true);
                setSeverity('success')
                localStorage.setItem('isLoggedIn', 'true');
                router.push('/birthdays')
            } else {
                setMsg('Invalid OTP. Please try again.');
                setOpen(true);
                setSeverity('error')
            }
        } catch (error) {
            setMsg('An error occurred. Please try again.');
            setOpen(true);
            setSeverity('error')
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Box sx={{ width: '300px', margin: '4% auto', padding: '2px 20px 20px 20px', textAlign: 'center', border: '2px solid #1976d2', borderRadius: '25px', fontFamily: 'Rubik' }}>
                <form onSubmit={handleSubmit}>
                    <p>Sign in or sign up for your free account:</p>
                    <TextField
                        label="Enter Phone Number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
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
                        />
                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            Verify OTP
                        </Button>
                    </form>
                )}


                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                        {msg}
                    </Alert>
                </Snackbar>
            </Box>
            <Image
                src="/desktopMockup.png"
                alt="Desktop Preview"
                sizes="100vw"
                style={{
                    width: '100%',
                    height: 'auto',
                }}
                width={500}
                height={300}
            />

        </div>
    )
}

export default Signup