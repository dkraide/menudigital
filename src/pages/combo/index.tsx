import Header from '@/components/Header';
import styles from './styles.module.scss';
import ICombo from '@/interfaces/ICombo';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { IOrder, IOrderCombo, IOrderProduto } from '@/interfaces/IOrder';
import { AxiosResponse } from 'axios';
import BoxComboItem from '@/components/BoxComboItem';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

export default function Combo() {
    const [combo, setCombo] = useState<ICombo>({ valor: 0 } as ICombo);
    const [empresaId, setEmpresa] = useState('');
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        var item = sessionStorage.getItem('empresa') || '';
        const params = new URLSearchParams(window.location.search);
        setEmpresa(item);
        api.get(`/MenuDigital/Combo?empresa=${item}&id=${params.get('comboId')}`)
            .then(({ data }: AxiosResponse<ICombo>) => {
                data.itens.map((p) => {

                    if (p.produtos !== null && p.produtos.length > 0) {
                        p.produtos?.map((pp) => pp.quantidade = 0);
                    }
                })
                setCombo(data);
                console.log(data);
                setLoading(false);
            })
            .catch((r) => {
                console.log(r);
            })
            .finally(() => {

            })
    }, []);
    function changeQuantity(indexItem: number, indexSubItem: number, operator: string) {
        if (operator === '+') {
            var total = _.sumBy(combo.itens[indexItem].produtos, (p) => p.quantidade);
            if (total >= combo.itens[indexItem].quantidade) {
                return;
            }
            var qnt = combo.itens[indexItem].produtos[indexSubItem].quantidade;
            combo.itens[indexItem].produtos[indexSubItem].quantidade = qnt + 1;
        } else {
            var qnt = combo.itens[indexItem].produtos[indexSubItem].quantidade;
            if (qnt <= 0) {
                return;
            }
            combo.itens[indexItem].produtos[indexSubItem].quantidade = qnt - 1;
        }
        setCombo({ ...combo, itens: combo.itens });
    }
    function getQuantidade(indexItem: number): number {
        return _.sumBy(combo.itens[indexItem].produtos, (p) => p.quantidade);
    }
    function getTotal() {
        var total = 0;
        combo.itens?.map((i) => {
            total += i.quantidade * i.valorUnitario
        })
        return total;
    }
    function finished(): boolean {
        var fin = true;
        combo.itens?.map((i, index) => {
            if (i.produtos != null) {
                var total = getQuantidade(index);
                if (total !== i.quantidade) {
                    fin = false;
                }
            }

        })
        return fin;
    }
    function addCarrinho() {
        var order = JSON.parse(sessionStorage.getItem('order') || '{}') as IOrder;
        if (!order.combos) {
            order.combos = [];
        }
        var p = {} as IOrderCombo;
        p.combo = combo;
        p.produtos = getProdutos();
        p.total = combo.valor;
        order.combos.push(p);
        sessionStorage.setItem('order', JSON.stringify(order));
        window.location.href = `/order`;
    }
    function getProdutos(): IOrderProduto[] {
        var prods = [] as IOrderProduto[];
        combo.itens.map((p) => {
            if (p.produtos != null) {
                p.produtos.map((i) => {
                    if (i.quantidade > 0) {
                        prods.push({
                            id: i.idProduto,
                            nome: i.nome,
                            imagem: i.imagem,
                            valorUn: p.valorUnitario,
                            quantidade: i.quantidade,
                            valorTotal: p.valorUnitario * i.quantidade
                        } as IOrderProduto);
                    }
                });
            } else {
                prods.push({
                    id: p.produto.idProduto,
                    nome: p.produto.nome,
                    imagem: p.produto.imagem,
                    valorUn: p.valorUnitario,
                    quantidade: p.quantidade,
                    valorTotal: p.valorUnitario * p.quantidade
                } as IOrderProduto);
            }
        });

        return prods
    }
    return (
        <div className={styles.containerCenter}>
            <Header />
            <div className={styles.containerPromo}>
                <div className={styles.divImage}>
                    <img className={styles.img}
                        src={combo.imagem || '/comida.png'}
                        onError={(e) => { e.currentTarget.src = '/comida.png' }}
                        alt='imagem do combo' />
                </div>
                <p className={styles.nomeProduto} >{combo.codigo}</p>
                <p className={styles.descricao}>{combo.descricao}</p>
                <p className={styles.preco}>A partir de R$ {combo?.valor?.toFixed(2)}</p>
            </div>
            <div className={styles.containerCombo}>
                {combo.itens?.map((p, index) => <BoxComboItem key={index.toString()} item={p} handleChange={changeQuantity} index={index} quantidade={getQuantidade(index)} />)}
            </div>
            {finished() ? (<div className={styles.containerCarrinho}>
                <div>
                    <label className={styles.carrinhoDesc}>Por:</label>
                    <label className={styles.carrinhoVal}>R${getTotal().toFixed(2)}</label>
                </div>
                <FontAwesomeIcon onClick={addCarrinho} className={styles.icon} icon={faCartShopping} color='var(--main)' size={'2x'} />
            </div>) :
                (<></>)}

        </div>
    )
}