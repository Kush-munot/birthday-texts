import * as React from "react";
import {
    AppBar,
    Grid,
    Typography,
    Toolbar,
    Button,
} from "@mui/material";

const btn = {
    marginRight: "20px",
    color: "white",
    fontFamily: 'Rubik',
    backgroundColor: "#1976d2",
    height: "40px",
    width: "auto",
    textTransform:'none',
    borderRadius:'25px',
    width:'90px',
    "&:hover": {
        backgroundColor: "#915831",
        color: "white",
    },
    "@media (max-width:780px)": {
        display:'none',
    },
};

export default function Navbar() {
    return (
        <Grid container>
            <AppBar
                component="nav"
                position="fixed"
                sx={{
                    backgroundColor: "transparent",
                    height: "auto",
                    boxShadow: "none",
                }}
            >
                <Toolbar
                    sx={{
                        m: 2,
                        backgroundColor: "#FAFAFF",
                        borderRadius: "10px",
                        py: 0,
                        boxShadow: "1px 1px 1px 1px #DADDD8",
                    }}
                >
                    <Grid
                        container
                        sx={{
                            alignItems: "center",
                            justifyContent: "space-between",
                            display: { md: "flex" },
                        }}
                    >
                        <a href="/" style={{ textDecoration: "none", color: "black" }}>
                            <Grid
                                container
                                xs={12}
                                sx={{
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: "#915831",
                                        fontWeight: 600,
                                        fontSize: 20,
                                        width: "auto",
                                        ml: 2,
                                        fontFamily: 'Rubik'
                                    }}
                                >
                                    BirthdayTexts🎂
                                </Typography>
                            </Grid>
                        </a>
                        <Button href="/signUp" sx={btn}>Log In</Button>
                    </Grid>

                </Toolbar>
            </AppBar>
        </Grid>
    );
}
