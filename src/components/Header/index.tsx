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
export default function Header({emp} : headerProps){
  

    const [empresa, setEmpresa] = useState<IEmpresa>();
    const [hiddenHorario, setHiddenHorario] = useState(true);
    const [config, setConfig] = useState<IConfiguracao>();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        var empresa = emp || sessionStorage.getItem('empresa') || '';
        getEmpresa(empresa);

        var strConfig = sessionStorage.getItem('config');
        if(strConfig !== null){
            setConfig(JSON.parse(strConfig));
        }
       
    },[]);
    function getEmpresa(empr: string){
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
    function getHorarios(){
           setHiddenHorario(!hiddenHorario);

           if(!config){
             api.get(`/MenuDigital/Configuracao?id=${empresa?.id}&withHorarios=true`)
             .then((r) => {
                 setConfig(r.data);
             })
             .catch((err) => { 
                console.log(err);
             });
           }

    }
    if(loading){
        return(
            <>
            </>
        )
    }
    return(
        <div className={styles.container}>
            <img onClick={() => {window.location.href= '/'}} src={config?.imagem?.localOnline}></img>
            <div className={styles.containerEmpresa}>
                    <h3>{empresa?.nomeFantasia}</h3>
                    <p><a target='_blank' href={`https://www.google.com/maps/search/?api=1&query=${empresa?.endereco}, ${empresa?.nro} - ${empresa?.bairro} - ${empresa?.cidade} / ${empresa?.uf}`}>{empresa?.endereco}, {empresa?.nro} {empresa?.complemento} - {empresa?.bairro} - {empresa?.cidade}</a></p>
            </div>
            <div className={styles.containerBoxes}>
                <a onClick={getHorarios} className={styles.containerBox}>
                <FontAwesomeIcon icon={faBusinessTime} color='#fff' size={ '3x' } />
                <p>Horarios</p>
                </a>
                <a className={styles.containerBox} target='_blank' href={`https://www.google.com/maps/search/?api=1&query=${empresa?.endereco}, ${empresa?.nro} - ${empresa?.bairro} - ${empresa?.cidade} / ${empresa?.uf}`}>
                <FontAwesomeIcon icon={faMapLocation} color='#fff' size={ '3x' } />
                <p>Localizacao</p>
                </a>
                <a className={styles.containerBox} target='_blank' href={`https://api.whatsapp.com/send?phone=+55${empresa?.telefone}&text=Ola, vim do site KRD System - Menu Digital!`}>
                <FontAwesomeIcon icon={faSquarePhone} color='#fff' size={ '3x' } />
                <p>Whatsapp</p>
                </a>
                <Link className={styles.containerBox} href={`/order`}>
                <FontAwesomeIcon icon={faShoppingCart} color='#fff' size={ '3x' } />
                <p>Carrinho</p>
                </Link>
            </div>
            <div hidden={hiddenHorario} className={styles.horarios}>
            <div className={styles.horarioField}>
                            <p>Dia</p>
                            <p>Abre</p>
                            <p>Fecha</p>
                        </div>
                 {config?.horarios.map((p) => {
                    return(
                        <div className={styles.horarioField}>
                            <p>{p.dia}</p>
                            <p>{p.abertura}</p>
                            <p>{p.fechamento}</p>
                        </div>
                    )
                 })}
            </div>

        </div>
    )
}