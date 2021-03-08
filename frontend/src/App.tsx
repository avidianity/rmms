import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import Dashboard from './Components/Dashboard';
import { routes } from './routes';

function App() {
	const loadScripts = () => {
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
			'https://cdnjs.cloudflare.com/ajax/libs/core-js/2.4.1/core.js',
			'/assets/js/plugins/arrive.min.js',
			'/assets/js/plugins/chartist.min.js',
			'/assets/js/plugins/bootstrap-notify.js',
			'/assets/js/material-dashboard.js',
			'/assets/demo/demo.js',
			'/assets/js/loader.js',
		].forEach((url) => {
			const script = document.createElement('script');
			script.src = url;
			script.defer = true;
			document.body.append(script);
		});
		const labels = $('.bmd-form-group');
		labels.on('focus', 'input', function () {
			$(this).addClass('is-focused');
		});
		labels.on('blur', 'input', function () {
			$(this).removeClass('is-focused');
		});
	};

	useEffect(() => {
		loadScripts();
		// eslint-disable-next-line
	}, []);

	return (
		<Router>
			<Switch>
				<Route path={routes.DASHBOARD} component={Dashboard} />
				<Route path={routes.LOGIN} component={Login} />
				<Route path={routes.REGISTER} component={Register} />
			</Switch>
		</Router>
	);
}

export default App;
