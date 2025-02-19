import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './styles.module.scss';
import { faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/services/api';
import { AxiosResponse } from 'axios';
import IEndereco from '@/interfaces/IEndereco';
import { toast } from 'react-toastify';
import CustomButton from '@/components/CustomButton';
import { InputFormMask, InputGroup } from '@/components/CustomInput';
import IConfiguracao from '@/interfaces/IConfiguracao';
import { AddressSearch, IAddress } from '@/components/AddressSearch';
import { fGetNumber, fGetOnlyNumber } from '@/utils/functions';

type orderEntregaProps = {
    handleTaxa: (endereco?: IEndereco, taxa?: number) => void;
    configuracao: IConfiguracao
}

export default function Entrega({ handleTaxa, configuracao }: orderEntregaProps) {
    const [isReadOnly, setIsReadOnly] = useState(false);
    const nroRef = useRef<HTMLInputElement>(null);
    const [endereco, setEndereco] = useState<IEndereco>({} as IEndereco);
    const [empresa, setEmpresa] = useState('');
    const [typeEntrega, setTypeEntrega] = useState<'' | 'ENTREGA' | 'RETIRA'>('');
    useEffect(() => {
        setEmpresa(sessionStorage.getItem('empresa') || '');
    }, []);
    function getTaxaEntrega() {
        const cep = fGetOnlyNumber(endereco.cep);
        if (!cep && cep.length != 8) {
            toast.error(`Cep invalido`);
            return;

        }
        api.get(`/MenuDigital/CalculaFrete?empresa=${empresa}&latitude=${endereco.latitude}&longitude=${endereco.longitude}`)
            .then((r) => {
                setIsReadOnly(true);
                if (isNaN(r.data) || r.data < 0) {
                    toast.error(`Erro ao gerar taxa de entrega`);
                    return;
                }
                confirmEndereco(r.data);
            }).catch((err) => {
                toast.error(err.response.data);
            });
    }
    function confirmEndereco(taxa) {
        const cep = fGetOnlyNumber(endereco.cep);
        if (!cep && cep.length != 8) {
            toast.error(`Cep invalido`);
            return;
        }else if (endereco.numero === '' || endereco.numero === undefined || endereco.numero === null) {
            toast.error('Numero invalido');
            return;
        }
        handleTaxa(endereco, taxa);
    }

    const handleSelectAddress = (a: IAddress) => {
        setEndereco({
            altitude: 0,
            longitude: Number(a.lng),
            latitude: Number(a.lat),
            bairro: a.district,
            cidade: {
                nome: a.city,
                ddd: fGetNumber(a.ddd),
                ibge: a.cityIbge
            },
            complemento: '',
            estado: {
                sigla: "SP"
            },
            logradouro: a.address,
            cep: a.cep
        })

    }

    if (typeEntrega == '') {
        return (
            <div className={styles.container} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <CustomButton style={{ width: '40%' }} onClick={() => {
                    handleTaxa();
                }} typeButton={'outline'}>Balcão</CustomButton>
                <CustomButton disabled={!configuracao?.aberto || !configuracao?.entrega} style={{ width: '40%' }} onClick={() => {
                    setTypeEntrega('ENTREGA');
                }} typeButton={'primary'}>Entregar</CustomButton>

            </div>
        )
    }

    if (!endereco.logradouro) {
        return (
            <div className={styles.container}>
                <AddressSearch handleSelectAddress={handleSelectAddress} />
            </div>
        )
    }
    return (
        <div className={styles.container}>
            <InputGroup readOnly={true} width={'100%'} title={'Logradouro'} value={endereco.logradouro} placeholder='Logradouro' className={styles.input} />
            <div className={styles.containerFlex}>
                <InputFormMask width={'25%'} readOnly={true} value={endereco?.cep} mask={"99999-999"} placeholder='_____-___' className={styles.input} title={'Agora informe o CEP'} />
                <InputGroup width={'25%'} title={'Numero'} onChange={(e) => { setEndereco({ ...endereco, numero: e.target.value }) }} ref={nroRef} value={endereco.numero} placeholder='Numero' className={styles.input} />
                <InputGroup width={'25%'} title={'Complemento'} onChange={(e) => { setEndereco({ ...endereco, complemento: e.target.value }) }} value={endereco.compl} placeholder='Complemento' className={styles.input} />
                <CustomButton style={{ height: 30, marginTop: 22 }} typeButton={'primary'} onClick={getTaxaEntrega}>Calcular Frete</CustomButton>
            </div>
        </div>
    )

    // return (
    //     <div className={styles.container}>
    //         <div className={styles.containerFlex}>
    //             <InputFormMask readOnly={isReadOnly} value={cep} onChange={(e) => { setCep(e.target.value); }} mask={"99999-999"} placeholder='_____-___' className={styles.input} title={'CEP'} />
    //             {!isReadOnly ?
    //                 (<a className={styles.search} onClick={searchCep}><FontAwesomeIcon icon={faSearch} /></a>) :
    //                 (<a className={styles.search} onClick={cleanCep}><FontAwesomeIcon icon={faRefresh} /></a>)
    //             }
    //         </div>
    //         <div hidden={endereco.latitude === 0 || endereco.latitude === undefined}>
    //             <InputGroup value={endereco.logradouro} title={'Logradouro'} onChange={(e) => { setEndereco({ ...endereco, logradouro: e.target.value }) }} />
    //             <div className={styles.containerFlex}>
    //                 <InputGroup width={'50%'} title={'Numero'} onChange={(e) => { setEndereco({ ...endereco, numero: e.target.value }) }} ref={nroRef} value={endereco.numero} placeholder='Numero' className={styles.input} />
    //                 <InputGroup width={'50%'} title={'Complemento'} onChange={(e) => { setEndereco({ ...endereco, complemento: e.target.value }) }} value={endereco.compl} placeholder='Complemento' className={styles.input} />
    //             </div>
    //             <div className={styles.containerFlex}>
    //                 <InputGroup width={'50%'} title={'Bairro'} onChange={(e) => { setEndereco({ ...endereco, bairro: e.target.value }) }} readOnly={isReadOnly} value={endereco.bairro} placeholder='Bairro' className={styles.input} />
    //                 <InputGroup width={'50%'} title={'Cidade'} readOnly={isReadOnly} value={endereco.cidade?.nome} placeholder='Cidade' className={styles.input} />
    //             </div>
    //             <br />
    //             <div className={styles.containerFlex}>
    //                 <CustomButton style={{ width: '100%' }} typeButton={'primary'} onClick={confirmEndereco} >Confirmar Endereco</CustomButton>
    //             </div>
    //         </div>
    //     </div>
    // )
}
