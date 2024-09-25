"use client";
import { Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";
import styles from "./page.module.css";
import Signup from "../components/Signup";
import { useEffect, useState } from "react";
import Pricing from "../components/Pricing";
import InfiniteScrollBirthdays from "@/components/InfiniteScrollBirthdays";
import { useRouter } from "next/navigation";

const btn = {
  color: "white",
  fontFamily: 'Rubik',
  backgroundColor: "#1976d2",
  height: "40px",
  width: "fit-content",
  textTransform: 'none',
  borderRadius: '25px',
  margin: '2rem',
  "&:hover": {
      backgroundColor: "#915831",
      color: "white",
  },
  "@media (max-width:610px)": {
      float: 'left',
      margin: '1.2rem 0 0 0.5rem',

  },
};

export default function Home() {
  const [key, setKey] = useState(0);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const getCookie = (name) => {
        const value = `${document.cookie}`;
        const parts = value.split(`${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const userCookie = getCookie('user');
    console.log(!userCookie);

    if (!userCookie) {
        setIsLoggedIn(false)
        router.push('/');
    } else {
        setIsLoggedIn(true);
        router.push('/birthdays');
    }
}, [router]);

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
            {
              !isLoggedIn ? <Signup /> : <Button href='/birthdays' sx={btn}>Already LoggedIn?? Go to Dashboard</Button>
            }
            
            <Pricing/>
          </Box>
        </section>
      </main>
    </div>
  );
}
