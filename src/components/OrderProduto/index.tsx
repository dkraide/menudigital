import { IOrderProduto } from '@/interfaces/IOrder';
import styles from './styles.module.scss';
import { FiTrash2 } from 'react-icons/fi';

interface OrderProdutoProps extends IOrderProduto {
    onRemove?: () => void;
}

export default function OrderProduto({ imagem, nome, descricao, adicionais, quantidade, valorUn, valorTotal, onRemove }: OrderProdutoProps) {
    return (
        <div className={styles.containerPromo}>
            <img className={styles.imgI} src={imagem} />
            <div className={styles.promoDesc}>
                <p className={styles.title}>{nome}</p>
                <p className={styles.desc}>{descricao}</p>
                {adicionais?.map((adicional, index) => (
                    <p key={index}>{adicional.nome}</p>
                ))}
                <p className={styles.value}>{quantidade.toFixed(2)} x R${valorUn.toFixed(2)} = R${valorTotal.toFixed(2)}</p>
            </div>
            <div className={styles.iconContainer}>
                {onRemove && (
                    <FiTrash2 className={styles.removerIcon} onClick={onRemove} />
                )}
            </div>
        </div>
    );
}