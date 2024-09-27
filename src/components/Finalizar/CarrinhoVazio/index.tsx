import styles from './styles.module.scss';
export default function CarrinhoVazio(){
    return(
        <div className={styles.container}>
            <img src={'/carrinhoVazio.png'}/>

        </div>
    )
}