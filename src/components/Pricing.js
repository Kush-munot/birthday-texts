import { Button, Grid, Link, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import React from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


const title = {
    fontFamily: 'Rubik',
    fontSize: '2rem',
    fontWeight: '700',
    margin: '1% 0'
}
const title1 = {
    fontFamily: 'Rubik',
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: '2% 0'
}

const text = {
    fontFamily: 'Rubik',
    fontSize: '1rem',
    paddingBottom: '1rem'
}

const pro_plan = [
    "Track unlimited birthdays",
    "Additional reminders 3 days away",
    "Receive SMS birthday reminder texts",
    "Visualize upcoming birthdays",
    "Never check Facebook Birthdays ever again",
];

const Pricing = () => {
    return (
        <div style={{ padding: '10% 2%' }}>
            <Typography sx={title}>Pricing</Typography>
            <Typography sx={text}>Get complimentary Free 7-days trial 🥳</Typography>
            <Grid container >
                <Grid item lg={5.5} md={5.5} xs={11} sx={{ height: 'auto', border: '2px solid #1976d2', borderRadius: '20px', marginLeft: '3%', backgroundColor: '#ffff', mt: '5px' }}>
                    <Button sx={{
                        backgroundColor: '#915831',
                        color: 'white',
                        ml: 2, mt: 2,
                        borderRadius: '20px',
                        "&:hover": {
                            backgroundColor: '#1976d2',
                            color: 'white',
                            cursor: 'default'
                        },
                    }}>
                        <Typography sx={{ textTransform: 'none', fontWeight: '500' }}>Monthly</Typography>
                    </Button>
                    <Typography sx={{ fontSize: '62px', fontFamily: 'Nunito Sans', fontWeight: '700', ml: '5%' }}>$ 1.99 <span style={{ fontSize: '22px', fontFamily: 'Nunito Sans', fontWeight: '700' }}>/per month</span></Typography>
                    <List sx={{ mt: '5%' }}>
                        {pro_plan.map((feature, index) => (
                            <ListItem key={index}>
                                <ListItemIcon>
                                    <CheckCircleOutlineIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={feature}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Link href='/pricing'>

                        <Button sx={{
                            borderRadius: "5px",
                            border: 0,
                            color: "white",
                            textTransform: 'none',
                            backgroundColor: '#000',
                            opacity: '60%',
                            fontSize: '1.2rem',
                            width: '75%',
                            padding: "10px",
                            m: '4% 10%',
                            "&:hover": {
                                backgroundColor: '#000',
                                color: 'white',
                            },

                        }} > Start for Free </Button>
                    </Link>
                </Grid>
                <Grid item lg={5.5} md={5.5} xs={11} sx={{ height: 'auto', border: '2px solid #1976d2', borderRadius: '20px', marginLeft: '3%', backgroundColor: '#ffff', mt: '5px' }}>
                    <Button sx={{
                        backgroundColor: '#915831',
                        color: 'white',
                        ml: 2, mt: 2,
                        borderRadius: '20px',
                        "&:hover": {
                            backgroundColor: '#1976d2',
                            color: 'white',
                            cursor: 'default'
                        },
                    }}>
                        <Typography sx={{ textTransform: 'none', fontWeight: '500' }}>Annually</Typography>
                    </Button>
                    <Typography sx={{ fontSize: '62px', fontFamily: 'Nunito Sans', fontWeight: '700', marginLeft: '3%' }}>$ 19.99 <span style={{ fontSize: '22px', fontFamily: 'Nunito Sans', fontWeight: '700', letterSpacing: '0rem' }}>/per year</span></Typography>
                    <List sx={{ mt: '5%' }}>
                        {pro_plan.map((feature, index) => (
                            <ListItem key={index}>
                                <ListItemIcon>
                                    <CheckCircleOutlineIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={feature}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Link href='/pricing'>
                        <Button sx={{
                            borderRadius: "5px",
                            border: 0,
                            color: "white",
                            textTransform: 'none',
                            backgroundColor: '#000',
                            opacity: '60%',
                            fontSize: '1.2rem',
                            width: '75%',
                            padding: "10px",
                            m: '4% 10%',
                            "&:hover": {
                                backgroundColor: '#000',
                                color: 'white',
                            },

                        }} > Start for Free </Button>
                    </Link>
                </Grid>
            </Grid>

        </div>
    )
}

export default Pricing