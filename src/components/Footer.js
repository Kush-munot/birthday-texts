import React from "react";
import { Grid, Typography } from "@mui/material";
const Footer = () => {
    return (
        <Grid
            xs={12}
            sx={{
                display:'grid',
                justifyContent:"center",
                background: "#F8F8F8",
                py: "50px",
            }}
        >
            <Typography sx={{ fontStyle: "normal", fontWeight: 700, fontSize: 22 }}>
                © 2024 Birthday Texts
            </Typography>
            <Typography sx={{ fontStyle: "normal", fontWeight: 400, fontSize: 15 }}>
                Simple birthday reminders via WhatsApp.
            </Typography>
        </Grid >
    );
};

export default Footer;
