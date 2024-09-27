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

type orderEntregaProps = {
    handleTaxa: (endereco?: IEndereco, taxa?: number) => void;
}

export default function Entrega({ handleTaxa }: orderEntregaProps) {
    const [cep, setCep] = useState('');
    const [isReadOnly, setIsReadOnly] = useState(false);
    const nroRef = useRef<HTMLInputElement>(null);
    const [endereco, setEndereco] = useState<IEndereco>({} as IEndereco);
    const [empresa, setEmpresa] = useState('');
    const [taxa, setTaxa] = useState(-1);
   const  [typeEntrega, setTypeEntrega] = useState<''| 'ENTREGA' | 'RETIRA'>('');
    useEffect(() => {
        setEmpresa(sessionStorage.getItem('empresa') || '');
    }, []);
    function searchCep() {
        api.get(`/MenuDigital/cep/${cep.replaceAll('-', '')}`)
            .then(({ data }: AxiosResponse<IEndereco>) => {
                setEndereco(data);
                getTaxaEntrega(data.latitude, data.longitude);
                setTimeout(() => {
                    nroRef.current?.focus();
                }, 300);
            })
            .catch((err) => {
                toast.error(err.response.data);
            });
    }
    function cleanCep() {
        setCep('');
        setEndereco({} as IEndereco);
        handleTaxa({} as IEndereco, -1);
        setIsReadOnly(false);
    }
    function getTaxaEntrega(lat: number, lng: number) {

        api.get(`/MenuDigital/CalculaFrete?empresa=${empresa}&latitude=${lat}&longitude=${lng}`)
            .then((r) => {
                setIsReadOnly(true);
                setTaxa(r.data);
            }).catch((err) => {
                toast.error(err.response.data);
            });
    }
    function confirmEndereco() {
        if (cep === '') {
            toast.error('Cep invalido');
            return;
        } else if (endereco.numero === '' || endereco.numero === undefined || endereco.numero === null) {
            toast.error('Numero invalido');
            return;
        }
        handleTaxa(endereco, taxa);
    }

    if(typeEntrega == ''){
        return(
            <div className={styles.container} style={{display:'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <CustomButton style={{width: '40%'}} onClick={() => {
                    handleTaxa();
                }} typeButton={'outline'}>Balcão</CustomButton>
                <CustomButton style={{width: '40%'}}  onClick={() => {
                    setTypeEntrega('ENTREGA');
                }} typeButton={'primary'}>Entregar</CustomButton>

            </div>
        )
    }
    return (
        <div className={styles.container}>
            <div className={styles.containerFlex}>
                <InputFormMask readOnly={isReadOnly} value={cep} onChange={(e) => { setCep(e.target.value); }} mask={"99999-999"} placeholder='_____-___' className={styles.input} title={'CEP'} />
                {!isReadOnly ?
                    (<a className={styles.search} onClick={searchCep}><FontAwesomeIcon icon={faSearch} /></a>) :
                    (<a className={styles.search} onClick={cleanCep}><FontAwesomeIcon icon={faRefresh} /></a>)
                }
            </div>
            <div hidden={endereco.latitude === 0 || endereco.latitude === undefined}>
                <InputGroup value={endereco.logradouro} title={'Logradouro'} onChange={(e) => { setEndereco({ ...endereco, logradouro: e.target.value }) }} />
                <div className={styles.containerFlex}>
                    <InputGroup width={'50%'} title={'Numero'} onChange={(e) => { setEndereco({ ...endereco, numero: e.target.value }) }} ref={nroRef} value={endereco.numero} placeholder='Numero' className={styles.input} />
                    <InputGroup width={'50%'} title={'Complemento'} onChange={(e) => { setEndereco({ ...endereco, complemento: e.target.value }) }} value={endereco.compl} placeholder='Complemento' className={styles.input} />
                </div>
                <div className={styles.containerFlex}>
                    <InputGroup width={'50%'} title={'Bairro'}  onChange={(e) => { setEndereco({ ...endereco, bairro: e.target.value }) }} readOnly={isReadOnly} value={endereco.bairro} placeholder='Bairro' className={styles.input} />
                    <InputGroup width={'50%'} title={'Cidade'} readOnly={isReadOnly} value={endereco.cidade?.nome} placeholder='Cidade' className={styles.input} />
                </div>
                <br />
                <div className={styles.containerFlex}>
                    <CustomButton style={{ width: '100%' }} typeButton={'primary'} onClick={confirmEndereco} >Confirmar Endereco</CustomButton>
                </div>
            </div>
        </div>
    )
}
