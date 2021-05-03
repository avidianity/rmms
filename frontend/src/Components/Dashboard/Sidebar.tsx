import React, { FC, useContext } from 'react';
import { NavLink as Link, useRouteMatch } from 'react-router-dom';
import { SearchContext } from '../../contexts';
import { User } from '../../Contracts/User';
import { MainBus, SearchBus } from '../../events';
import { outIf } from '../../helpers';
import { routes } from '../../routes';
import state from '../../state';

type Props = {};

const Sidebar: FC<Props> = (props) => {
	const match = useRouteMatch();

	const { show: showSearch } = useContext(SearchContext);

	const url = (path: string) => `${match.path}${path}`;

	const user = state.get<User>('user');

	const links: { to: string; icon: string; title: string; exact?: boolean; show: boolean }[] = [
		{
			to: url(''),
			title: 'Dashboard',
			icon: 'dashboard',
			exact: true,
			show: true,
		},
		{
			to: url(routes.INVENTORIES),
			title: 'Medical Supplies',
			icon: 'inventory',
			show: ['Pharmacist', 'Admin'].includes(user.role),
		},
		{
			to: url(routes.INVENTORY_RELEASES),
			title: 'Supply Releases',
			icon: 'receipt_long',
			show: ['Pharmacist', 'Admin'].includes(user.role),
		},
		{
			to: url(routes.MEDICINES),
			title: 'Medicine Stocks',
			icon: 'local_pharmacy',
			show: ['Pharmacist', 'Admin'].includes(user.role),
		},
		{
			to: url(routes.PRESCRIPTIONS),
			title: 'Prescriptions',
			icon: 'medication',
			show: ['Pharmacist', 'Admin'].includes(user.role),
		},
		{
			to: url(routes.PATIENTS),
			title: 'Patients',
			icon: 'supervised_user_circle',
			show: ['Nurse', 'Midwife', 'Doctor', 'Admin'].includes(user.role),
		},
		{
			to: url(routes.RECORDS.REGULAR),
			title: 'Regular Patients',
			icon: 'contact_page',
			show: ['Nurse', 'Midwife', 'Doctor', 'Admin'].includes(user.role),
		},
		{
			to: url(routes.RECORDS.PRENATAL),
			title: 'Prenatal Patients',
			icon: 'pregnant_woman',
			show: ['Nurse', 'Midwife', 'Doctor', 'Admin'].includes(user.role),
		},
		{
			to: url(routes.RECORDS.IMMUNIZATION),
			title: 'Immunization Patients',
			icon: 'coronavirus',
			show: ['Nurse', 'Midwife', 'Doctor', 'Admin'].includes(user.role),
		},
		{
			to: url(routes.RECORDS.ARCHIVED),
			title: 'Archived Records',
			icon: 'archive',
			show: ['Nurse', 'Midwife', 'Doctor', 'Admin'].includes(user.role),
		},
		{
			to: url(routes.USERS),
			title: 'Users',
			icon: 'account_circle',
			show: user.role === 'Admin',
		},
	];

	return (
		<div className='sidebar' data-color='green' data-background-color='white' data-image='/assets/img/sidebar-1.jpg'>
			<div className='logo'>
				<Link to={routes.HOME} className='simple-text logo-normal d-flex align-items-center justify-content-center'>
					<img
						src='/assets/img/manifest-icon-512.png'
						alt='RMMS'
						className='rounded-circle shadow-sm border mr-2'
						style={{ height: '40px', width: '40px' }}
					/>
					RMMS - MHCG
				</Link>
			</div>
			<div className='sidebar-wrapper'>
				<ul className='nav'>
					<li className={`nav-item mobile-logout ${outIf(!showSearch, 'd-none')}`}>
						<form
							className='navbar-form px-3'
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
					</li>
					{links.map((link, index) =>
						link.show ? (
							<li className='nav-item' key={index}>
								<Link to={link.to} exact={link.exact} className='nav-link' activeClassName='active'>
									<i className='material-icons'>{link.icon}</i>
									<p>{link.title}</p>
								</Link>
							</li>
						) : null
					)}
					<li className='nav-item mobile-logout'>
						<a
							href='/logout'
							className='nav-link'
							onClick={(e) => {
								e.preventDefault();
								MainBus.dispatch('logout');
							}}>
							<i className='material-icons'>logout</i>
							Logout
						</a>
					</li>
					<li className='nav-item'>
						<Link className='nav-link' to={url(routes.PROFILE)}>
							<i className='material-icons'>settings</i>
							<p>Profile Settings</p>
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Sidebar;
