import axios from 'axios';
import React, { FC, useState } from 'react';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { routes } from '../../routes';
import toastr from 'toastr';
import { outIf } from '../../helpers';
import state from '../../state';
import { User } from '../../Contracts/User';
import { SearchBus } from '../../events';
import $ from 'jquery';

type Props = {
	mode: string;
};

const Navbar: FC<Props> = ({ mode }) => {
	const [show, setShow] = useState(false);
	const history = useHistory();
	const match = useRouteMatch();

	const url = (path: string) => `${match.path}${path}`;

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
				<div className='navbar-wrapper d-flex'>
					<Link className='navbar-brand' to={routes.DASHBOARD}>
						Dashboard - {user.role}
					</Link>
					<div className='ml-2 clickable mt-1'>
						<i
							className={`material-icons ${outIf(mode === 'dark', 'text-white')}`}
							onClick={() => {
								if (mode === 'light') {
									state.set('background-color', 'dark');
								} else {
									state.set('background-color', 'light');
								}
							}}>
							{mode === 'light' ? 'dark_mode' : 'light_mode'}
						</i>
					</div>
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
					<form
						className='navbar-form'
						onSubmit={(e) => {
							e.preventDefault();
							const keyword = String($('#search').val());
							SearchBus.dispatch('submit', keyword);
						}}>
						<div className='input-group no-border'>
							<input
								id='search'
								type='text'
								className='form-control'
								placeholder='Search...'
								onKeyUp={(e) => {
									e.preventDefault();
									if (e.key === 'Enter') {
										const keyword = (e.target as HTMLInputElement).value;
										SearchBus.dispatch('submit', keyword);
									}
								}}
								onChange={(e) => {
									SearchBus.dispatch('onChange', e);
								}}
							/>
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
								<Link className='dropdown-item' to={url(routes.PROFILE)}>
									Profile
								</Link>
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
