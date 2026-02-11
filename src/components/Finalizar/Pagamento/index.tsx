import { IOrder } from '@/interfaces/IOrder';
import styles from './styles.module.scss';
import CustomButton from '@/components/CustomButton';
import { useContext, useState } from 'react';
import { InputGroup } from '@/components/CustomInput';
import { toast } from 'react-toastify';
import { createPedido, fGetNumber } from '@/utils/functions';
import Loading from '@/components/Loading';
import { api } from '@/services/api';
import { AxiosError } from 'axios';
import { AuthContext } from '@/contexts/AuthContexto';


type pagamentoProps = {
    order: IOrder;
    handleConfirm: () => void;
}

export default function Pagamento({ order }: pagamentoProps) {
    const [forma, setForma] = useState<'DINHEIRO' | 'CREDITO' | 'DEBITO' | ''>('');
    const [troco, setTroco] = useState('');
    const [loading, setLoading] = useState(false);
    const {getEmpresaId} = useContext(AuthContext);


    const handleSendPedido = async () => {
        if(forma == ''){
            toast.error(`Selecione uma forma de pagamento.`);
            return;
        }
        order.pagamento = forma;
        if(order.pagamento == 'DINHEIRO' && troco.length > 0){
            var trocoNumber = fGetNumber(troco);
            if(trocoNumber < order.valorTotal){
                toast.error(`Troco: ${troco} invalido. Valor do troco deve ser maior que o valor total do pedido. (Digite apenas o valor, sem cifrão ou letras.) `)
                return;
            }
            order.troco = trocoNumber;
        }
        

        setLoading(true);
        var pedido = createPedido(order);
        pedido.empresaId = await getEmpresaId();
        await api.post(`/PedidoOnline/CreateOrder`, pedido)
        .then(({data}) => {
            toast.success(`Pedido enviado com sucesso!`);
            sessionStorage.setItem('order', '{}');
            window.location.href = `/order?id=${data.id}&telefone=${data.telefone}`;

        }).catch((err: AxiosError) => {
            toast.error(`Erro ao enviar pedido. Tente novamente mais tarde`);
        })

        setLoading(false);


    }

    if(loading){
        return(
            <div className={styles.container}>
                <Loading size={250}/>
            </div>
        )
    }
    return (
        <div className={styles.container}>
            <div style={{ width: '50%' }} className={styles.card}>
                <h4>Pedido</h4>
                <table style={{ width: '100%' }} className={styles.tableTotal}>
                    <tbody>
                        <tr>
                            <td>Cliente</td>
                            <td>{order.cliente} - {order.telefone}</td>
                        </tr>
                        <tr>
                            <td>Tipo</td>
                            <td>{order.isParaEntrega ? 'Para entregar' : 'Retira no balcão'}</td>
                        </tr>
                        {order.isParaEntrega && <>
                            <tr>
                                <td>Entrega</td>
                                <td>{order.logradouro}, {order.numero} - {order.bairro}</td>
                            </tr>
                        </>}
                    </tbody>
                </table>
            </div>
            <div style={{ width: '50%' }} className={styles.card}>
                <h4>Totais</h4>
                <table style={{ width: '100%' }} className={styles.tableTotal}>
                    <tbody>
                        <tr>
                            <td>Produtos (+)</td>
                            <td>R$ {(order.valorProdutos || 0).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Descontos (-)</td>
                            <td>R$ {(order.valorDesconto || 0).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Taxas (+)</td>
                            <td>R$ {(order.valorFrete || 0).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Total (=)</td>
                            <td>R$ {(order.valorTotal || 0).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style={{ width: '50%' }} className={styles.card}>
                <h4>Escolha uma forma de pagamento</h4>
                <div className={styles.formas}>
                    <CustomButton onClick={() => { setForma('DINHEIRO') }} typeButton={forma == 'DINHEIRO' ? 'primary' : 'outline'}>DINHEIRO</CustomButton>
                    <CustomButton onClick={() => { setForma('DEBITO') }} typeButton={forma == 'DEBITO' ? 'primary' : 'outline'}>DEBITO</CustomButton>
                    <CustomButton onClick={() => { setForma('CREDITO') }} typeButton={forma == 'CREDITO' ? 'primary' : 'outline'}>CREDITO</CustomButton>
                </div>
                {forma == 'DINHEIRO' &&
                    (
                        <div className={styles.dinheiro}>
                            <InputGroup placeholder={'Ex: 100,00'} style={{backgroundColor: 'var(--gray-100)'}} value={troco || ''} onChange={(e) => {setTroco(e.currentTarget.value)}} title={'Informe o valor para troco, se necessario.'}/>
                        </div>
                    )}

                {forma != '' && <CustomButton loading={loading} onClick={handleSendPedido} style={{ width: '100%', marginTop: 15 }} typeButton={'primary'}>Enviar pedido</CustomButton>}

            </div>
        </div>
    )
}