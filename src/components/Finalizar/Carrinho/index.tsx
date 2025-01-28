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
    handleNext: (order: IOrder) => void;
    handleRemoveProduct?: (index: number) => void;
    order: IOrder;
}

export default function Carrinho({ handleNext }: carrinhoProps) {
    const [order, setOrder] = useState<IOrder>();
    useEffect(() => {
        const storedOrder = sessionStorage.getItem('order');
        if (!storedOrder) return;
    
        let obj = JSON.parse(storedOrder) as IOrder;
    
        if (!obj.promocoes) obj.promocoes = [];
        if (!obj.combos) obj.combos = [];
        if (!obj.produtos) obj.produtos = [];
    

        if (!_.isEqual(obj, order)) {
            obj.valorTotal = getTotal(obj);
            obj.valorProdutos = obj.valorTotal;
            setOrder(obj);
        }
    }, []);
    function getTotal(pedido: IOrder): number {
        var total = 0;
        total += _.sumBy(pedido?.promocoes, p => p.total);
        total += _.sumBy(pedido?.combos, c => c.total);
        total += _.sumBy(pedido?.produtos, p => p.valorTotal);
        return total;
    }

    function handleRemoveProduct(index: number) {
        if (!order) return;
    
        let updatedOrder = { ...order };
        updatedOrder.produtos = updatedOrder.produtos.filter((_, i) => i !== index);
    
        updatedOrder.valorProdutos = updatedOrder.produtos.reduce((acc, produto) => acc + produto.valorTotal, 0);
        updatedOrder.valorTotal = updatedOrder.valorProdutos - (updatedOrder.valorDesconto || 0) + (updatedOrder.valorFrete || 0);
    
        sessionStorage.setItem('order', JSON.stringify(updatedOrder));
        setOrder(updatedOrder);
    }
    
    
    
    return (
        <div className={styles.container}>
            <div className={styles.containerCarrinho}>
                {order?.promocoes?.length > 0 && <h4>Promoções</h4>}
                {order?.promocoes.map((p) => <OrderPromocao key={p.promocao.idPromocao} p={p} />)}
                {order?.combos?.length > 0 && <h4>Combos</h4>}
                {order?.combos.map((p) => <OrderCombo key={p.combo.idCombo} p={p} />)}
                {order?.produtos?.length > 0 && <h4>Produtos</h4>}
                {order?.produtos.map((p, index) => (
                <OrderProduto key={`${p.id}-${index}`} {...p} onRemove={() => handleRemoveProduct(index)} />
                ))}
            </div>
            <DividerLine/>
            <div className={styles.containerTotal}>
                <p>Total</p>
                <p>R${order?.valorTotal?.toFixed(2)}</p>
            </div>
            <DividerLine/>
            <div className={styles.buttons}>
                <CustomButton onClick={() => { window.location.href = '/' }} typeButton={'outline'}>Comprar mais</CustomButton>
                <CustomButton onClick={() => {handleNext(order)}} typeButton={'primary'}>Confirmar</CustomButton>
            </div>
        </div>
    )
}