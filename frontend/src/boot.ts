import './shims';
import axios from 'axios';
import state from './state';
import 'toastr/build/toastr.css';
import $ from 'jquery';
import 'bootstrap';

const url = process.env.REACT_APP_BACKEND_URL || window.location.origin;

axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = `${url}/api`;

window.$ = $;

axios.options(`${url}`).catch(console.error);

axios.interceptors.request.use((config) => {
	config.url = config.url?.replace('http://', 'https://');
	config.url = config.url?.replace('https://', '//');
	return config;
});

axios.get(`${url}/sanctum/csrf-cookie`).catch(console.error);

if (state.has('token')) {
	const token = state.get<string>('token');
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

state.listen<string>('token', (token) => {
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
});
