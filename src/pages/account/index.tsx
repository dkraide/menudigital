import Header from '@/components/Header';
import styles from './styles.module.scss';
import { useContext, useEffect, useState } from 'react';
import IUser from '@/interfaces/IUser';
import Entrar from '@/components/Finalizar/Entrar';
import Welcome from '@/components/Account/Welcome';
import DividerLine from '@/components/DividerLine';
import Orders from '@/components/Account/Orders';
import { AuthContext } from '@/contexts/AuthContexto';
import Premios from '@/components/Account/Premios';


export default function Account() {

    const { user, signIn } = useContext(AuthContext);

    const handleUser = (user, isLogged) => {
        if (isLogged) {
            signIn(user);
        }
    }


    return (
        <div className={styles.container}>
            <Header />
            {!!user ? <>
                <Welcome user={user} />
                <DividerLine />
                <Premios/>
                <Orders user={user} />

            </> : <>
                <Entrar handleUser={handleUser} />
            </>}




        </div>
    )
}