export default interface ICombo{
    idCombo: number;
    descricao: string;
    itens: ComboItem[];
    codigo: string;
    imagem: string;
    valor: number;
}
export interface ComboItem{
    descricao: string;
    quantidade: number;
    valorUnitario: number;
    produto: IComboProduto;
    produtos: IComboProduto[];
}
export interface IComboProduto{
    nome: string;
    descricao: string;
    cod: number;
    idProduto: number;
    imagem:string;
    quantidade: number;
}