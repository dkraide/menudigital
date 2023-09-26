import ICombo from "./ICombo";
import IPromocao from "./IPromocao";

export interface IOrder{
  promocoes: IOrderPromocao[];
  combos: IOrderCombo[];
  produtos: IOrderProduto[];

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

  
}
export interface IOrderPromocao{
  promocao: IPromocao;
  total: number;
  produtos: IOrderProduto[];
}

export interface IOrderCombo{
  combo: ICombo;
  total: number;
  produtos: IOrderProduto[];
}

export interface IOrderProduto{
  id: number;
  nome: string;
  descricao: string;
  quantidade: number;
  valorUn: number;
  valorTotal: number;
  imagem: string;
  adicionais: IOrderProdutoAdicional[];
  observacao: string;

}
export interface IOrderProdutoAdicional{
  id: number;
  nome: string;
  quantidade: number;
  valorUn: number;
  valorTotal: number;
  imagem: string;
}
