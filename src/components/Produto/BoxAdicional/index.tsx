import { IGrupoAdicional } from '@/interfaces/IClasseProduto';
import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import _ from 'lodash';

type boxAdicionalProp = {
    grupo: IGrupoAdicional;
    index: number;
    changeQuantity: (type: string, indexGroup: number,  index: number) => void;
}
export default function BoxAdicional({ grupo, changeQuantity, index }: boxAdicionalProp) {
    function getTotal(): number{
       return _.sumBy(grupo.itens, e => e.quantidade);
    }
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <b>Selecione ate {grupo.max} de {grupo.descricao}</b>
                <p>Min: {grupo.min} | Max: {grupo.max}</p>
                <p>Selecionado: {getTotal()}</p>
            </div>
            <div className={styles.content}>
                {grupo.itens.map((item, indexItem) => {
                    if(item.quantidade === undefined){
                        item.quantidade = 0;
                    }

                    return (
                        <div className={styles.item} key={item.id}>
                            <img onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src = "https://krd.emartim.com.br/MenuDigital/1072_998.jpg";
                            }} src={item.imagem} alt='Imagem do adicional'></img>
                            <div className={styles.itemInfo}>
                                <b>{item.nome}</b>
                                <p>R$ {item.valor.toFixed(2)}</p>
                            </div>
                            <div className={styles.containerButtons}>
                                <FontAwesomeIcon onClick={() => { changeQuantity('-', index, indexItem) }} className={styles.icon} icon={faMinus} />
                                <input readOnly value={item.quantidade} />
                                <FontAwesomeIcon onClick={() => { changeQuantity('+', index, indexItem) }} className={styles.icon} icon={faPlus} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}