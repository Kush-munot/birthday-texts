import React from "react";
import { Box, Grid, Link, Typography } from "@mui/material";

const link = {
    textDecoration: 'none',
    fontFamily: 'Rubik',
    color:'#1976d2'
}
const Footer = () => {
    return (
        <Grid
            container
            sx={{
                background: "#F8F8F8",
                p: "3%",
            }}
        >
            <Grid xs={12} md={6} lg={6}>
                <Typography sx={{ fontStyle: "normal", fontWeight: 700, fontSize: 22 }}>
                    © 2024 Birthday Texts
                </Typography>
                <Typography sx={{ fontStyle: "normal", fontWeight: 400, fontSize: 15 }}>
                    Simple birthday reminders via WhatsApp.
                </Typography>
            </Grid>
            <Grid xs={12} md={6} lg={6}>
                <Box sx={{ padding: '0.5rem 0' }}>
                    <Link sx={link} href='/about-us'>About Us</Link><br />
                </Box>
                <Box sx={{ padding: '0.5rem 0' }}>
                    <Link sx={link} href='/contact-us'>Contact Us</Link><br />
                </Box>
                <Box sx={{ padding: '0.5rem 0' }}>
                    <Link sx={link} href='/returns-and-refunds'>Returns and Refund Policy</Link><br />
                </Box>
                <Box sx={{ padding: '0.5rem 0' }}>
                    <Link sx={link} href='/privacy-policy'>Privacy Policy</Link><br />
                </Box>
                <Box sx={{ padding: '0.5rem 0' }}>
                    <Link sx={link} href='/terms-and-conditions'>Terms and Conditions</Link><br />
                </Box>
            </Grid>
        </Grid >
    );
};

export default Footer;
