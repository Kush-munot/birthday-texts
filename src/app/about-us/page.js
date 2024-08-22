/* eslint-disable react/no-unescaped-entities */
import { Typography } from '@mui/material'
import React from 'react'

const title = {
    fontFamily: 'Rubik',
    fontSize: '2rem',
    fontWeight: '700'
}

const text = {
    fontFamily: 'Rubik',
    fontSize: '1rem',
}

const page = () => {
    return (
        <div style={{ padding:'10% 2%', height:'40vh' }}>
            <Typography sx={title}>About Us</Typography>
            <Typography sx={text}>
                Welcome to Birthdayremind.app, where we make celebrating special moments easier than ever. Our app is designed to ensure you never miss a loved one’s birthday by sending you timely reminders directly to your WhatsApp. But we don't stop there—we also help you choose the perfect gift by suggesting thoughtful options tailored to each occasion.
                With Birthdayremind.app, you can focus on what truly matters: making memories and strengthening your connections, one thoughtful gesture at a time.
            </Typography>
        </div>
    )
}

export default page