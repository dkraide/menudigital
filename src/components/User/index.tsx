import IUser from '@/interfaces/IUser';
import styles from './styles.module.scss';
import InputMask from 'react-input-mask';
import { useEffect, useState } from 'react';
import { InputFormMask, InputGroup } from '../CustomInput';
import CustomButton from '../CustomButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';

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
    function setUser(isLogin: boolean) {
        if (!isLogin) {
            setU({} as IUser);
        }
        handleUser(u as IUser, isLogin);
    }
    if(isLoggedIn){
        return(
            <div style={{marginTop: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <h4>Bem vindo, {u?.name}</h4>
                <a className={styles.powerOff} onClick={() => { setUser(false) }}><FontAwesomeIcon icon={faPowerOff}/></a>
            </div>
        )
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <div className={styles.container}>
                <InputGroup value={u?.name || ''} onChange={(e) => { setU({ ...u as IUser, name: e.target.value }); }} readOnly={isLoggedIn} placeholder='Seu nome' title={'Nome'} />
                <InputFormMask value={u?.phone || ''} onChange={(e) => { setU({ ...u as IUser, phone: e.target.value }); }} readOnly={isLoggedIn} mask="(99)99999-9999" placeholder='(__) _____-____' title={'Telefone'} />
            </div>
            {isLoggedIn ? (
                <CustomButton typeButton={'outline'} onClick={() => { setUser(false) }}>Sair</CustomButton>
            ) : (
                <CustomButton typeButton={'primary'}  onClick={() => { setUser(true) }}>Entrar</CustomButton>
            )}

        </div>
    )
}