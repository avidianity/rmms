import './shims';
import axios from 'axios';
import state from './state';
import 'toastr/build/toastr.css';
import $ from 'jquery';
import 'bootstrap';

axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = `${process.env.REACT_APP_BACKEND_URL}/api`;

window.$ = $;

axios.get(`${process.env.REACT_APP_BACKEND_URL}/sanctum/csrf-cookie`).catch(console.error);

if (state.has('token')) {
	const token = state.get<string>('token');
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

state.listen<string>('token', (token) => {
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
});
