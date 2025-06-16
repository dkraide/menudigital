import IUser from '@/interfaces/IUser';
import styles from './styles.module.scss';
import InputMask from 'react-input-mask';
import { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { InputFormMask, InputGroup } from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import { toast } from 'react-toastify';
import { fGetOnlyNumber } from '@/utils/functions';
import { api } from '@/services/api';
import { AuthContext } from '@/contexts/AuthContexto';

type userProps = {
    handleUser: (user: IUser, isLogin: boolean) => void;
}
export default function Entrar({ handleUser }: userProps) {
    const [phone, setPhone] = useState('');
    const { user } = useContext(AuthContext)
    const [codeSent, setCodeSent] = useState(false);
    const [code, setCode] = useState('');
    const { getEmpresaId } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            handleUser(user, true);
        }
    }, []);

    const handleEntrar = async () => {
        const phoneNumber = fGetOnlyNumber(phone);
        if (!phoneNumber || phoneNumber.length != 11) {
            toast.error(`Informe um número de celular válido`);
            return;
        }
        const empresaId = await getEmpresaId();
        try {
            await api.post(`/menudigital/sendsms`, {
                empresaId,
                telefone: phoneNumber,
            });
            toast.success('Código enviado via SMS!');
            setCodeSent(true);
        } catch (err) {
            toast.error(`Erro ao gerar token`);
        }
    };

    const handleVerificarCodigo = async () => {
        const empresaId = await getEmpresaId();
        const phoneNumber = fGetOnlyNumber(phone);
        if (!phoneNumber || phoneNumber.length != 11) {
            toast.error(`Informe um número de celular válido`);
            return;
        }
        try {
            const { data } = await api.post(`/menudigital/VerifyCode`, {
                empresaId,
                telefone: phoneNumber,
                code,
            });
            // Simule salvar usuário aqui
            handleUser(data, true);
            toast.success('Login realizado com sucesso!');
        } catch (err) {
            toast.error(`Código inválido`);
        }
    };

    return (
        <div className={styles.container}>
            <h4 className={styles.title}>Entrar</h4>

            <div hidden={codeSent} className={styles.inputGroup}>
                <InputFormMask
                    value={user?.telefone}
                    onChange={(e) => setPhone(e.target.value)}
                    mask="(99)99999-9999"
                    placeholder="(__) _____-____"
                    title="Telefone"
                />
            </div>

            <CustomButton hidden={codeSent} typeButton="primary" onClick={handleEntrar}>
                Enviar Código
            </CustomButton>

            {codeSent && (
                <>
                    <div className={styles.inputGroup}>
                        <InputMask
                            mask="999999"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className={styles.codeInput}
                            placeholder="Digite o código recebido"
                        />
                    </div>
                    <CustomButton onClick={handleVerificarCodigo} typeButton={'primary'}>
                        Verificar Código
                    </CustomButton>
                </>
            )}
        </div>
    );
}
