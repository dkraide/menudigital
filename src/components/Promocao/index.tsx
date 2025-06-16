import IPromocao from '@/interfaces/IPromocao';
import styles from './styles.module.scss';
import Link from 'next/link';

export default function Promocao(promo: IPromocao) {
  return (
    <Link
      href={`/promocao?promocaoId=${promo.id}`} className={styles.container}>
      <div className={styles.containerInfo} >
        <label className={styles.lblTitle}>{promo.descricao}</label>
        <label className={styles.lblDesc}>Comprando acima de  {promo.quantidade}</label>
        <span className={styles.lblValue}>
          {promo.valorFinal < promo.valorOriginal ?
            (<label className={styles.lblValueOriginal}>
              R${promo.valorOriginal.toFixed(2)}
            </label>) :
            (<label>
            </label>)}
          Por: R${promo.valorFinal.toFixed(2)}
        </span>
      </div>
      <div style={{ width: '40%', display: 'flex', justifyContent: 'flex-end', paddingRight: '10px' }}>
        <img
          src={promo.imagem || '/comida.png'}
          className={styles.pic}
          onError={(e) => { e.currentTarget.src = '/comida.png' }}
          alt={'produto'}
          width={100}
          height={100}>
        </img>
      </div>
    </Link>
  )
}