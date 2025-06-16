import Header from '@/components/Header';
import styles from './styles.module.scss';
import { useContext, useEffect, useState } from 'react';
import IPromocao, { IPromocaoProduto } from '@/interfaces/IPromocao';
import { api } from '@/services/api';
import { AxiosResponse } from 'axios';
import BoxPromocaoProduto from '@/components/BoxPromocaoProduto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '@/components/LoadingSpinner';
import _ from 'lodash';
import { IOrder, IOrderProduto, IOrderPromocao } from '@/interfaces/IOrder';
import { AuthContext } from '@/contexts/AuthContexto';


export default function Promocao() {
    const [promocao, setPromocao] = useState<IPromocao>({} as IPromocao);
    const [isLoading, setLoading] = useState(true);
    const { getEmpresaId } = useContext(AuthContext);

    const loadData = async () => {
        const params = new URLSearchParams(window.location.search);
        const item = await getEmpresaId();
        api.get(`/MenuDigital/Promocao?empresa=${item}&id=${params.get('promocaoId')}`)
            .then(({ data }: AxiosResponse<IPromocao>) => {
                data.produtos?.map((c) => c.quantidade = 0);
                setPromocao(data);
                setLoading(false);
            })
            .catch((r) => {
                console.log(r);
            })
            .finally(() => {

            })
    }

    useEffect(() => {
        loadData();
    }, []);



    const calculaTotal = (operator: string, index: number) => {
        let quantidade = promocao.produtos[index].quantidade;
        if (operator === '-' && quantidade === 0)
            return;
        if (operator === '-')
            quantidade -= 1;
        else
            quantidade += 1;
        promocao.produtos[index].quantidade = quantidade;
        setPromocao({ ...promocao, produtos: promocao.produtos });
    }
    function getTotal(comDesconto: boolean, isCount: boolean): number {
        if (isCount) {
            return _.sumBy(promocao.produtos, p => p.quantidade);
        }
        if (!comDesconto) {
            return _.sumBy(promocao.produtos, p => p.valor * p.quantidade);
        } else {
            if (promocao.quantidade > _.sumBy(promocao.produtos, p => p.quantidade)) {
                return _.sumBy(promocao.produtos, p => p.valor * p.quantidade);
            }
            return _.sumBy(promocao.produtos, p => p.quantidade * promocao.valorFinal);
        }
    }
    function addCarrinho() {

        if (promocao.quantidade > getTotal(false, true)) {
            alert('Quantidade minima nao atingida');
            return;
        }

        var order = JSON.parse(sessionStorage.getItem('order') || '{}') as IOrder;
        if (!order.promocoes) {
            order.promocoes = [];
        }
        var p = {} as IOrderPromocao;
        p.promocao = promocao;
        p.produtos = promocao.produtos.map((c) => {
            return {
                id: c.id,
                nome: c.nome,
                imagem: c.imagem,
                valorUn: promocao.valorFinal,
                quantidade: c.quantidade,
                valorTotal: c.quantidade * promocao.valorFinal
            } as IOrderProduto
        });
        p.total = _.sumBy(p.produtos, (p) => p.valorUn * p.quantidade);
        order.promocoes.push(p);
        sessionStorage.setItem('order', JSON.stringify(order));
        window.location.href = `/`;
    }

    if (isLoading) {
        return (
            <LoadingSpinner />
        )
    }

    return (
        <div className={styles.containerCenter}>
            <Header />
            <div className={styles.containerPromo}>
                <div className={styles.divImage}>
                    <img className={styles.img}
                        src={promocao.imagem || '/comida.png'}
                        onError={(e) => { e.currentTarget.src = '/comida.png' }}
                        alt='imagem do combo' />
                </div>
                <p className={styles.nomeProduto} >{promocao.descricao}</p>
                <p className={styles.descricao}>  {promocao.quantidade > 1 ?
                    `Levando a partir de ${promocao.quantidade} a unidade sai por R$${promocao.valorFinal.toFixed(2)}` :
                    `De R$${promocao.valorOriginal.toFixed(2)} por R$${promocao.valorFinal.toFixed(2)}`}</p>
            </div>
            <div className={styles.containerPromo}>
                {promocao.produtos?.map((p, index) => <BoxPromocaoProduto key={p.id} produto={p} handleChange={calculaTotal} index={index} />)}
            </div>
            <div className={styles.containerCarrinho}>
                <div>
                    <label className={styles.carrinhoDesc}>Qntd:</label>
                    <label className={styles.carrinhoVal}>{getTotal(false, true)}</label>
                </div>
                <div>
                    <label className={styles.carrinhoDesc}>De:</label>
                    <label className={styles.carrinhoVal}>R${getTotal(false, false).toFixed(2)}</label>
                </div>
                <div>
                    <label className={styles.carrinhoDesc}>Por:</label>
                    <label className={styles.carrinhoVal}>R${getTotal(true, false).toFixed(2)}</label>
                </div>
                <FontAwesomeIcon onClick={addCarrinho} className={styles.icon} icon={faCartShopping} color='var(--main)' size={'2x'} />
            </div>

        </div>
    )
}