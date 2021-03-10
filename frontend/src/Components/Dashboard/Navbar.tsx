import axios from 'axios';
import React, { FC, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { routes } from '../../routes';
import toastr from 'toastr';
import { outIf } from '../../helpers';
import state from '../../state';
import { User } from '../../Contracts/User';

type Props = {};

const Navbar: FC<Props> = (props) => {
	const [show, setShow] = useState(false);
	const history = useHistory();
	const logout = async () => {
		try {
			await axios.post('/auth/logout');
		} catch (_) {
		} finally {
			toastr.info('You have logged out.', 'Notice');
			state.clear();
			history.push(routes.LOGIN);
		}
	};

	const user = state.get<User>('user');

	return (
		<nav className='navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top'>
			<div className='container-fluid'>
				<div className='navbar-wrapper'>
					<Link className='navbar-brand' to={routes.DASHBOARD}>
						Dashboard - {user.role}
					</Link>
				</div>
				<button
					className='navbar-toggler'
					type='button'
					data-toggle='collapse'
					aria-controls='navigation-index'
					aria-expanded='false'
					aria-label='Toggle navigation'>
					<span className='sr-only'>Toggle navigation</span>
					<span className='navbar-toggler-icon icon-bar'></span>
					<span className='navbar-toggler-icon icon-bar'></span>
					<span className='navbar-toggler-icon icon-bar'></span>
				</button>
				<div className='collapse navbar-collapse justify-content-end'>
					<form className='navbar-form'>
						<div className='input-group no-border'>
							<input type='text' value='' className='form-control' placeholder='Search...' />
							<button type='submit' className='btn btn-white btn-round btn-just-icon'>
								<i className='material-icons'>search</i>
								<div className='ripple-container'></div>
							</button>
						</div>
					</form>
					<ul className='navbar-nav'>
						<li className='nav-item dropdown'>
							<a
								className='nav-link'
								href='/'
								onClick={(e) => {
									e.preventDefault();
									setShow(!show);
								}}>
								<i className='material-icons'>person</i>
								<p className='d-lg-none d-md-block'>Account</p>
							</a>
							<div className={`dropdown-menu dropdown-menu-right ${outIf(show, 'show')}`}>
								<a className='dropdown-item' href='/'>
									Profile
								</a>
								<a className='dropdown-item' href='/'>
									Settings
								</a>
								<div className='dropdown-divider'></div>
								<a
									className='dropdown-item'
									href='/'
									onClick={(e) => {
										e.preventDefault();
										logout();
									}}>
									Logout
								</a>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
