import { api } from '@/services/api';
import styles from './styles.module.scss';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IPedidoOnline } from '@/interfaces/IPedidoOnline';
import Header from '@/components/Header';

enum PedidoStatus {
    NOVO = 'NOVO',
    PREPARANDO = 'PREPARANDO',
    ENTREGANDO = 'ENTREGANDO',
    FINALIZADO = 'FINALIZADO',
    PRONTO_PARA_RETIRAR = 'PRONTO_PARA_RETIRAR',
    CANCELADO = 'CANCELADO',
    SOLICITACAO_CANCELAMENTO = 'SOLICITACAO_CANCELAMENTO'
}

const statusConfig = {
    [PedidoStatus.NOVO]: { label: 'Novo Pedido', color: '#FF3F4B', icon: '🆕' },
    [PedidoStatus.PREPARANDO]: { label: 'Preparando', color: '#f59e0b', icon: '👨‍🍳' },
    [PedidoStatus.ENTREGANDO]: { label: 'Em Entrega', color: '#FF3F4B', icon: '🚚' },
    [PedidoStatus.FINALIZADO]: { label: 'Finalizado', color: '#10b981', icon: '✅' },
    [PedidoStatus.PRONTO_PARA_RETIRAR]: { label: 'Pronto para Retirar', color: '#FF3F4B', icon: '📦' },
    [PedidoStatus.CANCELADO]: { label: 'Cancelado', color: '#ef4444', icon: '❌' },
    [PedidoStatus.SOLICITACAO_CANCELAMENTO]: { label: 'Solicitação de Cancelamento', color: '#f97316', icon: '⚠️' }
};

export default function ViewOrder() {
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<IPedidoOnline | null>(null);
    const [error, setError] = useState('');
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const router = useRouter();
    const { telefone, id } = router.query;

    const loadData = async () => {
        if (!id || !telefone) return;

        setLoading(true);
        setError('');

        try {
            const response = await api.get(`/PedidoOnline/Pedidos/${id}?telefone=${telefone}`);
            setOrder(response.data);
            setLastUpdate(new Date());
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Erro ao carregar pedido');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();

        // Auto-refresh a cada 5 segundos
        const interval = setInterval(() => {
            loadData();
        }, 5000);

        // Cleanup: limpa o interval quando o componente desmontar
        return () => clearInterval(interval);
    }, [id, telefone]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Carregando pedido...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>{error}</div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>Pedido não encontrado</div>
            </div>
        );
    }

    const currentStatus = statusConfig[order.status as PedidoStatus] || statusConfig[PedidoStatus.NOVO];

    return (
        <div className={styles.container}>
            <Header />
            <br/>
            {/* Status Badge - Destacado no topo */}
            <div
                className={styles.statusBadge}
                style={{ '--status-color': currentStatus.color } as React.CSSProperties}
            >
                <span className={styles.statusIcon}>{currentStatus.icon}</span>
                <span className={styles.statusLabel}>{currentStatus.label}</span>
            </div>

            {/* Informações do Pedido */}
            <div className={styles.orderCard}>
                <div className={styles.orderHeader}>
                    <div>
                        <h2>Pedido #{order.id}</h2>
                        <p className={styles.orderDate}>{formatDate(order.dataPedido)}</p>
                    </div>
                    {lastUpdate && (
                        <div className={styles.lastUpdate}>
                            <span className={styles.updateDot}></span>
                            Atualizado {formatDate(lastUpdate)}
                        </div>
                    )}
                </div>

                {/* Informações do Cliente */}
                <div className={styles.section}>
                    <h3>Cliente</h3>
                    <p><strong>{order.cliente}</strong></p>
                    <p>{order.telefone}</p>
                </div>

                {/* Endereço de Entrega */}
                {order.isParaEntrega && (
                    <div className={styles.section}>
                        <h3>Endereço de Entrega</h3>
                        <p>{order.logradouro}, {order.numero}</p>
                        {order.complemento && <p>{order.complemento}</p>}
                        <p>{order.bairro} - {order.cidade}</p>
                        <p>CEP: {order.cep}</p>
                    </div>
                )}

                {/* Produtos */}
                <div className={styles.section}>
                    <h3>Produtos</h3>
                    {order.produtos.map((produto) => (
                        <div key={produto.idPedidoOnlineProduto} className={styles.productItem}>
                            <div className={styles.productHeader}>
                                <span className={styles.productName}>
                                    {produto.quantidade}x {produto.nomeProduto}
                                </span>
                                <span className={styles.productPrice}>
                                    {formatCurrency(produto.valorTotal)}
                                </span>
                            </div>

                            {produto.observacao && (
                                <p className={styles.observation}>Obs: {produto.observacao}</p>
                            )}

                            {produto.adicionais && produto.adicionais.length > 0 && (
                                <div className={styles.adicionais}>
                                    <strong>Adicionais:</strong>
                                    {produto.adicionais.map((adicional) => (
                                        <div key={adicional.idPedidoOnlineProdutoAdicional} className={styles.adicionalItem}>
                                            <span>+ {adicional.quantidade}x {adicional.nome}</span>
                                            <span>{formatCurrency(adicional.valorTotal)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Resumo de Valores */}
                <div className={styles.section}>
                    <h3>Resumo</h3>
                    <div className={styles.summaryLine}>
                        <span>Subtotal</span>
                        <span>{formatCurrency(order.valorProdutos)}</span>
                    </div>
                    {order.valorFrete > 0 && (
                        <div className={styles.summaryLine}>
                            <span>Taxa de Entrega</span>
                            <span>{formatCurrency(order.valorFrete)}</span>
                        </div>
                    )}
                    {order.valorDesconto > 0 && (
                        <div className={styles.summaryLine}>
                            <span>Desconto</span>
                            <span className={styles.discount}>-{formatCurrency(order.valorDesconto)}</span>
                        </div>
                    )}
                    <div className={`${styles.summaryLine} ${styles.total}`}>
                        <span>Total</span>
                        <span>{formatCurrency(order.valorTotal)}</span>
                    </div>
                </div>

                {/* Forma de Pagamento */}
                <div className={styles.section}>
                    <h3>Pagamento</h3>
                    <p><strong>{order.pagamento}</strong></p>
                    {order.troco > 0 && (
                        <p>Troco para: {formatCurrency(order.troco)}</p>
                    )}
                </div>
            </div>
        </div>
    );
}