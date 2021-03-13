import React, { FC } from 'react';
import { NavLink as Link, useRouteMatch } from 'react-router-dom';
import { User } from '../../Contracts/User';
import { MainBus } from '../../events';
import { routes } from '../../routes';
import state from '../../state';

type Props = {};

const Sidebar: FC<Props> = (props) => {
	const match = useRouteMatch();

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
			title: 'Supply Stocks',
			icon: 'inventory',
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
		// {
		// 	to: url(routes.BABIES),
		// 	title: 'Babies',
		// 	icon: 'child_care',
		// 	show: ['Nurse', 'Midwife', 'Doctor', 'Admin'].includes(user.role),
		// },
		{
			to: url(routes.PATIENTS),
			title: 'Patients',
			icon: 'supervised_user_circle',
			show: ['Nurse', 'Midwife', 'Doctor', 'Admin'].includes(user.role),
		},
		{
			to: url(routes.RECORDS.REGULAR),
			title: 'Regular Records',
			icon: 'contact_page',
			show: ['Nurse', 'Midwife', 'Doctor', 'Admin'].includes(user.role),
		},
		{
			to: url(routes.RECORDS.PRENATAL),
			title: 'Prenatal Records',
			icon: 'pregnant_woman',
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
					<li className='nav-item'>
						<a
							href='/logout'
							className='nav-link mobile-logout'
							onClick={(e) => {
								e.preventDefault();
								MainBus.dispatch('logout');
							}}>
							<i className='material-icons'>logout</i>
							Logout
						</a>
					</li>
					<li className='nav-item active-pro'>
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
