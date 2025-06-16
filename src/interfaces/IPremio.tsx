import IClasse from "./IClasse";
import IClasseProduto from "./IClasseProduto";

export default interface IPremio {
  idPremio: number;
  idProduto: number;
  idClasseMaterial: number;
  classeMaterial: IClasse;
  descricao: string;
  quantidadePontos: number;
  status: boolean;
  empresaId: number;
  id: number;
  produtoId: number;
  classeMaterialId: number;
  localPath?: string;
  produto?: IPremioProduto;
  produtos?: IPremioProduto[];
}

interface IPremioProduto{
  id?: number
  cod?: string
  nome?: string
  descricao?: string
  localPath?: string
  valor?: string
}