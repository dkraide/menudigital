import Header from '@/components/Header';
import styles from './styles.module.scss';
import IClasseProduto from '@/interfaces/IClasseProduto';
import { useEffect, useState } from 'react';
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

export default function Produto() {
    const [produto, setProduto] = useState({} as IClasseProduto);
    const [empresaId, setEmpresa] = useState('');
    const [obs, setObs] = useState('');
    const [quantidade, setQuantidade] = useState(1);
    useEffect(() => {
        var item = sessionStorage.getItem('empresa') || '';
        const params = new URLSearchParams(window.location.search);
        setEmpresa(item);
        api.get(`/MenuDigital/produto?empresa=${item}&produtoId=${params.get('produtoId')}&tamanhoId=${params.get('tamanhoId')}`)
            .then((r) => {
                setProduto(r.data);
            }).catch((err) => {
                console.log(err);
            });
    }, []);

    console.log(produto);

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
    function addAdicional(type: string, indexGroup: number, indexItem: number) {

        var total = _.sumBy(produto.grupos[indexGroup].itens, (e) => e.quantidade);
        var qntd = produto.grupos[indexGroup].itens[indexItem].quantidade;
        if (type === '-' && qntd === 0) {
            return;
        }
        if (type === '+' && total >= produto.grupos[indexGroup].max) {
            return;
        }
        if (type === '-') {
            qntd -= 1;
        } else {
            qntd += 1;
        }
        produto.grupos[indexGroup].itens[indexItem].quantidade = qntd;
        setProduto({ ...produto })

    }
    function validateAdicionais(): boolean {
        if (produto.grupos === undefined ||
            produto.grupos === null ||
            produto.grupos.length === 0) {
            return true;
        }
        var can = true;
        produto.grupos.map((grupo) => {
            if (grupo.min > 0) {
                var total = _.sumBy(grupo.itens, (i) => i.quantidade);
                if (total < grupo.min) {
                    toast.error(`Selecione ao menos ${grupo.min} de ${grupo.descricao}`);
                    can = false;
                }
            }
        });

        return can;
    }
    function addCarrinho() {

        var res = validateAdicionais();
        if (!res) {
            return;
        }
        var order = JSON.parse(sessionStorage.getItem('order') || '{}') as IOrder;
        var prod = {} as IOrderProduto;
        prod.adicionais = [] as IOrderProdutoAdicional[];
        prod.descricao = produto.descricao;
        prod.observacao = obs;
        if (produto.opcionais !== undefined &&
            produto.opcionais !== null &&
            produto.opcionais.length > 0) {
            produto.opcionais.map((opc) => {
                if (opc.selected === false) {
                    prod.observacao += `\nSEM ${opc.descricao}`;
                }
            })
        }
        if (produto.grupos !== undefined &&
            produto.grupos !== null &&
            produto.grupos.length > 0) {
            produto.grupos.map(grupo => {
                grupo.itens.map(item => {
                    if (item.quantidade > 0) {
                        var adc = {
                            quantidade: item.quantidade,
                            valorTotal: item.valor * item.quantidade,
                            valorUn: item.valor,
                            nome: item.nome,
                            imagem: item.imagem,
                            id: item.id
                        } as IOrderProdutoAdicional;
                        prod.adicionais.push(adc);
                    }
                });
            });
        }
        prod.id = produto.id;
        prod.imagem = produto.imagem;
        prod.nome = produto.nome;
        prod.quantidade = quantidade;
        prod.valorTotal = getTotal();
        prod.valorUn = getTotalUnitario();
        if (!order.produtos) {
            order.produtos = [];
        }
        order.produtos.push(prod);
        sessionStorage.setItem('order', JSON.stringify(order));
        window.location.href = `/finalizar`;
    }
    function getTotal(): number {
        var total = getTotalUnitario();
        return total * quantidade;
    }
    function setOpcional(index: number): void {
        if (produto.opcionais[index].selected === undefined) {
            produto.opcionais[index].selected = false;
        } else {
            produto.opcionais[index].selected = !produto.opcionais[index].selected;
        }
        setProduto({ ...produto });
    }
    function getTotalUnitario(): number {
        var total = produto.valor || 0;
        var adc = 0;
        produto.grupos?.map((g) => {
            g.itens.map((item) => {
                adc += (item.quantidade || 0) * item.valor;
            })
        });
        total += adc;
        return total;
    };
    return (
        <div className={styles.containerCenter}>
            <Header />
            <div className={styles.containerPromo}>
                <div className={styles.divImage}>
                    <img className={styles.img} src={produto.imagem} alt='imagem do produto' />
                </div>
                <p className={styles.nomeProduto} >{produto.nome}</p>
                <p className={styles.descricao}>{produto.descricao}</p>
                <p className={styles.preco}>A partir de R$ {produto?.valor?.toFixed(2)}</p>
            </div>
            <DividerLine />
            <div hidden={produto.opcionais === undefined || produto.opcionais.length == 0} className={styles.containerOpcionais}>
                <div className={styles.coHeader}>
                    Desmarque caso nao queira algum dos ingredientes =)
                </div>
                <div className={styles.coContent}>
                    {produto.opcionais?.map((item, index) => {
                        return <CustomCheckbox key={index} desc={item.descricao} selected={item.selected === undefined ? true : item.selected} onChange={() => { setOpcional(index) }} />
                    })}
                </div>
            </div>

            {produto.grupos !== undefined && produto.grupos.length > 0 ?
                (produto.grupos.map((g, index) => {
                    return (<BoxAdicional key={g.id} grupo={g} index={index} changeQuantity={addAdicional} />)
                })) :
                (<></>)}
            <div className={styles.containerOpcionais}>
                <div className={styles.coHeader}>
                    Observações para  o estabelecimento
                </div>
                <div>
                    <textarea placeholder='Clique aqui para inserir observação' className={styles.obs} value={obs} onChange={(e) => setObs(e.target.value)}></textarea>
                </div>
            </div>

            <div className={styles.containerCarrinho}>
                <div className={styles.containerButtons}>
                    <div className={styles.icon}>
                        <FontAwesomeIcon onClick={() => { addProd('-') }} icon={faMinus} />
                    </div>
                    <input readOnly value={quantidade} />
                    <div className={styles.icon}>
                        <FontAwesomeIcon onClick={() => { addProd('+') }} icon={faPlus} />

                    </div>
                </div>
                <CustomButton typeButton={'primary'} className={styles.btnCarrinho} onClick={addCarrinho}>
                    <label className={styles.carrinhoDesc}>Adicionar</label>
                    <label className={styles.carrinhoVal}>R$ {getTotal().toFixed(2)}</label>
                </CustomButton>
            </div>
        </div>
    )
}