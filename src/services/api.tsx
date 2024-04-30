import axios from 'axios';

const api = axios.create({
   baseURL: "https://backendpdv.azurewebsites.net/api"
   //baseURL: "https://localhost:3334/api"
});

export {api};