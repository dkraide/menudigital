// components/AddressSearch.tsx
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { InputFormMask, InputGroup } from '../CustomInput';
import CustomButton from '../CustomButton';
import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { api } from '@/services/api';

type props = {
    handleSelectAddress: (addres: IAddress) => void
}


export function AddressSearch({handleSelectAddress} : props){
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState<boolean>(false);

    // Função para buscar endereços
    const searchAddress = async () => {
        setLoading(true);
        await api.get(`/MenuDigital/Cep/${query}`)
        .then(({data}) => {
            handleSelectAddress(data);
        }).catch((err) => {

        });
        setLoading(false);
    };


    return (
        <div>
            <div className={styles.row}>
            <InputFormMask width={'90%'} value={query} onChange={(e) => { setQuery(e.target.value); }} mask={"99999-999"} placeholder='_____-___' title={'CEP'} />
            <button onClick={searchAddress} className={styles.btnSearch}><FontAwesomeIcon icon={faSearch}/></button>
            </div>
            {loading && (
                <div style={{ marginTop: '10px', fontStyle: 'italic', color: '#888' }}>
                    Carregando...
                </div>
            )}
        </div>
    );
};


// interfaces/Address.ts
 export interface IAddress {
     cep: string;
    addressType: string;
    addressName: string;
    address: string;
    district: string;
    city: string;
    state: string;
    lat: number;
    lng: number;
    ddd: string;
    cityIbge: string;
}