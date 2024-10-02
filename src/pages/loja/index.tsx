import Header from '@/components/Header';
import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMailBulk, faMapPin, faPhone, faShop } from '@fortawesome/free-solid-svg-icons';
import { api } from '@/services/api';
import { useEffect, useState } from 'react';
import IEmpresa from '@/interfaces/IEmpresa';
import IConfiguracao from '@/interfaces/IConfiguracao';
import { fGetOnlyNumber, getEmpresa } from '@/utils/functions';
import { faFacebook, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export default function Loja() {

    const [empresa, setEmpresa] = useState<IEmpresa>();
    const [hiddenHorario, setHiddenHorario] = useState(true);
    const [config, setConfig] = useState<IConfiguracao>();

    useEffect(() => {
        var e = getEmpresa();
        loadConfig(e);
    }, [])
    function loadConfig(empr: string) {
        api
            .get(`/MenuDigital/Empresa/${empr}`)
            .then((r) => {
                setEmpresa(r.data);
            }).catch((r) => {
            });
        api
            .get(`/MenuDigital/Configuracao?id=${empr}&withHorarios=true`)
            .then((r) => {
                setConfig(r.data);
            }).catch((r) => {
            });
    }


    const Contato = ({ className, name, icon, url }) => {
        return (
            <a target={'_blank'} href={url} className={[styles[className], styles.contact].join(' ')}>
                <div className={styles.icon}>
                    <FontAwesomeIcon icon={icon} />
                </div>
                <div className={styles.content}>
                    {name}
                </div>
            </a>
        )

    }


    return (
        <div className={styles.container}>
            <Header />
            {empresa && (
                <div style={{ padding: '10px 10px 0px 10px' }}>
                    <div className={styles.card}>
                        <div className={styles.cardTitle}>
                            <FontAwesomeIcon icon={faMapPin} />
                            <span>Localização</span>
                        </div>
                        <div className={styles.cardBody}>
                            <a target='_blank' href={`https://www.google.com/maps/search/?api=1&query=${empresa?.endereco}, ${empresa?.nro} - ${empresa?.bairro} - ${empresa?.cidade} / ${empresa?.uf}`}>{empresa.endereco}, {empresa.nro} - {empresa.bairro} / {empresa.cidade}</a>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardTitle}>
                            <FontAwesomeIcon icon={faPhone} />
                            <span>Contato</span>
                        </div>
                        <div className={styles.cardBody}>
                            {empresa?.telefone && <Contato url={`https://api.whatsapp.com/send?phone=+55${fGetOnlyNumber(empresa.telefone)}&text=Ola, vim do Menu Digital!`} className={'whatsapp'} icon={faWhatsapp} name={'WhatsApp'} />}
                            {config?.instagram && <Contato url={config.instagram} className={'instagram'} icon={faInstagram} name={'Instagram'} />}
                            {config?.facebook && <Contato url={config.facebook} className={'facebook'} icon={faFacebook} name={'Facebook'} />}
                        </div>
                    </div>
                </div>
            )}
            {config && (
                <div style={{ padding: '0px 10px' }}>
                    <div className={styles.card}>
                        <div className={styles.cardTitle}>
                            <FontAwesomeIcon icon={faShop} />
                            <span>Horarios de funcionamento</span>
                        </div>
                        <div className={styles.cardBody}>

                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Dia</th>
                                        <th>Abertura</th>
                                        <th>Fechamento</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {config.horarios.map((horario) => (
                                        <tr>
                                            <td>{horario.dia}</td>
                                            <td>{horario.abertura}</td>
                                            <td>{horario.fechamento}</td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}