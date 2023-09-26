import axios from 'axios';

const api = axios.create({
   baseURL: "https://krdapi.emartim.com.br/api"
});

export {api};