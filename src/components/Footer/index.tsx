import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './styles.module.scss';
import { faCartPlus, faGear, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
export default function Footer() {



    const BoxIcon = ({icon, text, route}) => {
        return (
            <div onClick={() => {window.location.href = `/${route}`}} className={styles.boxIcon}>
                 <FontAwesomeIcon icon={icon} size={'xl'}/>
                 <span>{text}</span>
            </div>
        )
    }

    return (
        <div className={styles.container}>
             <BoxIcon icon={faCartPlus} text={'Carrinho'} route={'finalizar'}/>
             <BoxIcon icon={faUtensils} text={'Cardapio'} route={''}/>
             <BoxIcon icon={faUser} text={'Conta'} route={'account'}/>
             <BoxIcon icon={faGear} text={'Loja'} route={'loja'}/>
        </div>
    )

}