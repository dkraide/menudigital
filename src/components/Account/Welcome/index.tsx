import IUser from '@/interfaces/IUser';
import styles from './styles.module.scss';
import CustomButton from '@/components/CustomButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContexto';
type props = {
    user: IUser
}

export default function Welcome({user} : props){
    const {signOff} = useContext(AuthContext);

    const handleLogOff = () => {
        signOff();
    }
    return(
        <div className={styles.container}>
            <span className={styles.welcomeText}>Bem vindo(a), {user.nome}.</span>
            <CustomButton onClick={handleLogOff} typeButton={'primary'}><FontAwesomeIcon icon={faPowerOff}/></CustomButton>
        </div>
    )

}
