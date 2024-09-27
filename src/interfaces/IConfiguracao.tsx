export default interface IConfiguracao{
  corFundo: string;
  localPath: string;
  instagram: string;
  facebook: string;
  horarios: Horario[];
}
export interface Horario{
   abertura: string;
   fechamento: string;
   dia: string;
}
export interface IProdutoImagem{
  localOnline: string
}