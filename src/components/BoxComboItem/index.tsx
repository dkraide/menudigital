import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './styles.module.scss';
import {ComboItem} from '@/interfaces/ICombo';
import { faArrowDown, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

type boxItemProps = {
    item: ComboItem;
    index: number;
    handleChange: (indexItem: number, indexSubItem: number, operator: string) => void;
    quantidade: number;
}

export default function BoxComboItem({item, handleChange, index, quantidade}:boxItemProps){
    if(item.produtos !== null && item.produtos.length > 0){
        return(
          <div className={styles.containerGroup}>
             <div className={styles.titleGroup}>
             <FontAwesomeIcon icon={faArrowDown} size='1x'/>
             <p className={styles.groupTitle}>Escolha ate {item.quantidade} opcoes</p>
             <p className={styles.title}>{quantidade} de {item.quantidade}</p>
             </div>
              {item.produtos.map((p, indexSubItem) => {
                return(
                    <div className={styles.container} key={indexSubItem}>
                    <img className={styles.img} src={p.imagem} />
                    <div className={styles.info}>
                        <p className={styles.title}>{p.nome}</p>
                        <p className={styles.descricao}>{p.descricao}</p>
                        <div className={styles.containerAdd}>
                            <div className={styles.add}>
                                {p.quantidade <= 0 ? (<></>) : (
                                <FontAwesomeIcon className={styles.icon} icon={faMinus} size={'xl'} onClick={() => {handleChange(index, indexSubItem, '-')}}/>
                                )}
                                <input value={p.quantidade} readOnly className={styles.input} />
                               {quantidade < item.quantidade ? (
                                 <FontAwesomeIcon className={styles.icon} icon={faPlus} size={'xl'} onClick={() => {handleChange(index, indexSubItem, '+')}}/>
                               ) : (<></>)}
                            </div>
                        </div>
                    </div>
                </div>
                )
              } )}
          </div>
        )
    }
    return (
        <div className={styles.container}>
            <img className={styles.img} src={item.produto.imagem} />
            <div className={styles.info}>
                <p className={styles.title}>{item.produto.nome}</p>
                <p className={styles.descricao}>{item.produto.descricao}</p>
                <div className={styles.containerAdd}>
                    <div className={styles.add}>
                        <input value={item.quantidade} readOnly className={styles.input} />
                    </div>
                </div>
            </div>
        </div>
    )
}