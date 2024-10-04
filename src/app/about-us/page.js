/* eslint-disable react/no-unescaped-entities */
import { Box, Typography } from '@mui/material'
import React from 'react'

const title = {
    fontFamily: 'Inter',
    fontSize: '1.5rem',
    fontWeight: '700'
}

const text = {
    fontFamily: 'Inter',
    fontSize: '0.85rem',
}

const page = () => {
    return (
        <Box sx={{
            padding: '10% 2%', height: '60vh', "@media (max-width:760px)": {
                padding: '20% 5%'
            }
        }}>
            <Typography sx={title}>About Us</Typography>
            <Typography sx={text}>
                Welcome to Birthdayremind.app, where we make celebrating special moments easier than ever. Our app is designed to ensure you never miss a loved one’s birthday by sending you timely reminders directly to your WhatsApp. But we don't stop there—we also help you choose the perfect gift by suggesting thoughtful options tailored to each occasion.
                With Birthdayremind.app, you can focus on what truly matters: making memories and strengthening your connections, one thoughtful gesture at a time.
            </Typography>
        </Box>
    )
}

export default page