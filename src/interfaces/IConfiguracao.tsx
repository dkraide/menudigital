export default interface IConfiguracao{
  corFundo: string;
  localPath: string;
  logoPath: string;
  tempoEspera?: string
  instagram: string;
  facebook: string;
  horarios: Horario[];
  valorInicial: number
  aberto: boolean
  entrega: boolean
}
export interface Horario{
   abertura: string;
   fechamento: string;
   dia: string;
}
export interface IProdutoImagem{
  localOnline: string
}