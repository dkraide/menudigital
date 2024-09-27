import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { api } from '@/services/api';
import IEmpresa from '@/interfaces/IEmpresa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBusinessTime, faMapLocation, faShoppingCart, faSquarePhone } from '@fortawesome/free-solid-svg-icons';
import IConfiguracao from '@/interfaces/IConfiguracao';
import Link from 'next/link';


type headerProps = {
    emp?: string;
}
export default function Header({ emp }: headerProps) {


    const [empresa, setEmpresa] = useState<IEmpresa>();
    const [hiddenHorario, setHiddenHorario] = useState(true);
    const [config, setConfig] = useState<IConfiguracao>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        var empresa = emp || sessionStorage.getItem('empresa') || '';
        getEmpresa(empresa);

        var strConfig = sessionStorage.getItem('config');
        if (strConfig !== null) {
            setConfig(JSON.parse(strConfig));
        }

    }, []);
    function getEmpresa(empr: string) {
        api
            .get(`/MenuDigital/Empresa/${empr}`)
            .then((r) => {
                setEmpresa(r.data);
                setLoading(false);
            }).catch((r) => {
            });
        api
            .get(`/MenuDigital/Configuracao?id=${empr}&withHorarios=true`)
            .then((r) => {
                setConfig(r.data);
                setLoading(false);
            }).catch((r) => {
            });
    }
    function getHorarios() {
        setHiddenHorario(!hiddenHorario);

        if (!config) {
            api.get(`/MenuDigital/Configuracao?id=${empresa?.id}&withHorarios=true`)
                .then((r) => {
                    setConfig(r.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }

    }
    if (loading || !config) {
        return (
            <>
            </>
        )
    }
  
    return (
        <div className={styles.header}>
            <div
                className={styles.backgroundImg}
                style={{ backgroundImage: `url(${config?.localPath})` }}
            >
                <div className={styles.headerContent}>
                    <img
                        src={'/logoNatuice.jpg'}
                        alt="Logo Delmar"
                        className={styles.logo}
                    />
                    <h1>{empresa?.nomeFantasia}</h1>
                    <div className={styles.info}>
                        <span className={styles.status}>🟢 Aberto</span>
                    </div>
                    <hr/>
                    <div className={styles.deliveryInfo}>
                        <p>Tempo de espera:<br/> 20m - 30m</p>
                        <p>Taxa de entrega:<br/> A partir R$ 0,00</p>
                    </div>
                </div>
            </div>
        </div>
    )
}