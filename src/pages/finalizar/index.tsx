import Header from '@/components/Header';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import IUser from '@/interfaces/IUser';
import User from '@/components/User';
import DividerLine from '@/components/DividerLine';
import OrderEntrega from '@/components/OrderEntrega';
import IEndereco from '@/interfaces/IEndereco';
import OrderTotal from '@/components/OrderTotal';
export default function Finalizar() {
    const [user, setUser] = useState<IUser>({} as IUser);
    const [isEntrega, setIsEntrega] = useState(0);
    const [taxa, setTaxa] = useState(-1);
    const [endereco, setEndereco] = useState({} as IEndereco);
    useEffect(() => {
        var strUser = sessionStorage.getItem('user');
        var u = JSON.parse(strUser || '{}');
        if(u.name !== undefined){
             setUser(u);
        }
    },[]);

    function handleUser(user: IUser, isLogin: boolean){
            if(isLogin){
                sessionStorage.setItem('user', JSON.stringify(user));
                setUser(user);
            }else{
                sessionStorage.setItem('user', '{}');
                window.location.reload();
            }
    }
    function handleTaxa(address: IEndereco, taxa: number){
         setTaxa(taxa);
         setEndereco(address);
    }
    function sendOrder(){
        var pedido = {
             id: 0,
             idpedidoOnline: 0,
             cliente: user.name,
             telefone: user.phone,
             empresa: sessionStorage.getItem('empresa'),
             valorProdutos: 0
        };
    }
    function buildScreen(){
        if(isEntrega == 0){
            return (<></>);
        }
        if(isEntrega == 1){
          return(
            <>
            <OrderEntrega handleTaxa={handleTaxa}/>
            <br/>
            <DividerLine/>
            <br/>
            {taxa >= 0 ?
             (<OrderTotal cliente={user} isEntrega={true} endereco={endereco} taxa={taxa}/>)
            : (<></>)}
          </>
          );
        }
        if(isEntrega == 2){
           return (<OrderTotal cliente={user} isEntrega={false} endereco={endereco} taxa={0}/>);
        }
    }
    return (
       <div className={styles.container}>
         <div className={styles.containerCenter}>
            <Header />
            <h2>Meus Dados</h2>
            <User handleUser={handleUser} user={user} isLoggedIn={user.name !== undefined }/>
            <DividerLine/>
            {user.name !== undefined ? (
               <>
                <div className={styles.buttons}>
                <button hidden={isEntrega == 2} onClick={() => {setIsEntrega(2); setTaxa(0)}} className={styles.btnRetira}>Retirar na Loja</button>
                <button hidden={isEntrega == 1} onClick={() => {setIsEntrega(1); setTaxa(-1)}} className={styles.btnEntrega}>Entregar</button>
                </div>
                {buildScreen()}
               
               </>
            ) : (
                <></>
            )}
            
        </div>
       </div>
    )
}