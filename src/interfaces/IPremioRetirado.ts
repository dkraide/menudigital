import IPremio from "./IPremio";
import IUser from "./IUser";

export interface IPremioretirado {
  id: number;
  idpremioretirado: number;
  descricao?: string;
  idvenda: number;
  pontos: number;
  data?: string;
  idcliente: number;
  idpremio: number;
  premioid: number;
  premio?: IPremio
  vendaid: number;
  clienteid: number;
  cliente?: IUser
  empresaid: number;
}
