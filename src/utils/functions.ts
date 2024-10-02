import { IOrder, IOrderProduto } from "@/interfaces/IOrder";
import { IPedidoOnline, IPedidoOnlineProduto, IPedidoOnlineProdutoAdicional } from "@/interfaces/IPedidoOnline";
import IUser from "@/interfaces/IUser";
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";



export const fValidateNumer = (value) => {
    return !isNaN(value.replace(',', '.'));
}

export const fGetNumber = (value) => {
    if (!value) {
        return 0;
    }
    var res = Number(value.toString().replace(`,`, `.`));
    return isNaN(res) ? 0 : res;
}
export const nameof = <T>(name: keyof T) => name;

export const fGetOnlyNumber = (value) => {
    return value.replace(/\D/g, "");
}

export function createPedido(order: IOrder): IPedidoOnline {
    var po = {} as IPedidoOnline;
    po.bairro = order.bairro;
    po.cep = order.cep;
    po.cidade = order.cidade;

    po.cliente = order.cliente;
    po.telefone = order.telefone;

    po.complemento = order.complemento;
    po.empresaId = Number(getEmpresa());
    po.id = 0;
    po.isParaEntrega = order.isParaEntrega;
    po.logradouro = order.logradouro;
    po.numero = order.numero;
    po.pagamento = order.pagamento;
    po.troco = order.troco;
    po.valorDesconto = order.valorDesconto;
    po.valorFrete = order.valorFrete;
    po.valorProdutos = order.valorProdutos;
    po.valorTotal = order.valorTotal;
    var produtos = [] as IPedidoOnlineProduto[];
    if (order.combos !== undefined && order.combos !== null && order.combos.length > 0) {
        order.combos.map((combo) => {
            combo.produtos.map((produto) => {
                produtos.push(buildProduto(produto, `[COMBO ${combo.combo.codigo}]`));
            });
        });
    }
    if (order.promocoes !== undefined && order.promocoes !== null && order.promocoes.length > 0) {
        order.promocoes.map((promo) => {
            promo.produtos.map((produto) => {
                produtos.push(buildProduto(produto, `[PROMOCAO ${promo.promocao.descricao}]`));
            });
        });
    }
    if (order.produtos !== undefined && order.produtos !== null && order.produtos.length > 0) {
        order.produtos.map((produto) => {
            produtos.push(buildProduto(produto, ''));
        });
    }
    po.produtos = produtos;
    return po;
}
function buildProduto(base: IOrderProduto, obs: string): IPedidoOnlineProduto {

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

    if (base.adicionais !== undefined && base.adicionais !== null && base.adicionais.length > 0) {
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

export function getUser(): IUser | undefined{
    var strUser = sessionStorage.getItem('user');
    var u = JSON.parse(strUser || '{}');
    if (u.name !== undefined) {
        return u;
    }
    return undefined;

}
export function login(user):boolean{
    sessionStorage.setItem('user', JSON.stringify(user));
    return true;
}

export function getEmpresa(): string{
    return sessionStorage.getItem('empresa') || '';
}
