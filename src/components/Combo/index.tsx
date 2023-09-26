import ICombo from "@/interfaces/ICombo";
import styles from './styles.module.scss';
import Link from "next/link";

export default function Combo(combo: ICombo) {
  return (
    <Link href={`/combo?comboId=${combo.idCombo}`} className={styles.container}>
      <img
        src={combo.imagem}
        className={styles.pic}
        width={100}
        height={100}>
      </img>
      <div className={styles.containerInfo} >
        <label className={styles.lblTitle}>{combo.codigo}</label>
        <label className={styles.lblDesc}>{combo.descricao}</label>
        <label className={styles.lblValue}>R${combo.valor.toFixed(2)}</label>
      </div>
    </Link>
  )
}