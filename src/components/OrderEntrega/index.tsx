import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './styles.module.scss';
import { faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons';
import InputMask from 'react-input-mask';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/services/api';
import { AxiosResponse } from 'axios';
import IEndereco from '@/interfaces/IEndereco';
import { toast } from 'react-toastify';

type orderEntregaProps = {
    handleTaxa: (endereco: IEndereco, taxa: number) => void;
}

export default function OrderEntrega({ handleTaxa }: orderEntregaProps) {
    const [cep, setCep] = useState('');
    const [isReadOnly, setIsReadOnly] = useState(false);
    const nroRef = useRef<HTMLInputElement>(null);
    const [endereco, setEndereco] = useState<IEndereco>({} as IEndereco);
    const [empresa, setEmpresa] = useState('');
    const [taxa, setTaxa] = useState(-1);

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
    function confirmEndereco(){
        if(cep === ''){
            toast.error('Cep invalido');
            return;
        }else if(endereco.numero === '' || endereco.numero === undefined || endereco.numero === null){
            toast.error('Numero invalido');
            return;
        }
        handleTaxa(endereco, taxa);
    }
    return (
        <div className={styles.container}>
            <div className={styles.inputGroup50}>
                <label className={styles.label}>CEP</label>
                <div className={styles.containerFlex}>
                    <InputMask readOnly={isReadOnly} value={cep} onChange={(e) => { setCep(e.target.value) }} mask={"99999-999"} placeholder='_____-___' className={styles.input} />
                    {!isReadOnly ?
                        (<a className={styles.search} onClick={searchCep}><FontAwesomeIcon icon={faSearch} /></a>) :
                        (<a className={styles.search} onClick={cleanCep}><FontAwesomeIcon icon={faRefresh} /></a>)
                    }
                </div>
            </div>
            <div hidden={endereco.latitude === 0 || endereco.latitude === undefined}>
                <div className={styles.inputGroup100}>
                    <label className={styles.label}>Logradouro</label>
                    <input onChange={(e) => {setEndereco({...endereco, logradouro: e.target.value})}} readOnly={isReadOnly} value={endereco.logradouro} placeholder='Insira o Logradouro' className={styles.input} />
                </div>
                <div className={styles.containerFlex}>
                    <div className={styles.inputGroup25}>
                        <label className={styles.label}>Nro.</label>
                        <input onChange={(e) => {setEndereco({...endereco, numero: e.target.value})}} ref={nroRef} value={endereco.numero} placeholder='Numero' className={styles.input} />
                    </div>
                    <div className={styles.inputGroup25}>
                        <label className={styles.label}>Compl.</label>
                        <input onChange={(e) => {setEndereco({...endereco, complemento: e.target.value})}} value={endereco.compl} placeholder='Complemento' className={styles.input} />
                    </div>
                </div>
                <div className={styles.containerFlex}>
                    <div className={styles.inputGroup50}>
                        <label className={styles.label}>Bairro</label>
                        <input onChange={(e) => {setEndereco({...endereco, bairro: e.target.value})}} readOnly={isReadOnly} value={endereco.bairro} placeholder='Bairro' className={styles.input} />
                    </div>
                    <div className={styles.inputGroup50}>
                        <label className={styles.label}>Cidade</label>
                        <input  readOnly={isReadOnly} value={endereco.cidade?.nome} placeholder='Cidade' className={styles.input} />
                    </div>
                </div>
                <br/>
                <div className={styles.containerFlex}>
                     <a onClick={confirmEndereco} className={styles.btnConfirma}>Confirmar Endereco</a>
                </div>
            </div>
        </div>
    )
}
