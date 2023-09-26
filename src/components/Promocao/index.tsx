import IPromocao from '@/interfaces/IPromocao';
import styles from './styles.module.scss';
import Link from 'next/link';

export default function Promocao(promo: IPromocao) {
  return (
    <Link className={styles.container} href={{
      pathname: '/promocao',
      query: { promoId: promo.idPromocao },
    }}>
      <img
        src={promo.imagem}
        className={styles.pic}
        width={100}
        height={100}>
      </img>
      <div className={styles.containerInfo} >
        <label className={styles.lblTitle}>{promo.descricao}</label>
        {promo.quantidade > 1 ?
          (<label className={styles.lblDesc}>
            *Comprando acima de {promo.quantidade}
          </label>) :
          (<label>
          </label>)}
        <label className={styles.lblValue}>
          {promo.valorFinal < promo.valorOriginal ?
            (<label className={styles.lblValueOriginal}>
              R${promo.valorOriginal.toFixed(2)}
            </label>) :
            (<label>
            </label>)}
          Por: R${promo.valorFinal.toFixed(2)}
        </label>
      </div>
    </Link>
  )
}