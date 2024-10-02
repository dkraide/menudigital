import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { IOrder, IOrderProduto } from '@/interfaces/IOrder';
import _ from 'lodash';
import { toast } from 'react-toastify';
import IEndereco from '@/interfaces/IEndereco';
import IUser from '@/interfaces/IUser';
import { IPedidoOnline, IPedidoOnlineProduto, IPedidoOnlineProdutoAdicional } from '@/interfaces/IPedidoOnline';
import { api } from '@/services/api';
import CustomButton from '../CustomButton';
import { fGetNumber } from '@/utils/functions';

type orderTotalProps = {
  taxa: number;
  isEntrega: boolean,
  endereco: IEndereco,
  cliente: IUser,
}

export default function OrderTotal({cliente, taxa, isEntrega, endereco }: orderTotalProps) {

  const [order, setOrder] = useState({} as IOrder);
  const [payment, setPayment] = useState('');
  const [needTroco, setNeedTroco] = useState('false');
  const [troco, setTroco] = useState(0);

  useEffect(() => {
    var str = sessionStorage.getItem('order') || '{}';
    var ord = JSON.parse(str) as IOrder;


    ord.isParaEntrega = isEntrega;
    ord.cliente = cliente.name;
    ord.telefone = cliente.phone;

    if(isEntrega){
      ord.bairro = endereco.bairro;
      ord.cep = endereco.cep;
      ord.cidade = endereco.cidade.nome;
      ord.complemento  = endereco.complemento;
      ord.logradouro = endereco.logradouro;
      ord.numero = endereco.numero;
      ord.valorFrete = taxa;
    }
    setOrder(ord);
    getTotalProds();

  }, []);

  function getTotalProds(): number {
    var total = 0;
    total += _.sumBy(order?.promocoes, p => p.total);
    total += _.sumBy(order?.combos, c => c.total);
    total += _.sumBy(order?.produtos, p => p.valorTotal);
    return total;
  }

  function getTotal(): number {
    return getTotalProds() + taxa;
  }
  function finalizarPedido(){
    if(payment === ''){
       toast.error('Selecione uma forma de pagamento');
       return;
    }
    if(payment === 'DINHEIRO' && troco < getTotal()){
        toast.error('Valor no campo "Troco para quanto" precisa ser maior que o pedido.');
        return;
     }
    var emp = sessionStorage.getItem('empresa') || '';
    var po = {} as IPedidoOnline;
    po.bairro = order.bairro;
    po.cep = order.cep;
    po.cidade = order.cidade;

    po.cliente = order.cliente;
    po.telefone = order.telefone;

    po.complemento = order.complemento;
    po.empresaId = fGetNumber(emp);
    po.id = 0;
    po.isParaEntrega = order.isParaEntrega;
    po.logradouro = order.logradouro;
    po.numero = order.numero;
    po.pagamento = payment;
    po.troco = troco;
    po.valorDesconto = 0;
    po.valorFrete = taxa;

    po.valorProdutos = getTotalProds();
    po.valorTotal = getTotal();

    var produtos = [] as IPedidoOnlineProduto[];
    if(order.combos !== undefined && order.combos !== null && order.combos.length > 0){
      order.combos.map((combo) => {
            combo.produtos.map((produto) => {
                  produtos.push(buildProduto(produto, `[COMBO ${combo.combo.codigo}]`));
            });
      });
    }
    if(order.promocoes !== undefined && order.promocoes !== null && order.promocoes.length > 0){
      order.promocoes.map((promo) => {
            promo.produtos.map((produto) => {
                  produtos.push(buildProduto(produto, `[PROMOCAO ${promo.promocao.descricao}]`));
            });
      });
    }
    if(order.produtos !== undefined && order.produtos !== null && order.produtos.length > 0){
      order.produtos.map((produto) => {
             produtos.push(buildProduto(produto, ''));
      });
    }
    po.produtos = produtos;
    api.post(`/PedidoOnline/CreateOrder`, po)
    .then((r) => {
        toast.success(`Pedido online criado com sucesso! Nro ${r.data.id}`);
        sessionStorage.setItem('cart', '{}');
        window.location.href = '/';
    }) 
    .catch((err) => {
        toast.error(err.response.data);
    });
  }
  function buildProduto(base: IOrderProduto, obs:string): IPedidoOnlineProduto{
   
    var x = {
        id: 0,
        idPedidoOnlineProduto: 0,
        pedidoOnlineId: 0,
        quantidade: base.quantidade,
        valorUnitario: base.valorUn,
        valorTotal: base.valorTotal,
        produtoId: base.id,
        observacao: `${obs} ${base.observacao || ''}`,
        nomeProduto: base.nome,
    } as IPedidoOnlineProduto;

    if(base.adicionais !== undefined && base.adicionais !== null && base.adicionais.length > 0){
       x.adicionais = [];
      base.adicionais.map((adc) => {
           var poa = {} as IPedidoOnlineProdutoAdicional;
           poa.id = 0;
           poa.idPedidoOnlineProdutoAdicional = 0;
           poa.nome = adc.nome;
           poa.quantidade = adc.quantidade;
           poa.valorUnitario = adc.valorUn;
           poa.valorTotal = adc.valorTotal;
           poa.materiaPrimaId = adc.id;
           x.adicionais.push(poa);
       });
    }
    return x;
  }
  return (
    <div className={styles.container}>
      <div className={styles.containerValue}>
        <label className={styles.title}>Produtos.....</label>
        <label className={styles.value}>R$ {getTotalProds().toFixed(2)}</label>
      </div>
      <div className={styles.containerValue}>
        <label className={styles.title}>Taxa de Entrega.....</label>
        <label className={styles.value}>R$ {taxa.toFixed(2)}</label>
      </div>
      <div className={styles.containerValue}>
        <label className={styles.title}>Total.....</label>
        <label className={styles.value}>R$ {getTotal().toFixed(2)}</label>
      </div>
      <h2>Forma de Pagamento</h2>
      <div className={styles.buttons}>
        <a onClick={() => {setPayment('DINHEIRO')}} className={payment === 'DINHEIRO' ? styles.btnPaymentSelected : styles.btnPayment}>Dinheiro</a>
        <a onClick={() => {setPayment('CREDITO')}} className={payment === 'CREDITO' ? styles.btnPaymentSelected : styles.btnPayment}>Credito</a>
        <a onClick={() => {setPayment('DEBITO')}} className={payment === 'DEBITO' ? styles.btnPaymentSelected : styles.btnPayment}>Debito</a>
      </div>
      <div hidden={payment !== 'DINHEIRO'} className={styles.containerTroco}>
        <h4>Precisa de Troco ?</h4>
        <select onChange={(e) => {setNeedTroco(e.target.value)}} className={styles.selTroco}>
           <option selected value={'false'}>NAO</option>
           <option value={'true'}>SIM</option>
        </select>
        <input value={troco} onChange={(e) => setTroco(Number(e.target.value))} type='number' placeholder='Troco para quanto' hidden={needTroco == 'false'} className={styles.inputTroco}/>
      </div>
      <div className={styles.buttons}>
        <CustomButton typeButton={'outline'} >Continuar Pedido</CustomButton>
        <CustomButton typeButton={'primary'} onClick={finalizarPedido} hidden={payment === ''} >Enviar Pedido</CustomButton>
      </div>
    </div>
  )
}