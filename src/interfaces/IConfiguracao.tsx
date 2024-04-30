export default interface IConfiguracao{
  corFundo: string;
  imagem: IProdutoImagem;
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