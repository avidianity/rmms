import axios from 'axios';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { routes } from '../../routes';
import toastr from 'toastr';
import { outIf } from '../../helpers';
import state from '../../state';
import { User } from '../../Contracts/User';
import { MainBus, SearchBus } from '../../events';
import $ from 'jquery';
import { Medicine } from '../../Contracts/Medicine';
import dayjs from 'dayjs';
import { Inventory } from '../../Contracts/Inventory';
import { SearchContext } from '../../contexts';

type Props = {
	mode: string;
};

const Navbar: FC<Props> = ({ mode }) => {
	const [show, setShow] = useState(false);
	const [showNotifications, setShowNotifications] = useState(false);
	const [expiring, setExpiring] = useState<{ medicines: Medicine[]; inventories: Inventory[] }>({ medicines: [], inventories: [] });
	const [criticals, setCriticals] = useState<{ medicines: Medicine[]; inventories: Inventory[] }>({ medicines: [], inventories: [] });
	const history = useHistory();
	const match = useRouteMatch();

	const { show: showSearch } = useContext(SearchContext);

	const url = (path: string) => `${match.path}${path}`;

	const logout = async () => {
		try {
			await axios.post('/auth/logout');
		} catch (_) {
		} finally {
			toastr.info('You have logged out.', 'Notice');
			state.remove('user').remove('token');
			history.push(routes.LOGIN);
		}
	};

	const fetchExpiring = async () => {
		try {
			const [{ data: medicines }, { data: inventories }] = await Promise.all([
				axios.get(`/expiring/medicines`),
				axios.get(`/expiring/inventories`),
			]);
			setExpiring({ medicines, inventories });
		} catch (error) {
			console.log(error.toJSON());
		}
	};

	const fetchCriticals = async () => {
		try {
			const [{ data: medicines }, { data: inventories }] = await Promise.all([
				axios.get(`/criticals/medicines`),
				axios.get(`/criticals/inventories`),
			]);
			setCriticals({ medicines, inventories });
		} catch (error) {
			console.log(error.toJSON());
		}
	};

	const user = state.get<User>('user');

	useEffect(() => {
		fetchExpiring();
		fetchCriticals();

		const key = MainBus.listen('logout', () => {
			logout();
		});

		const searchKey = SearchBus.listen('submit', () => {
			if ($(window).width() || 0 <= 992) {
				$('.close-layer').trigger('click');
			}
		});

		const expiringHandle = setInterval(() => fetchExpiring(), 10000);
		const criticalsHandle = setInterval(() => fetchCriticals(), 10000);

		return () => {
			clearInterval(expiringHandle);
			clearInterval(criticalsHandle);
			MainBus.unlisten('logout', key);
			SearchBus.unlisten('submit', searchKey);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<nav className='navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top'>
			<div className='container-fluid'>
				<div className='navbar-wrapper d-flex'>
					<Link className='navbar-brand' to={routes.DASHBOARD}>
						Dashboard - {user?.role}
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
					{showSearch ? (
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
					) : null}
					<ul className='navbar-nav'>
						<li className='nav-item dropdown'>
							<a
								className='nav-link'
								href='/'
								onClick={(e) => {
									e.preventDefault();
									setShowNotifications(!showNotifications);
								}}>
								<i className='material-icons'>notifications</i>
								{expiring.medicines.length > 0 ||
								expiring.inventories.length > 0 ||
								criticals.inventories.length > 0 ||
								criticals.medicines.length > 0 ? (
									<span className='notification'>
										{expiring.medicines.length +
											expiring.inventories.length +
											criticals.inventories.length +
											criticals.medicines.length}
									</span>
								) : null}
								<p className='d-lg-none d-md-block'>Notifications</p>
								<div className='ripple-container'></div>
							</a>
							<div className={`dropdown-menu dropdown-menu-right ${outIf(showNotifications, 'show')}`}>
								{expiring.medicines.map((medicine, index) => (
									<Link
										to={`${routes.DASHBOARD}${routes.MEDICINES}/${medicine.id}/edit`}
										className='dropdown-item'
										key={index}>
										Medicine '{medicine.description}' is about to expire {dayjs(medicine.expiry_date).fromNow()}.
									</Link>
								))}
								{expiring.inventories.map((inventory, index) => (
									<Link
										to={`${routes.DASHBOARD}${routes.INVENTORIES}/${inventory.id}/edit`}
										className='dropdown-item'
										key={index}>
										Supply '{inventory.description}' is about to expire {dayjs(inventory.expiry_date).fromNow()}.
									</Link>
								))}
								{criticals.medicines.map((medicine, index) => (
									<Link
										to={`${routes.DASHBOARD}${routes.MEDICINES}/${medicine.id}/edit`}
										className='dropdown-item'
										key={index}>
										Medicine '{medicine.description}' is in it's critical value of {medicine.available}.
									</Link>
								))}
								{criticals.inventories.map((inventory, index) => (
									<Link
										to={`${routes.DASHBOARD}${routes.INVENTORIES}/${inventory.id}/edit`}
										className='dropdown-item'
										key={index}>
										Supply '{inventory.description}' is in it's critical value of {inventory.available}.
									</Link>
								))}
								{expiring.medicines.length === 0 &&
								expiring.inventories.length === 0 &&
								criticals.medicines.length === 0 &&
								criticals.inventories.length === 0 ? (
									<a className='dropdown-item' href='/' onClick={(e) => e.preventDefault()}>
										No Notifications
									</a>
								) : null}
							</div>
						</li>
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
