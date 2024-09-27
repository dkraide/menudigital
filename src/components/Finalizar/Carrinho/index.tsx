import Header from "@/components/Header";
import styles from './styles.module.scss';
import { useEffect, useState } from "react";
import { IOrder } from "@/interfaces/IOrder";
import OrderPromocao from "@/components/OrderPromocao";
import OrderCombo from "@/components/OrderCombo";
import _ from 'lodash';
import OrderProduto from "@/components/OrderProduto";
import CustomButton from "@/components/CustomButton";
import DividerLine from "@/components/DividerLine";


type carrinhoProps = {
    handleNext: (order) => void;
}

export default function Carrinho({ handleNext }: carrinhoProps) {
    const [order, setOrder] = useState<IOrder>();
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
        var total = getTotal(obj);
        obj.valorTotal = total;
        obj.valorProdutos = total;
        setOrder({ ...obj });

    }, []);
    function getTotal(pedido: IOrder): number {
        var total = 0;
        total += _.sumBy(pedido?.promocoes, p => p.total);
        total += _.sumBy(pedido?.combos, c => c.total);
        total += _.sumBy(pedido?.produtos, p => p.valorTotal);
        return total;
    }
    return (
        <div className={styles.container}>
            <div className={styles.containerCarrinho}>
                {order?.promocoes?.length > 0 && <h4>Promoções</h4>}
                {order?.promocoes.map((p) => <OrderPromocao key={p.promocao.idPromocao} p={p} />)}
                {order?.combos?.length > 0 && <h4>Combos</h4>}
                {order?.combos.map((p) => <OrderCombo key={p.combo.idCombo} p={p} />)}
                {order?.produtos?.length > 0 && <h4>Produtos</h4>}
                {order?.produtos.map((p) => <OrderProduto key={p.id} {...p} />)}
            </div>
            <DividerLine/>
            <div className={styles.containerTotal}>
                <p>Total</p>
                <p>R${order?.valorTotal?.toFixed(2)}</p>
            </div>
            <DividerLine/>
            <div className={styles.buttons}>
                <CustomButton onClick={() => { window.location.href = '/' }} typeButton={'outline'}>Voltar</CustomButton>
                <CustomButton onClick={() => {handleNext(order)}} typeButton={'primary'}>Confirmar</CustomButton>
            </div>
        </div>
    )
}