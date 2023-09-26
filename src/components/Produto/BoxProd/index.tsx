import IClasseProduto from '@/interfaces/IClasseProduto';
import styles from './styles.module.scss';
import Link from 'next/link';

export default function BoxProd(produto: IClasseProduto) {
  return (
    <Link
      href={`/produto?produtoId=${produto.idProduto}`} className={styles.container}>
      <img
        src={produto.imagem}
        className={styles.pic}
        width={100}
        height={100}>
      </img>
      <div className={styles.containerInfo} >
        <label className={styles.lblTitle}>{produto.nome}</label>
        <label className={styles.lblDesc}>{produto.descricao}</label>
        <label className={styles.lblValue}>
          R${produto.valor.toFixed(2)}
        </label>
      </div>
    </Link>
  )
} 