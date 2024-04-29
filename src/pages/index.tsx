'use client'
import { Typography, useTheme } from '@mui/material'
import Head from 'next/head'

export default function Home() {
  const theme = useTheme()


  return (
    <>
      <Head>
        <title>Lập trình thật dễ</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Typography >Hello world updated</Typography>
    </>
  )
}
