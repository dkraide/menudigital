import axios from 'axios';

const api = axios.create({
   baseURL: "https://pdv.krdsys.tech/api"
  // baseURL: "http://localhost:7000/api"
});

export {api};