import React from "react";
import { Grid, Typography } from "@mui/material";
const Footer = () => {
    return (
        <Grid
            container
            justifyContent="center"
            xs={12}
            sx={{
                mt: "100px",
                background: "#F8F8F8",
                py: "50px",
            }}
        >
            <Typography sx={{ fontStyle: "normal", fontWeight: 700, fontSize: 22 }}>
                © 2024 Birthday Texts
            </Typography>
            <br />
            <Typography sx={{ fontStyle: "normal", fontWeight: 400, fontSize: 15 }}>
                Simple birthday reminders via WhatsApp.
            </Typography>
        </Grid >
    );
};

export default Footer;
