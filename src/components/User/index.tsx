import IUser from '@/interfaces/IUser';
import styles from './styles.module.scss';
import InputMask from 'react-input-mask';
import { useEffect, useState } from 'react';

type userProps = {
    user: IUser;
    isLoggedIn: boolean;
    handleUser: (user: IUser, isLogin: boolean) => void;
}
export default function User({ user, isLoggedIn, handleUser }: userProps) {
    const [u, setU] = useState<IUser>({} as IUser);
    useEffect(() => {
        setU(user);
    }, [user]);
    function setUser(isLogin: boolean){
        if(!isLogin){
            setU({} as IUser);
        }
        handleUser(u as IUser, isLogin);
    }
    return (
        <>
            <div className={styles.container}>
                <div className={styles.inputGroup}>
                    <label>Nome</label>
                    <input value={u?.name || ''} onChange={(e) => {setU({...u as IUser, name: e.target.value})}} readOnly={isLoggedIn} placeholder='Seu nome' />
                </div>
                <div className={styles.inputGroup}>
                    <label>Telefone</label>
                    <InputMask value={u?.phone || ''} onChange={(e) => {setU({...u as IUser, phone: e.target.value})}} readOnly={isLoggedIn} mask="(99)99999-9999" placeholder='(__) _____-____' />
                </div>
            </div>
            {isLoggedIn ? (
                <button className={styles.btnSair} onClick={() => {setUser(false)}}>Sair</button>
            ) : (
                <button className={styles.btnEntrar}  onClick={() => {setUser(true)}}>Entrar</button>
            )}

        </>
    )
}