import { Box, Typography } from '@mui/material'
import React from 'react'

const title = {
    fontFamily: 'Inter',
    fontSize: '1.5rem',
    fontWeight: '700'
}

const text = {
    fontFamily: 'Inter',
    fontSize: '1rem',
    margin: '0.85   rem 0'
}

const page = () => {
    return (
        <Box sx={{
            padding: '10% 2%', height: '60vh', "@media (max-width:760px)": {
                padding: '20% 5%'
            }
        }}>
            <Typography sx={title}>
                Contact Us
            </Typography>
            <Typography sx={text}>
                <b>Email</b> : Customersupport@birthdayremind.app
            </Typography>
            <Typography sx={text}>
                <b>Phone number</b> : +91 8920924624
            </Typography>
            <Typography sx={text}>
                <b>Address</b>: Flat no. 26, Vandana Apartments, Plot no. 42, IP Extension, Patparganj, Delhi 110092
            </Typography>
            <Typography sx={text}>
                <b>Working hours</b> : Monday to Saturday – 0900 hrs - 1800 hrs IST
            </Typography>
        </Box>
    )
}

export default page