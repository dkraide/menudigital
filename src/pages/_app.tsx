import React from 'react';
import '../../styles/globals.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Roboto } from 'next/font/google';
import Footer from '@/components/Footer';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});


export default function App({ Component, pageProps }: any) {
  return (
    <div style={{ width: '100%', display:'flex', justifyContent: 'center', height: '100vh' }}>
      <div style={{maxWidth: '930px', flex:1, height: '100%', width: '100%'}}>
        <Component className={roboto} {...pageProps} />
        <Footer />
      </div>
      <ToastContainer autoClose={3000} />
    </div>
  );
}