import { IOrderPromocao } from '@/interfaces/IOrder';
import styles from './styles.module.scss';
import { useEffect } from 'react';
import DividerLine from '../DividerLine';

type opProps = {
    p: IOrderPromocao;
}
export default function OrderPromocao({ p }: opProps) {
    useEffect(() => {
    }, []);
    return (
        <div className={styles.container}>
            <div className={styles.containerPromo}>
                
                <div className={styles.promoDesc}>
                    <p className={styles.title}>Promoção</p>
                    <p className={styles.desc}>{p.promocao.descricao}</p>
                </div>
            </div>
            <div className={styles.containerProdutos}>
                {p.produtos.map((pr) => {
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
                })}
            </div>
        <div className={styles.divTotal}>
            <p className={styles.total}>+</p>
            <p className={styles.total}>R${p.total.toFixed(2)}</p>
        </div>
          <DividerLine/>
        </div>
    )
}