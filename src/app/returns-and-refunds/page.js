import { Box, Typography } from '@mui/material'
import React from 'react'

const title = {
    fontFamily: 'Inter',
    fontSize: '1.5rem',
    fontWeight: '700'
}

const title1 = {
    fontFamily: 'Inter',
    fontSize: '1.1rem',
    fontWeight: '700',
    margin: '2% 0'
}

const text = {
    fontFamily: 'Inter',
    fontSize: '0.85rem',
}

const page = () => {
    return (
        <Box sx={{
            padding: '10% 2%', "@media (max-width:760px)": {
                padding: '20% 5%'
            }
        }}>
            <Typography sx={title}>
                Refunds And Returns
            </Typography>
            <Typography sx={text}>
                Thank You for Choosing Our Subscription Service!
                We are dedicated to providing you with the best experience possible. As our products are digital and access to content is immediate upon purchase, we have a no-refund policy in place.
                However, we understand that sometimes things don’t work out as expected. If you find that our service is not meeting your needs, you are welcome to cancel your subscription at any time. Rest assured, if you cancel, you will not be billed for the next subscription cycle.
            </Typography>

            <Typography sx={title1}>
                How to Cancel Your Subscription:
            </Typography>
            <ol style={{ lineHeight: '2rem', fontSize:'0.85rem' }}>
                <li>Log in to your account on our website.</li>
                <li>Navigate to the “Account Settings” or “Subscription Management” section.</li>
                <li>Follow the prompts to cancel your subscription.</li>
            </ol>

            <Typography sx={title1}>
                Important Notes:
            </Typography>
            <ul style={{ lineHeight: '2rem', fontSize:'0.85rem' }}>
                <li>Your subscription will remain active until the end of the current billing cycle.</li>
                <li>No further charges will be applied after cancellation, but we do not offer refunds for any remaining time left in the current cycle.</li>
            </ul>

            <Typography sx={text}>
                We hope you enjoy our service, and we are here to assist if you have any questions or need support. Thank you for your understanding and for being a valued part of our community.
            </Typography>

        </Box>
    )
}

export default page