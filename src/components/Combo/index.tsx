import ICombo from "@/interfaces/ICombo";
import styles from './styles.module.scss';
import Link from "next/link";

export default function Combo(combo: ICombo) {
  return (
    <Link
      href={`/combo?comboId=${combo.id}`} className={styles.container}>
      <div className={styles.containerInfo} >
        <label className={styles.lblTitle}>{combo.codigo}</label>
        <label className={styles.lblDesc}>{combo.descricao}</label>
        <span className={styles.lblValue}>
          R$ {combo?.valor?.toFixed(2)}
        </span>
      </div>
      <div style={{ width: '40%', display: 'flex', justifyContent: 'flex-end', paddingRight: '10px' }}>
        <img
          src={combo.imagem || '/comida.png'}
          className={styles.pic}
          onError={(e) => { e.currentTarget.src = '/comida.png' }}
          alt={'combo'}
          width={100}
          height={100}>
        </img>
      </div>
    </Link>
  )
}