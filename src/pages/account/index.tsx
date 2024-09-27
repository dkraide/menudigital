import Header from '@/components/Header';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import IUser from '@/interfaces/IUser';
import { getUser, login } from '@/utils/functions';
import Entrar from '@/components/Finalizar/Entrar';
import Welcome from '@/components/Account/Welcome';
import DividerLine from '@/components/DividerLine';
import Orders from '@/components/Account/Orders';


export default function Account() {

    const [user, setUser] = useState<IUser>();

    useEffect(() => {
        var u = getUser();
        if (u) {
            setUser(u);
        }
    }, []);

    const handleUser = (user, isLogged) => {
        if(isLogged){
            login(user);
            setUser(user);
        }
    }


    return (
        <div className={styles.container}>
            <Header />
            {!!user ? <>
            <Welcome user={user}/>
            <DividerLine/>
            <Orders user={user}/>
              
            </> : <>
              <Entrar handleUser={handleUser}/>
            </>}




        </div>
    )
}