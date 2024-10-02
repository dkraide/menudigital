import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { api } from '@/services/api';
import IEmpresa from '@/interfaces/IEmpresa';
import IConfiguracao from '@/interfaces/IConfiguracao';


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
    }, []);
    async function getEmpresa(empr: string) {
        await api.get(`/MenuDigital/Empresa/${empr}`)
            .then((r) => {
                setEmpresa(r.data);
            }).catch((r) => {
            });
        await api
            .get(`/MenuDigital/Configuracao?id=${empr}&withHorarios=true`)
            .then((r) => {
                setConfig(r.data);
            }).catch((r) => {
            });

            setLoading(false);

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
                        src={config.logoPath}
                        alt="Logo Empresa"
                        className={styles.logo}
                    />
                    <h1>{empresa?.nomeFantasia}</h1>
                    <div className={styles.info}>
                        <span className={config.aberto ? styles.open : styles.closed}>{config.aberto ? '🟢 Aberto' : '🔴 Fechado'}</span>
                    </div>
                    <hr/>
                    <div className={styles.deliveryInfo}>
                        <p>Tempo de espera:<br/> {config.tempoEspera || 'Menos de 1hr'}</p>
                        <p>Taxa de entrega:<br/> A partir R$ {config.valorInicial.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}