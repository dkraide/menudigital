import IClasse from '@/interfaces/IClasse';
import styles from './styles.module.scss';
import BoxProd from './BoxProd';
import DividerLine from '../DividerLine';

type ProdutoProps = {
  produto: IClasse;
  id: string;
  searchString: string;
}

export default function Produto({produto, id, searchString} : ProdutoProps) {
  return (
    <>
      <h5 className={styles.classe}>{produto.classe}</h5>
      <div id={id} className={styles.container}>
        {produto.produtos.map(p =>{
          if(!p.nome.toUpperCase().includes(searchString.toUpperCase())){
            return <div key={-1}></div>
          }
          return(
            <BoxProd key={p.cod} {...p} />
          )
        })}
      </div>
      <DividerLine/>
    </>
  )
}