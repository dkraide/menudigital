import Header from '@/components/Header';
import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMailBulk, faMapPin, faPhone, faShop } from '@fortawesome/free-solid-svg-icons';
import { api } from '@/services/api';
import { useContext, useEffect, useState } from 'react';
import { fGetOnlyNumber } from '@/utils/functions';
import { faFacebook, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { AuthContext } from '@/contexts/AuthContexto';
import IMerchantOpenDelivery from '@/interfaces/IMerchantOpenDelivery';
import { ITimePeriods, IWeekHour } from '@/interfaces/IWeekHour';

export default function Loja() {
    const [config, setConfig] = useState<IMerchantOpenDelivery>();
    const [hours, setHours] = useState<IWeekHour[]>([]);
    const { empresaId } = useContext(AuthContext)

    useEffect(() => {
        loadConfig();
    }, [])
    async function loadConfig() {
        api
            .get(`/opendelivery/merchant?empresaId=${empresaId}`)
            .then((r) => {
                setConfig(r.data);
            }).catch((r) => {
            });
        api.get(`/menudigital/horarios/${empresaId}`).then((r) => {
            console.log(r.data);
            setHours(r.data);
        }).catch((r) => {
        });

    }


    const Contato = ({ className, name, icon, url }) => {
        return (
            <a target={'_blank'} href={url} className={[styles[className], styles.contact].join(' ')}>
                <div className={styles.icon}>
                    <FontAwesomeIcon icon={icon} />
                </div>
                <div className={styles.content}>
                    {name}
                </div>
            </a>
        )

    }



    return (
        <div className={styles.container}>
            <Header />
            {config && (
                <div style={{ padding: '10px 10px 0px 10px' }}>
                    <div className={styles.card}>
                        <div className={styles.cardTitle}>
                            <FontAwesomeIcon icon={faMapPin} />
                            <span>Localização</span>
                        </div>
                        <div className={styles.cardBody}>
                            <a target='_blank' href={`https://www.google.com/maps/search/?api=1&query=${config?.street}, ${config?.number} - ${config?.district} - ${config?.city} / ${config?.state}`}>{config.street}, {config.number} - {config.district} / {config.city}</a>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardTitle}>
                            <FontAwesomeIcon icon={faPhone} />
                            <span>Contato</span>
                        </div>
                        <div className={styles.cardBody}>
                            {config?.whatsappNumber && <Contato url={`https://api.whatsapp.com/send?phone=+55${fGetOnlyNumber(config.whatsappNumber)}&text=Ola, vim do Menu Digital!`} className={'whatsapp'} icon={faWhatsapp} name={'WhatsApp'} />}
                            {config?.instagram && <Contato url={config.instagram} className={'instagram'} icon={faInstagram} name={'Instagram'} />}
                            {config?.facebook && <Contato url={config.facebook} className={'facebook'} icon={faFacebook} name={'Facebook'} />}
                        </div>
                    </div>
                </div>
            )}

            <HoursComponent hours={hours} />

        </div>
    )
}

const HoursComponent = ({ hours }: { hours: IWeekHour[] }) => {
    const translateDay = (day: string) => {
        const map: Record<string, string> = {
            MONDAY: "Segunda-feira",
            TUESDAY: "Terça-feira",
            WEDNESDAY: "Quarta-feira",
            THURSDAY: "Quinta-feira",
            FRIDAY: "Sexta-feira",
            SATURDAY: "Sábado",
            SUNDAY: "Domingo",
        };

        return map[day] || day;
    };
    const convertToBrazilTime = (time: string) => {
        const date = new Date(`1970-01-01T${time}`); // Z = UTC

        return date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "America/Sao_Paulo",
        });
    };
    const weekDays = [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
    ];
    const organizeHoursByDay = () => {
        const result: Record<string, ITimePeriods[]> = {};

        weekDays.forEach(day => {
            result[day] = [];
        });

        hours.forEach(weekHour => {
            weekHour.dayOfWeek.forEach(day => {
                if (!result[day]) result[day] = [];
                result[day].push(weekHour.timePeriods);
            });
        });

        return result;
    };

    const hoursByDay = organizeHoursByDay();

    if (!hours || hours.length === 0) return <></>;

    return (
        <div style={{ padding: '0px 10px' }}>
            <div className={styles.card}>
                <div className={styles.cardTitle}>
                    <FontAwesomeIcon icon={faShop} />
                    <span>Horários de funcionamento</span>
                </div>

                <div className={styles.cardBody}>
                    <div className={styles.weekContainer}>
                        {weekDays.map((day) => {
                            const periods = hoursByDay[day];

                            return (
                                <div key={day} className={styles.dayRow}>
                                    <div className={styles.dayName}>
                                        {translateDay(day)}
                                    </div>

                                    <div className={styles.dayHours}>
                                        {periods.length === 0 ? (
                                            <span className={styles.closed}>Fechado</span>
                                        ) : (
                                            periods.map((period, index) => (
                                                <span key={index} className={styles.timeBadge}>
                                                    {convertToBrazilTime(period.startTime)} -{" "}
                                                    {convertToBrazilTime(period.endTime)}
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}