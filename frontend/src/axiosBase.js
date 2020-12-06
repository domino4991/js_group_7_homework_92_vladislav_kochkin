import axios from 'axios';
import {apiUrl} from "./constants";
import store from './store/configureStore';

const axiosBase = axios.create({
    baseURL: apiUrl
});

axiosBase.interceptors.request.use(config => {
    try {
        config.headers['Authorization'] = store.getState().users.user.token;
    } catch (e) {}
    return config;
});

export default axiosBase;