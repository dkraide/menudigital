import IUser from '@/interfaces/IUser';
import styles from './styles.module.scss';
import InputMask from 'react-input-mask';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { InputFormMask, InputGroup } from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import { toast } from 'react-toastify';
import { getUser } from '@/utils/functions';

type userProps = {
    handleUser: (user: IUser, isLogin: boolean) => void;
}
export default function Entrar({ handleUser }: userProps) {
    const [user, setUser] = useState<IUser>({} as IUser)
    useEffect(() => {
        var u = getUser();
        if(u){
            handleUser(u, true);
        }
    }, []);

    const handleEntrar = () => {
        if(!user.name || user.name.length == 0){
            toast.error(`Informe um nome`);
            return;
        }
        if(!user.phone || user.phone.length == 0){
            toast.error(`Informe um telefone`);
            return;
        }
        handleUser(user, true);
    }
    return (
        <div className={styles.container} style={{display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h4 className={styles.title}>Entrar</h4>
            <div className={styles.container}>
                <InputGroup value={user?.name} onChange={(e) => { setUser({ ...user, name: e.target.value }); }} placeholder='Seu nome' title={'Nome'} />
                <InputFormMask value={user?.phone} onChange={(e) => { setUser({ ...user, phone: e.target.value }); }} mask="(99)99999-9999" placeholder='(__) _____-____' title={'Telefone'} />
            </div>
            <CustomButton typeButton={'primary'} onClick={handleEntrar}>Entrar</CustomButton>
        </div>
    )
}