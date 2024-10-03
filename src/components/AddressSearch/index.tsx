// components/AddressSearch.tsx
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { InputGroup } from '../CustomInput';

type props = {
    handleSelectAddress: (addres: IAddressSearchResult) => void
}


export function AddressSearch({handleSelectAddress} : props){
    const [query, setQuery] = useState('');
    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Função para buscar endereços
    const searchAddress = async (searchQuery: string) => {
        if (searchQuery.length > 3) {
            setLoading(true);
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                    params: {
                        q: searchQuery,
                        format: 'json',
                        addressdetails: 1,
                        countrycodes: 'BR', // Limita ao Brasil
                    },
                });
                setAddresses(response.data);
            } catch (error) {
                console.error("Erro na busca de endereços", error);
                setAddresses([]);
            } finally {
                setLoading(false);
            }
        } else {
            setAddresses([]);
        }
    };

    // Debounce a função de busca, com 500ms de delay
    const debouncedSearch = useCallback(
        debounce((searchQuery: string) => {
            searchAddress(searchQuery);
        }, 500),
        [] // Passando array vazio para garantir que o debounce não seja recriado
    );

    // Função para manipular a mudança no campo de pesquisa
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value); // Chama a função debounced
    };

    // Função para formatar o endereço
    const formatAddress = (address: any) => {
        // Acessando os campos de forma segura
        const { road, suburb, city, city_district, municipality, state, country } = address;

        // Construção do endereço formatado
        let formatted = road ? road : ''; // Logradouro

        if (suburb) {
            formatted += `, ${suburb}`; // Bairro
        }

        if (city || city_district || municipality) {
            formatted += `, ${city || city_district || municipality}`; // Cidade, cidade-distrito ou município
        }

        if (state) {
            formatted += `, ${state}`; // Estado
        }

        if (country) {
            formatted += `, ${country}`; // País
        }

        return formatted;
    };

    return (
        <div>
            <InputGroup title={'Digite um endereço'} value={query} onChange={handleInputChange}/>
            {loading && (
                <div style={{ marginTop: '10px', fontStyle: 'italic', color: '#888' }}>
                    Carregando...
                </div>
            )}
            {addresses.length > 0 && !loading && (
                <ul style={{ backgroundColor: 'var(--white)', maxHeight: '200px', overflowY: 'auto', padding: '0', marginTop: '10px', borderRadius: 5 }}>
                    {addresses.map((address: any) => (
                        <li
                            key={address.place_id}
                            style={{ padding: '10px', cursor: 'pointer', fontWeight: 400 }}
                            onClick={() => handleSelectAddress(address)} // Passando o objeto 'address'
                        >
                            {formatAddress(address.address)} {/* Exibe o endereço formatado */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


// interfaces/Address.ts
 export interface IAddress {
    road?: string; // Logradouro
    suburb?: string; // Bairro
    city_district?: string; // Distrito ou cidade-distrito
    city?: string; // Cidade
    municipality?: string; // Município
    county?: string; // Condado (não será usado, mas está disponível na estrutura)
    state?: string; // Estado
    state_district?: string; // Distrito estadual
    region?: string; // Região
    postcode?: string; // CEP
    country?: string; // País
    country_code?: string; // Código do país (ISO 3166-2)
    [key: string]: any; // Outros campos podem ser adicionados dinamicamente
}

export interface IAddressSearchResult {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    class: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype: string;
    name: string;
    display_name: string;
    address: IAddress; // Tipagem do objeto de endereço
    boundingbox: string[];
}
