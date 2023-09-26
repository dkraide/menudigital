import React from 'react';
import '../../styles/globals.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Roboto } from 'next/font/google';
 
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});
 

export default function App({ Component, pageProps }:any) {
  return (
            <>
              <Component className={roboto} {...pageProps} />
              <ToastContainer autoClose={3000}/>
            </>
      );
 }