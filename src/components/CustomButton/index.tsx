import Loading from '@/components/Loading';
import { ButtonHTMLAttributes } from 'react';
import styles from './styles.module.scss'
import { isMobile } from 'react-device-detect';

interface props extends ButtonHTMLAttributes<HTMLButtonElement> {
    typeButton: 'primary' | 'outline',
    loading?: boolean
}

export default function CustomButton({ loading, typeButton, children, onClick, className, style, ...rest }: props) {

    if (typeButton == 'outline') {
        return <button onClick={onClick} disabled={loading} {...rest} style={Object.assign(style || {}, { minWidth: isMobile ? '50%' : 'none' })} className={[styles[typeButton], className].join(' ')}>
            {loading ? <Loading /> : children}
        </button>
    }
    return <button onClick={onClick} style={Object.assign(style || {}, { minWidth: isMobile ? '50%' : 'none' })} disabled={loading} {...rest} className={[styles[typeButton], className].join(' ')}>
        {loading ? <Loading color={'var(--white)'} /> : children}
    </button>
}