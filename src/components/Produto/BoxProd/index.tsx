import IClasseProduto from '@/interfaces/IClasseProduto';
import styles from './styles.module.scss';
import Link from 'next/link';
import DividerLine from '@/components/DividerLine';

export default function BoxProd(produto: IClasseProduto) {

  if (produto.tipo == "PIZZA") {
    return (
      <Link
        href={`/produto?produtoId=${produto.id}&tamanhoId=${produto.descricao}`} className={styles.container}>
        <div className={styles.containerInfo} >
          <label className={styles.lblTitle}>{produto.nome}</label>
        </div>
        <div style={{ width: '40%', display: 'flex', justifyContent: 'flex-end', paddingRight: '10px' }}>
          <img
            src={produto.imagem || '/comida.png'}
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


  return (
    <Link
      href={`/produto?produtoId=${produto.id}`} className={styles.container}>
      <div className={styles.containerInfo} >
        <label className={styles.lblTitle}>{produto.nome}</label>
        <label className={styles.lblDesc}>{produto.descricao}</label>
        <span className={styles.lblValue}>
          R$ {produto?.valor?.toFixed(2)}
        </span>
      </div>
      <div style={{ width: '40%', display: 'flex', justifyContent: 'flex-end', paddingRight: '10px' }}>
        <img
          src={produto.imagem || '/comida.png'}
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