import { useContext, useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { AuthContext } from '@/contexts/AuthContexto';
import IPremio from '@/interfaces/IPremio';
import { api } from '@/services/api';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import DividerLine from '@/components/DividerLine';
import Link from 'next/link';

export default function Premios() {
    const { user, getEmpresaId } = useContext(AuthContext);
    const [premios, setPremios] = useState<IPremio[]>([])


    const loadData = async () => {
        let empresaId = await getEmpresaId();
        await api.get(`/Premio/List?empresaId=${empresaId}`).then(({ data }) => {
            const premiosOrdenados = data.sort((a, b) => a.quantidadePontos - b.quantidadePontos);
            setPremios(premiosOrdenados);
        }).catch((err: AxiosError) => {
            toast.error(`Erro ao carregar lista de premios`);
        })

    }
    useEffect(() => {
        loadData();
    }, []);


    const Premio = ({ item }: { item: IPremio }) => {
        const disponivel = item.quantidadePontos < user.pontos;
        return (
            <Link 
            href={`/premio?premioId=${item.id}`}
            className={styles.premio}>
                <div className={styles.imagemWrapper}>
                    <img
                        src={item.localPath || '/comida.png'}
                        onError={(e) => { e.currentTarget.src = '/comida.png' }}
                        alt={'premio'}>
                    </img>
                    <span className={styles.pontos}>{item.quantidadePontos} pts.</span>
                    {!disponivel && (
                        <div className={styles.overlay}>
                            <span>Faltam {item.quantidadePontos - user.pontos} pts.</span>
                        </div>
                    )}
                </div>
                <span className={styles.descricao}>{item.descricao}</span>
            </Link>
        );
    };



    return (
        <div className={styles.container}>
            <h5>Você possui {user.pontos} ponto(s).</h5>
            <DividerLine />
            <div className={styles.card}>
                <h3>Prêmios</h3>
                {premios?.map((item) => <Premio item={item} />)}
            </div>



        </div>
    )
}