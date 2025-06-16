import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './styles.module.scss';
import { ComboItem } from '@/interfaces/ICombo';
import { faArrowDown, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import DividerLine from '../DividerLine';

type boxItemProps = {
    item: ComboItem;
    index: number;
    handleChange: (indexItem: number, indexSubItem: number, operator: string) => void;
    quantidade: number;
}

export default function BoxComboItem({ item, handleChange, index, quantidade }: boxItemProps) {
    if (item.produtos !== null && item.produtos.length > 0) {
        return (
            <div className={styles.containerGroup}>
                <div className={styles.titleGroup}>
                    <p className={styles.groupTitle}>Escolha até {item.quantidade} {item.quantidade > 1 ? 'opcoes' : 'opcao'} de {item.descricao}</p>
                    <p className={styles.title}>{quantidade} de {item.quantidade}</p>
                </div>
                <DividerLine />
                {item.produtos.map((p, indexSubItem) => {
                    return (
                        <div className={styles.container}>
                            <div className={styles.containerInfo} >
                                <label className={styles.lblTitle}>{p.nome}</label>
                                <div className={styles.containerAdd}>
                                    <div className={styles.containerButtons}>
                                        <div className={styles.icon}>
                                            <FontAwesomeIcon onClick={() => { handleChange(index, indexSubItem, '-') }} icon={faMinus} />
                                        </div>
                                        <input readOnly value={p.quantidade} />
                                        <div  className={styles.icon}>
                                            <FontAwesomeIcon onClick={() => { handleChange(index, indexSubItem, '+') }} icon={faPlus} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: '40%', display: 'flex', justifyContent: 'flex-end', paddingRight: '10px' }}>
                                <img
                                    src={p.imagem || '/comida.png'}
                                    className={styles.pic}
                                    onError={(e) => { e.currentTarget.src = '/comida.png' }}
                                    alt={'produto'}
                                    width={100}
                                    height={100}>
                                </img>
                            </div>
                            <DividerLine />
                        </div>
                    )
                })}
            </div>
        )
    }
    return (
        <div className={styles.container}>
            <div className={styles.containerInfo} >
                <label className={styles.lblTitle}>{item.produto.nome}</label>
                <label className={styles.lblDesc}>{item.produto.descricao}</label>
                <span className={styles.lblValue}>
                    R$ {item.valorUnitario.toFixed(2)} ({item.quantidade} {item.produto.unidadeMedida})
                </span>
            </div>
            <div style={{ width: '40%', display: 'flex', justifyContent: 'flex-end', paddingRight: '10px' }}>
                <img
                    src={item.produto.imagem || '/comida.png'}
                    className={styles.pic}
                    onError={(e) => { e.currentTarget.src = '/comida.png' }}
                    alt={'produto'}
                    width={100}
                    height={100}>
                </img>
            </div>
        </div>
    )
}