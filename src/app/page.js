"use client";
import { Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";
import styles from "./page.module.css";
import Signup from "../components/Signup";
import { useEffect, useState } from "react";
import Pricing from "../components/Pricing";
import InfiniteScrollBirthdays from "@/components/InfiniteScrollBirthdays";


const btn = {
  marginRight: "20px",
  color: "white",
  fontFamily: 'Rubik',
  backgroundColor: "#1976d2",
  height: "40px",
  width: "auto",
  textTransform: 'none',
  borderRadius: '25px',
  width: '130px',
  "&:hover": {
    backgroundColor: "#915831",
    color: "white",
  },
  "@media (max-width:780px)": {
    display: 'none',
  },
};

export default function Home() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setKey(prevKey => prevKey + 1);
    }, 30000); 

    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <main className={styles.main}>
        <section sx={{ padding: '20px 0' }}>
          <div className="container">
            <Box sx={{ padding: '3.5rem 0', display: 'grid', justifyContent: 'center' }}>
              <Typography sx={{ fontFamily: 'Rubik', fontSize: '3rem', letterSpacing: '3px', fontWeight: '600' }}>Never Miss a Birthday 🎂</Typography>
              <p>Bye-bye, Facebook, LinkedIn. Get WhatsApp reminders for birthdays, for free.</p>
            </Box>
          </div >
          <div>
            <InfiniteScrollBirthdays/>
          </div>
          <Box sx={{ padding: '1rem 0', display: 'grid', justifyContent: 'center' }}>
            <Signup />
            <Pricing/>
          </Box>
        </section>
      </main>
    </div>
  );
}
