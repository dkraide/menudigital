import { IOrderProduto } from '@/interfaces/IOrder';
import styles from './styles.module.scss';

export default function OrderProduto(pr: IOrderProduto){
    console.log(pr);
    return (
        <div className={styles.containerPromo}>
            <img className={styles.imgI} src={pr.imagem} />
            <div className={styles.promoDesc}>
                <p className={styles.title}>{pr.nome}</p>
                <p className={styles.desc}>{pr.descricao}</p>
                <p className={styles.value}>{pr.quantidade.toFixed(2)} x R${pr.valorUn.toFixed(2)} = R${pr.valorTotal.toFixed(2)}</p>
            </div>
        </div>
    )
}