import axios from 'axios';

const api = axios.create({
   baseURL: "https://backendpdv.azurewebsites.net/api"
});

export {api};