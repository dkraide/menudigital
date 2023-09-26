export interface IPedidoOnline {
  cliente: string;
  id: number;
  telefone: string;
  empresa: string;
  valorProdutos: number;
  valorFrete: number;
  valorTotal: number;
  valorDesconto: number;
  logradouro: string;
  cidade: string;
  bairro: string;
  cep: string;
  numero: string;
  complemento: string;
  isParaEntrega: boolean;
  troco: number;
  pagamento: string;
  produtos: IPedidoOnlineProduto[];
}

export interface IPedidoOnlineProduto{
    id: number;
    idPedidoOnlineProduto: number;
    pedidoOnlineId: number;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
    nomeProduto: string;
    observacao: string;
    produtoId: number;
    adicionais: IPedidoOnlineProdutoAdicional[];
}

export interface IPedidoOnlineProdutoAdicional{
    idPedidoOnlineProdutoAdicional: number;
    id: number;
    pedidoOnlineProdutoId: number;
    nome: string;
    valorUnitario: number;
    quantidade: number;
    valorTotal: number;
    materiaPrimaId: number;
}
