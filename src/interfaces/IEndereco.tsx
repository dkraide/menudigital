export default interface IEndereco{
    altitude: number;
    latitude: number;
    longitude: number;
    bairro: string;
    cep: string;
    cidade: ICidade;
    complemento: string;
    estado: IEstado;
    logradouro: string;
    numero: string;
    compl: string

}

export  interface ICidade{
 ddd: number;
 ibge: string;
 nome: string;
}
export interface IEstado{
  sigla: string;
}