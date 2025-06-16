export default interface IPromocao{
    id:number
    idPromocao: number;
    valorOriginal: number;
    valorFinal: number;
    quantidade: number;
    descricao: string;
    imagem: string;
    produtos: IPromocaoProduto[];
}
export interface IPromocaoProduto{
   cod: number;
   id: number;
   nome: string;
   descricao: string;
   estoque: number;
   valor: number;
   imagem: string;
   quantidade: number;
}