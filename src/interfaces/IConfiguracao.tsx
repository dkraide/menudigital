export default interface IConfiguracao{
  corFundo: string;
  horarios: Horario[];
}
export interface Horario{
   abertura: string;
   fechamento: string;
   dia: string;
}