import axios from 'axios';

const apiCep = axios.create({
   baseURL: "https://www.cepaberto.com/api/v3",
   headers: {
    'Authorization': 'Token token=032d90a59dcb3d375c563cbe822ae0bd'
   }
});

export {apiCep};