import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { api } from '@/services/api';
import IEmpresa from '@/interfaces/IEmpresa';
import IMerchantOpenDelivery from '@/interfaces/IMerchantOpenDelivery';
import { IsOpenned } from '@/services/opennedService';


type headerProps = {
    emp?: string;
}
export default function Header({ emp }: headerProps) {


    const [config, setConfig] = useState<IMerchantOpenDelivery>();
    const [loading, setLoading] = useState(true);
    const [openned, setOpenned] = useState(false);

    useEffect(() => {
        var empresa = emp || sessionStorage.getItem('empresa') || '';
        getEmpresa(empresa);
    }, []);
    async function getEmpresa(empr: string) {
        await api.get(`/opendelivery/merchant?empresaId=${empr}`)
            .then((r) => {
                setConfig(r.data);
            }).catch((r) => {
            });
            setLoading(false);
        
        let o = await IsOpenned(empr);
        setOpenned(o);
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
                style={{ backgroundImage: `url(${config?.bannerUrl})` }}
            >
                <div className={styles.headerContent}>
                    <img
                        src={config.logoUrl}
                        alt="Logo Empresa"
                        className={styles.logo}
                    />
                    <h1>{config?.name}</h1>
                    <div className={styles.info}>
                        <span className={openned? styles.open : styles.closed}>{openned ? '🟢 Aberto' : '🔴 Fechado'}</span>
                    </div>
                    <hr/>
                    {/* <div className={styles.deliveryInfo}>
                        <p>Tempo de espera:<br/> {config.tempoEspera || 'Menos de 1hr'}</p>
                        <p>Taxa de entrega:<br/> A partir R$ {config.valorInicial.toFixed(2)}</p>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

