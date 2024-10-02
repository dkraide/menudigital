import { IGrupoAdicional } from '@/interfaces/IClasseProduto';
import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import _ from 'lodash';

type boxAdicionalProp = {
    grupo: IGrupoAdicional;
    index: number;
    changeQuantity: (type: string, indexGroup: number, index: number) => void;
}
export default function BoxAdicional({ grupo, changeQuantity, index }: boxAdicionalProp) {
    function getTotal(): number {
        return _.sumBy(grupo.itens, e => e.quantidade);
    }

    function getText(){
        if(grupo.min == grupo.max){
            return `Selecione ${grupo.max} ${grupo.descricao}`
        }
        if(grupo.min == 0){
            return `Selecione até ${grupo.max} ${grupo.descricao}`;
        }
        return `Selecione ao menos ${grupo.min} até ${grupo.max} ${grupo.descricao}`;
    }
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.row}>
                    <b>{getText()}</b>
                    <p>{grupo.min > 0 ? `Entre ${grupo.min} e ${grupo.max}` : `Até ${grupo.max}`} {grupo.max > 1 ? `opções` : `opção`}</p>
                </div>
                <p className={styles.selected}>Selecionado: {getTotal()}</p>
            </div>
            <div className={styles.content}>
                {grupo.itens.map((item, indexItem) => {
                    if (item.quantidade === undefined) {
                        item.quantidade = 0;
                    }

                    return (
                        <div className={styles.item} key={item.id}>
                            <img onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src = '/comida.png';
                            }} src={item.imagem} alt='Imagem do adicional'></img>
                            <div className={styles.itemInfo}>
                                <b>{item.nome}</b>
                                <p>R$ {item.valor.toFixed(2)}</p>
                            </div>
                            <div className={styles.containerButtons}>
                                <div className={styles.icon}>
                                    <FontAwesomeIcon onClick={() => { changeQuantity('-', index, indexItem) }} icon={faMinus} />
                                </div>
                                <input readOnly value={item.quantidade} />
                                <div className={styles.icon}>
                                    <FontAwesomeIcon onClick={() => { changeQuantity('+', index, indexItem) }} icon={faPlus} />

                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}