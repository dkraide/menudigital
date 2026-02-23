import React, { useState } from 'react';
import '../../styles/globals.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Roboto } from 'next/font/google';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContexto';
import Welcome from '@/components/welcome';
import { api } from '@/services/api';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/contexts/AuthContexto';
import { useRouter } from 'next/router';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

function EmpresaResolver({ setEmpresaValida }: { setEmpresaValida: (v: boolean) => void }) {
  const { setEmpresaId, empresaId } = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    async function resolveEmpresa() {
       console.log('Resolving empresa...', empresaId); // ✅ log para debug
      if (!router.isReady) return;
      if (empresaId) {
        setEmpresaValida(true); // ✅ garante que valida se já tem empresa no contexto
        return;
      }

      const host = window.location.hostname;
      const urlParams = new URLSearchParams(window.location.search);

      // 🔹 1️⃣ Compatibilidade antiga → ?empresa=ID
      const empresaQuery = urlParams.get("empresa");
      if (empresaQuery) {
        const id = Number(empresaQuery);
        if (!isNaN(id) && id > 0) {
          setEmpresaId(id);
          setEmpresaValida(true);
          return;
        }
      }

      // 🔹 2️⃣ Resolver por subdomínio
      const parts = host.split(".");
      if (parts.length < 3) {
        setEmpresaValida(false);
        return;
      }

      const slug = parts[0];
      try {
        const res = await api.get(`/empresa/slug/${slug}`);
        setEmpresaId(res.data.id);
        setEmpresaValida(true);
      } catch {
        setEmpresaValida(false);
      }
    }

    resolveEmpresa();
  }, [router.isReady, empresaId]); // ✅ adiciona empresaId nas deps
  return null;
}

export default function App({ Component, pageProps }: any) {
  const [empresaValida, setEmpresaValida] = useState<boolean | null>(null);

  return (
    <AuthProvider>
      <EmpresaResolver setEmpresaValida={setEmpresaValida} />

      {empresaValida === false ? (
        <Welcome />
      ) : empresaValida === true ? (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', height: '100vh' }}>
          <div style={{ maxWidth: '930px', flex: 1, height: '100%', width: '100%' }}>
            <Component {...pageProps} />
            <Footer />
          </div>
          <ToastContainer autoClose={3000} />
        </div>
      ) : null}
    </AuthProvider>
  );
}