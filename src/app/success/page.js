"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Typography, Container } from '@mui/material';

const SuccessPage = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/birthdays');
        }, 3000);

        return () => clearTimeout(timer); // Cleanup timer if the component unmounts
    }, [router]);

    return (
        <Container>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                style={{ minHeight: '100vh' }}
            >
                <Grid item>
                    <Typography variant="h4" gutterBottom>
                        Transaction Successful
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1">
                        You will be directed to the dashboard in 5 seconds.
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    );
};

export default SuccessPage;