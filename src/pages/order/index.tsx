import Header from "@/components/Header";
import styles from './styles.module.scss';
import { useEffect, useState } from "react";
import { IOrder } from "@/interfaces/IOrder";
import OrderPromocao from "@/components/OrderPromocao";
import OrderCombo from "@/components/OrderCombo";
import _ from 'lodash';
import OrderProduto from "@/components/OrderProduto";
import CustomButton from "@/components/CustomButton";

export default function Order() {
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
        setOrder({ ...obj });

    }, []);
    function getTotal(): number {
        var total = 0;
        total += _.sumBy(order?.promocoes, p => p.total);
        total += _.sumBy(order?.combos, c => c.total);
        total += _.sumBy(order?.produtos, p => p.valorTotal);
        return total;
    }
    return (
        <div className={styles.container}>
            <div className={styles.containerCenter}>
                <Header />
                <div className={styles.containerCarrinho}>
                    <p className={styles.title}>Carrinho</p>
                    {order?.promocoes.map((p) => <OrderPromocao key={p.promocao.idPromocao} p={p} />)}
                    {order?.combos.map((p) => <OrderCombo key={p.combo.idCombo} p={p} />)}
                    {order?.produtos.map((p) => <OrderProduto key={p.id} {...p} />)}
                </div>
                <div className={styles.containerTotal}>
                    <p>Total</p>
                    <p>R${getTotal().toFixed(2)}</p>
                </div>
                <div className={styles.buttons}>
                    <a href="/"><CustomButton typeButton={'outline'}>Voltar</CustomButton></a>
                    <a href="/finalizar"><CustomButton typeButton={'primary'}>Finalizar</CustomButton></a>
                </div>
            </div>

        </div>
    )
}