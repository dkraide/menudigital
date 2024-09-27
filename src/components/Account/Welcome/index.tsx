import IUser from '@/interfaces/IUser';
import styles from './styles.module.scss';
import CustomButton from '@/components/CustomButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { login } from '@/utils/functions';

type props = {
    user: IUser
}

export default function Welcome({user} : props){

    const handleLogOff = () => {
        login({});
        window.location.reload();
    }
    return(
        <div className={styles.container}>
            <span className={styles.welcomeText}>Bem vindo(a), {user.name}.</span>
            <CustomButton onClick={handleLogOff} typeButton={'primary'}><FontAwesomeIcon icon={faPowerOff}/></CustomButton>
        </div>
    )

}
