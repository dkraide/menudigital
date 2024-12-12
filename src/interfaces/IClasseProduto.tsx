
export default interface IClasseProduto{
    id: number;
    idProduto: number;
    cod: number;
    descricao: string;
    nome: string;
    valor: number;
    imagem: string;
    grupos: IGrupoAdicional[];
    opcionais: IClasseProdutoOpcional[];
    tipo?: string
    tamanhos?: IProdutoGrupoItem[]
}

export interface IProdutoGrupo {
    idProdutoGrupo: number;
    id: number;
    idProduto: number;
    produtoId: number;
    empresaId: number;
    produto: IClasseProduto;
    tipo: ProdutoGrupoTipo;
    descricao: string;
    status: boolean;
    minimo: number;
    maximo: number;
    itens: IProdutoGrupoItem[];
}
export type ProdutoGrupoTipo = 'PADRAO' | 'BORDA' | 'TAMANHO' | 'SABOR' | 'MASSA';
export interface IProdutoGrupoItem {
    id: string;
    idProdutoGrupoItem: string;
    idProdutoGrupo: number;
    produtoGrupoId: string;
    produtoGrupo: IProdutoGrupo;
    nome: string;
    descricao: string;
    valor: number;
    qtdSabores: number;
    status: boolean;
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
    imagem: string
    quantidade: number;

}
export interface IClasseProdutoOpcional{
    id: number,
    descricao: string,
    selected: boolean
}