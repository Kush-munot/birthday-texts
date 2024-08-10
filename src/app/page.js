import { Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";
import styles from "./page.module.css";
import { data01, data02, data03 } from "./utils/sliderData";


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
  return (
    <div>
      <main className={styles.main}>
        <section sx={{ padding: '20px 0', }}>
          <div className="container">
            <Box sx={{ padding: '4rem 0' }}>
              <Typography sx={{ fontFamily: 'Rubik', fontSize: '3rem', letterSpacing: '3px', fontWeight: '600' }}>Never Miss a Birthday 🎂</Typography>
              <p>Bye-bye, Facebook, LinkedIn. Get WhatsApp reminders for birthdays, for free.</p>
            </Box>

            <marquee behavior="scroll" direction="left" scrollamount="3">
              <Stack direction="row" sx={{ justifyContent: 'right' }}>
                {
                  data01.map((data, index) => (
                    <ButtonGroup key={index} sx={{ margin: '10px' }}>
                      <Button sx={{ backgroundColor: '#1976d2', color: '#fff' }}>{data.BirthDate}</Button>
                      <Button sx={{ backgroundColor: '#fff', color: '#1976d2' }}>{data.Name}</Button>
                    </ButtonGroup>
                  ))
                }
              </Stack>
            </marquee>
            <marquee behavior="scroll" direction="left" scrollamount="3">
              <Stack direction="row" sx={{ justifyContent: 'right' }}>
                {data02.map((data, index) => (
                  <ButtonGroup key={index} sx={{ margin: '10px' }}>
                    <Button sx={{ backgroundColor: '#1976d2', color: '#fff' }}>{data.BirthDate}</Button>
                    <Button sx={{ backgroundColor: '#fff', color: '#1976d2' }}>{data.Name}</Button>
                  </ButtonGroup>
                ))}
              </Stack>
            </marquee>
            <marquee behavior="scroll" direction="left" scrollamount="3">
              <Stack direction="row" sx={{ justifyContent: 'right' }}>
                {
                  data03.map((data, index) => (
                    <ButtonGroup key={index} sx={{ margin: '10px' }}>
                      <Button sx={{ backgroundColor: '#1976d2', color: '#fff' }}>{data.BirthDate}</Button>
                      <Button sx={{ backgroundColor: '#fff', color: '#1976d2' }}>{data.Name}</Button>
                    </ButtonGroup>
                  ))
                }
              </Stack>
            </marquee>
          </div>
        </section>
      </main>
    </div>
  );
}
