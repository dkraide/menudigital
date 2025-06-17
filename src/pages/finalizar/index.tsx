import Header from '@/components/Header';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import IUser from '@/interfaces/IUser';
import User from '@/components/User';
import IEndereco from '@/interfaces/IEndereco';
import Stepper2 from '@/components/Stepper';
import Carrinho from '@/components/Finalizar/Carrinho';
import Entrar from '@/components/Finalizar/Entrar';
import { IOrder } from '@/interfaces/IOrder';
import CarrinhoVazio from '@/components/Finalizar/CarrinhoVazio';
import Entrega from '@/components/Finalizar/Entrega';
import Pagamento from '@/components/Finalizar/Pagamento';
import IConfiguracao from '@/interfaces/IConfiguracao';
import { api } from '@/services/api';
import { AxiosResponse } from 'axios';

export default function Finalizar() {
    const [user, setUser] = useState<IUser>({} as IUser);
    const [step, setStep] = useState(0);
    const [order, setOrder] = useState<IOrder>();
    const [configuracao, setConfiguracao] = useState<IConfiguracao>();
    useEffect(() => {
        var obj = JSON.parse(sessionStorage.getItem('order') || '{}') as IOrder;
        if (obj.promocoes === undefined) {
            obj.promocoes = [];
        }
        if (obj.combos === undefined) {
            obj.combos = [];
        }
        if (obj.produtos === undefined) {
            obj.produtos = [];
        }
        setOrder({ ...obj });

        const loadConfig = async () => {
            var empresa =  sessionStorage.getItem('empresa') || '';
            await api
            .get(`/MenuDigital/Configuracao?id=${empresa}&withHorarios=true`)
            .then((r: AxiosResponse<IConfiguracao>) => {
                setConfiguracao(r.data);
            }).catch((r) => {
            });
        }
        loadConfig();

    }, []);


    function handleUser(user: IUser, isLogin: boolean) {
        if (isLogin) {
            sessionStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            setStep(2);
        } else {
            sessionStorage.setItem('user', '{}');
            window.location.reload();
        }
    }
    function handleTaxa(address?: IEndereco, taxa?: number) {

        order.cliente = user.nome;
        order.telefone = user.telefone;
        if (address) {
            order.bairro = address.bairro;
            order.cep = address.cep;
            order.cidade = address.cidade?.nome;
            order.complemento = address.compl;
            order.logradouro = address.logradouro;
            order.numero = address.numero;
            order.valorFrete = taxa || 0;
            order.valorTotal = order.valorProdutos - (order.valorDesconto || 0) + order.valorFrete;
            order.isParaEntrega = true;
            setOrder({...order});
            setStep(3)
        } else {
            order.isParaEntrega = false;
            order.valorFrete = 0;
            setOrder({...order});
            setStep(3)
        }
    }
    function handleCarrinho(pedido){
        setOrder(pedido);
        setStep(1);
        
    }

    const renderItem = () => {
        
        switch (step) {
            case 0:
                return <Carrinho handleNext={handleCarrinho} order={order} />;
            case 1:
                return <Entrar handleUser={handleUser} />
            case 2:
                return <Entrega handleTaxa={handleTaxa} configuracao={configuracao}/>
            case 3:
                return <Pagamento order={order} handleConfirm={() => { setStep(1) }} />;
        }
        return <></>
    }

    if (!order || (order.produtos?.length == 0 && order.combos?.length == 0 && order.promocoes?.length == 0)) {
        return (
            <div className={styles.container}>
                <Header />
                <CarrinhoVazio />
            </div>
        )

    }


    return (
        <div className={styles.container}>
            <Header />
            <Stepper2 steps={['Carrinho', 'Entrar', 'Entrega', 'Pagamento']} currentStep={step} />
            {renderItem()}
        </div>
    )
}