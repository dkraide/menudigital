import { IPromocaoProduto } from '@/interfaces/IPromocao';
import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type boxProps = {
    produto: IPromocaoProduto;
    handleChange: (operator: string, index: number) => void;
    index: number;
}

export default function BoxPromocaoProduto({ produto, handleChange, index }: boxProps) {

    return (
        <div className={styles.container}>
            <div className={styles.containerInfo} >
                <label className={styles.lblTitle}>{produto.nome}</label>
                <div className={styles.containerAdd}>
                    <div className={styles.containerButtons}>
                        <div className={styles.icon}>
                            <FontAwesomeIcon onClick={() => { handleChange('-', index) }} icon={faMinus} />
                        </div>
                        <input readOnly value={produto.quantidade} />
                        <div className={styles.icon}>
                            <FontAwesomeIcon onClick={() => { handleChange('+', index) }} icon={faPlus} />
                        </div>
                    </div>
                </div>
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
        </div>
    )

    return (
        <div className={styles.container}>
            <img className={styles.img} src={produto.imagem} />
            <div className={styles.info}>
                <p className={styles.title}>{produto.nome}</p>
                <p className={styles.descricao}>{produto.descricao}</p>
                <div className={styles.containerAdd}>
                    <p className={styles.title}>R${produto.valor.toFixed(2)}</p>
                    <div className={styles.add}>
                        <FontAwesomeIcon className={styles.icon} icon={faMinus} size={'xl'} onClick={() => { handleChange('-', index) }} />
                        <input value={produto.quantidade} readOnly className={styles.input} />
                        <FontAwesomeIcon className={styles.icon} icon={faPlus} size={'xl'} onClick={() => { handleChange('+', index) }} />
                    </div>
                </div>
            </div>
        </div>
    )
}