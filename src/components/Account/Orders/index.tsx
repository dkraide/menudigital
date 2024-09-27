import IUser from '@/interfaces/IUser';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { IPedidoOnline } from '@/interfaces/IPedidoOnline';
import { api } from '@/services/api';
import { getEmpresa } from '@/utils/functions';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import DividerLine from '@/components/DividerLine';

type props = {
    user: IUser
}

export default function Orders({ user }: props) {

    const [orders, setOrders] = useState<IPedidoOnline[]>([])

    useEffect(() => {
        const loadOrders = async () => {
            const empresa = getEmpresa();
            await api.get(`/PedidoOnline/Pedidos?empresa=${empresa}&telefone=${user.phone}`)
                .then(({ data }) => {
                    setOrders(data);
                }).catch((err) => {
                    toast.error(`Erro ao carregar pedidos.`);
                })
        }
        loadOrders();
    }, [])


    const OrderItem = ({ order }: { order: IPedidoOnline }) => {
        return (
            <div className={styles.order}>
                <span className={styles.status}>{order.status}</span>
                <span className={styles.status}>{format(new Date(order.dataPedido), 'dd/MM/yy HH:mm')}</span>
                <span className={styles.status}>R$ {order.valorTotal.toFixed(2)}</span>
                <div style={{ width: '100%' }}>
                    <DividerLine />
                </div>
                <span className={styles.entrega}>{order.isParaEntrega ? `Entregar em: ${order.logradouro}, ${order.numero} - ${order.bairro}` : 'Tipo: Retirar no balcão'}</span>
            </div>
        )
    }
    return (
        <div className={styles.container}>
            <h4>Meus pedidos</h4>
            {orders.length > 0 ? <>
                {orders.map((order) => <OrderItem order={order} />)}

            </> : <>
                <h3>Sem historico para esse estabelecimento.</h3>
            </>}


        </div>
    )


}
