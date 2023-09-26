
export default interface IClasseProduto{
    idProduto: number;
    cod: number;
    descricao: string;
    nome: string;
    valor: number;
    imagem: string;
    grupos: IGrupoAdicional[];
    opcionais: IClasseProdutoOpcional[];
}

export interface IGrupoAdicional{
    id: number;
    descricao: string;
    min: number;
    max: number;
    itens: IGrupoAdicionalProduto[]; 
}
export interface IGrupoAdicionalProduto{
    id: number;
    nome: string;
    valor: number;
    imagem: string;
    quantidade: number;

}
export interface IClasseProdutoOpcional{
    id: number,
    descricao: string,
    selected: boolean
}