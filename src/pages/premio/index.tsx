import Header from '@/components/Header';
import styles from './styles.module.scss';
import IClasseProduto from '@/interfaces/IClasseProduto';
import { useContext, useEffect, useState } from 'react';
import { api } from '@/services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faMinus, faPlug, faPlus } from '@fortawesome/free-solid-svg-icons';
import { IOrder, IOrderProduto, IOrderProdutoAdicional } from '@/interfaces/IOrder';
import _ from 'lodash';
import BoxAdicional from '@/components/Produto/BoxAdicional';
import CustomCheckbox from '@/components/CustomCheckbox';
import { toast } from 'react-toastify';
import DividerLine from '@/components/DividerLine';
import CustomButton from '@/components/CustomButton';
import { AuthContext } from '@/contexts/AuthContexto';
import IPremio from '@/interfaces/IPremio';

export default function Premio() {
    const [premio, setPremio] = useState({} as IPremio);
    const { getEmpresaId } = useContext(AuthContext);
    const [obs, setObs] = useState('');
    const [quantidade, setQuantidade] = useState(1);

    const loadData = async () => {
        const params = new URLSearchParams(window.location.search);
        const item = await getEmpresaId();
        api.get(`/MenuDigital/premio?empresa=${item}&premioId=${params.get('premioId')}`)
            .then((r) => {
                setPremio(r.data);
            }).catch((err) => {
                console.log(err);
            });
    }
    useEffect(() => {
        loadData();
    }, []);


    function addProd(operator: string) {
        if (operator === '-') {
            if (quantidade <= 1) {
                return;
            }
            setQuantidade(quantidade - 1);
        } else {
            setQuantidade(quantidade + 1);
        }
    }
    return (
        <div className={styles.containerCenter}>
            <Header />
            <div className={styles.containerPromo}>
                <div className={styles.divImage}>
                    <img className={styles.img} src={premio.localPath} alt='imagem do premio' />
                </div>
                <p className={styles.descricao}>{premio.descricao}</p>
                <p className={styles.preco}>{premio.quantidadePontos} pts.</p>
            </div>
            {
                premio.produto && (
                    <div>
                        <h3>Ganhe o item abaixo</h3>
                        <div
                            className={styles.container}>
                            <div className={styles.containerInfo} >
                                <label className={styles.lblTitle}>{premio.produto.nome}</label>
                                <label className={styles.lblDesc}>{premio.produto.descricao}</label>
                            </div>
                            <div style={{ width: '40%', display: 'flex', justifyContent: 'flex-end', paddingRight: '10px' }}>
                                <img
                                    src={premio.produto.localPath || '/comida.png'}
                                    className={styles.pic}
                                    onError={(e) => { e.currentTarget.src = '/comida.png' }}
                                    alt={'produto'}
                                    width={100}
                                    height={100}>
                                </img>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                premio.produtos && (
                    <div>
                        <h3>Ganhe um dos itens abaixo</h3>
                        {premio.produtos.map((produto) => (
                            <div
                                className={styles.container}>
                                <div className={styles.containerInfo} >
                                    <label className={styles.lblTitle}>{produto.nome}</label>
                                    <label className={styles.lblDesc}>{produto.descricao}</label>
                                </div>
                                <div style={{ width: '40%', display: 'flex', justifyContent: 'flex-end', paddingRight: '10px' }}>
                                    <img
                                        src={produto.localPath || '/comida.png'}
                                        className={styles.pic}
                                        onError={(e) => { e.currentTarget.src = '/comida.png' }}
                                        alt={'produto'}
                                        width={100}
                                        height={100}>
                                    </img>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
            <DividerLine />
        </div>
    )
}