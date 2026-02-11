import { createContext, ReactNode, useEffect, useState } from "react"
import { destroyCookie, setCookie, parseCookies } from 'nookies';
import IUser from "@/interfaces/IUser";
type AuthContextData = {
    setEmpresaId: (empresaId: number) => Promise<void>
    getEmpresaId: () => Promise<number>
    signIn: (user: IUser) => Promise<void>
    signOff: () => Promise<void>
    user: IUser | undefined
}
type AuthProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)
export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<IUser>();

    useEffect(() => {
        var cookies = parseCookies(undefined);
        var userStr = cookies['@menudigital.user'];
        if (userStr) {
            var u = JSON.parse(userStr) as IUser;
            setUser(u);
        }
    }, [])

    async function setEmpresaId(empresaId: number) {
        setCookie(undefined, '@menudigital.empresaId', empresaId.toString(), {
            maxAge: 60 * 60 * 24 * 30, //expirar em 1 mes,
            path: "/" //quais caminhos terao acesso aos cookies
        });

    }
    async function getEmpresaId() {
        var cookies = parseCookies(undefined);
        var userStr = cookies['@menudigital.empresaId'];
        if (!userStr) {
            return 0;
        }
        return Number(userStr);
    }
    async function signIn(user: IUser) {
        const userStr = JSON.stringify(user);
        await setCookie(undefined, '@menudigital.user', userStr, {
            maxAge: 60 * 60 * 24 * 30, //expirar em 1 mes,
            path: "/" //quais caminhos terao acesso aos cookies
        });
        setUser(user);
    }
    async function signOff(){
        //    await setCookie(undefined, '@menudigital.user', undefined, {
        //     maxAge: 60 * 60 * 24 * 30, //expirar em 1 mes,
        //     path: "/" //quais caminhos terao acesso aos cookies
        // });
        // setUser(undefined);
    }

    return (
        <AuthContext.Provider value={{ setEmpresaId, getEmpresaId, signIn, user, signOff }}>
            {children}
        </AuthContext.Provider>
    )
}