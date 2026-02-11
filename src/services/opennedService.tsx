import { api } from "./api";

const CACHE_KEY = 'menu_openned';
const TTL = 30 * 1000; // 1 minuto

export const IsOpenned = async (emp?: string): Promise<boolean> => {
    const empresa = emp || sessionStorage.getItem('empresa') || '';
    if (!empresa) return false;

    const cache = sessionStorage.getItem(CACHE_KEY);

    if (cache) {
        const { value, time } = JSON.parse(cache);

        if (Date.now() - time < TTL) {
            return value; // cache válido
        }
    }

    try {
        const { data } = await api.get<boolean>(
            `/MenuDigital/Openned?id=${empresa}`
        );

        sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ value: data, time: Date.now() })
        );

        return data;
    } catch (err) {
        console.log(err);
        return false;
    }
};
