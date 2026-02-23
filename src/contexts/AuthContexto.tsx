import { createContext, ReactNode, useEffect, useState } from "react";
import { setCookie, destroyCookie, parseCookies } from 'nookies';
import IUser from "@/interfaces/IUser";

type AuthContextData = {
    empresaId: number | null;
    setEmpresaId: (empresaId: number) => void;
    signIn: (user: IUser) => Promise<void>;
    signOff: () => Promise<void>;
    user: IUser | undefined;
};

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<IUser>();
    const [empresaId, setEmpresaIdState] = useState<number | null>(null);

    useEffect(() => {
        const cookies = parseCookies();

        // Restaura o usuário
        const userStr = cookies['@menudigital.user'];
        if (userStr) {
            const u = JSON.parse(userStr) as IUser;
            setUser(u);
        }

        // ✅ Restaura o empresaId do cookie
        const empresaIdStr = cookies['@menudigital.empresaId'];
        if (empresaIdStr) {
            setEmpresaIdState(Number(empresaIdStr));
        }
    }, []);

    // ✅ Persiste no cookie ao setar
    function setEmpresaId(id: number) {
        setCookie(undefined, '@menudigital.empresaId', String(id), {
            maxAge: 60 * 60 * 24 * 30, // 30 dias
            path: "/",
        });
        setEmpresaIdState(id);
    }

    async function signIn(user: IUser) {
        const userStr = JSON.stringify(user);

        setCookie(undefined, '@menudigital.user', userStr, {
            maxAge: 60 * 60 * 24 * 30,
            path: "/"
        });

        setUser(user);
    }

    async function signOff() {
        destroyCookie(undefined, '@menudigital.user', { path: "/" });
        setUser(undefined);
    }

    return (
        <AuthContext.Provider
            value={{
                empresaId,
                setEmpresaId,
                signIn,
                signOff,
                user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}