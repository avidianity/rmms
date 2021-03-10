import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Login from './Components/Auth/Login';
import Dashboard from './Components/Dashboard';
import Loader from './Components/Loader';
import { routes } from './routes';
import state from './state';

function App() {
	const [loaded, setLoaded] = useState(false);
	const [message, setMessage] = useState({ body: 'Hi!', icon: 'favorite' });

	const loadScripts = async () => {
		setMessage({ body: 'Loading assets...', icon: 'web_asset' });
		await Promise.all([import('jquery'), import('popper.js'), import('bootstrap')]);
		setMessage({ body: 'Loading scripts...', icon: 'subscript' });
		const scripts = await Promise.all(
			[
				'/assets/js/core/jquery.min.js',
				'/assets/js/core/popper.min.js',
				'/assets/js/core/bootstrap-material-design.min.js',
				'/assets/js/plugins/perfect-scrollbar.jquery.min.js',
				'/assets/js/plugins/moment.min.js',
				'/assets/js/plugins/sweetalert2.js',
				'/assets/js/plugins/jquery.validate.min.js',
				'/assets/js/plugins/jquery.bootstrap-wizard.js',
				'/assets/js/plugins/bootstrap-selectpicker.js',
				'/assets/js/plugins/bootstrap-datetimepicker.min.js',
				'/assets/js/plugins/jquery.dataTables.min.js',
				'/assets/js/plugins/bootstrap-tagsinput.js',
				'/assets/js/plugins/jasny-bootstrap.min.js',
				'/assets/js/plugins/fullcalendar.min.js',
				'/assets/js/plugins/jquery-jvectormap.js',
				'/assets/js/plugins/nouislider.min.js',
				'/assets/js/plugins/arrive.min.js',
				'/assets/js/plugins/chartist.min.js',
				'/assets/js/plugins/bootstrap-notify.js',
				'/assets/js/material-dashboard.js',
				'/assets/demo/demo.js',
				'/assets/js/loader.js',
			].map(async (url) => {
				const { data } = await axios.get<string>(`//${window.location.host}${url}`);
				return data;
			})
		);

		scripts.forEach((data) => {
			const script = document.createElement('script');
			script.innerHTML = data;
			document.body.append(script);
		});
	};

	const load = async () => {
		await loadScripts();
		setMessage({ body: 'Checking authentication...', icon: 'admin_panel_settings' });
		try {
			const { data } = await axios.get('/auth/check');
			state.set('user', data);
		} catch (_) {
			state.remove('user').remove('token');
		} finally {
			setMessage({ body: 'Booting up...', icon: 'toll' });
			setLoaded(true);
		}
	};

	useEffect(() => {
		load();
		// eslint-disable-next-line
	}, []);

	return !loaded ? (
		<Loader>
			<p className='lead d-flex align-items-center justify-content-center'>
				<i className='material-icons mr-1'>{message.icon}</i>
				{message.body}
			</p>
		</Loader>
	) : (
		<Router>
			<Switch>
				<Route path={routes.HOME} exact component={Login} />
				<Route path={routes.DASHBOARD} component={Dashboard} />
				<Route path={routes.LOGIN} component={Login} />
			</Switch>
		</Router>
	);
}

export default App;
