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
            <img className={styles.img} src={produto.imagem} />
            <div className={styles.info}>
                <p className={styles.title}>{produto.nome}</p>
                <p className={styles.descricao}>{produto.descricao}</p>
                <div className={styles.containerAdd}>
                    <p className={styles.title}>R${produto.valor.toFixed(2)}</p>
                    <div className={styles.add}>
                        <FontAwesomeIcon className={styles.icon} icon={faMinus} size={'xl'} onClick={() => {handleChange('-', index)}} />
                        <input value={produto.quantidade} readOnly className={styles.input} />
                        <FontAwesomeIcon className={styles.icon} icon={faPlus} size={'xl'} onClick={() => {handleChange('+', index)}} />
                    </div>
                </div>
            </div>
        </div>
    )
}