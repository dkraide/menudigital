import { CircleLoader } from 'react-spinners';
import styles from './styles.module.scss';
export default function Loading({size, color} : {size?: number, color?: string}) {
    return (
        <div className={styles.container}>
           <CircleLoader color={color || 'var(--main)'}  size={size || 50}/>
        </div>
    )
}