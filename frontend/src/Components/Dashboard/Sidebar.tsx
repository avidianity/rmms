import React, { FC } from 'react';
import { NavLink as Link, useRouteMatch } from 'react-router-dom';
import { routes } from '../../routes';

type Props = {};

const Sidebar: FC<Props> = (props) => {
	const match = useRouteMatch();

	const url = (path: string) => `${match.path}${path}`;
	const links = [
		{
			to: url(''),
			title: 'Dashboard',
			icon: 'dashboard',
			exact: true,
		},
		{
			to: url(routes.MEDICINES),
			title: 'Medicine Management',
			icon: 'local_pharmacy',
			exact: false,
		},
		{
			to: url(routes.PURCHASE_REQUESTS),
			title: 'Purchase Requests',
			icon: 'medical_services',
			exact: false,
		},
		{
			to: url(routes.PRESCRIPTIONS),
			title: 'Prescriptions',
			icon: 'medication',
			exact: false,
		},
		{
			to: url(routes.PATIENTS),
			title: 'Patients',
			icon: 'supervised_user_circle',
			exact: false,
		},
		{
			to: url(routes.RECORDS.REGULAR),
			title: 'Regular Records',
			icon: 'contact_page',
			exact: false,
		},
		{
			to: url(routes.RECORDS.PRENATAL),
			title: 'Prenatal Records',
			icon: 'pregnant_woman',
			exact: false,
		},
	];

	return (
		<div className='sidebar' data-color='purple' data-background-color='white' data-image='/assets/img/sidebar-1.jpg'>
			<div className='logo'>
				<Link to={routes.HOME} className='simple-text logo-normal d-flex align-items-center justify-content-center'>
					<img
						src='/assets/img/manifest-icon-512.png'
						alt='RMMS'
						className='rounded-circle shadow-sm border mr-2'
						style={{ height: '40px', width: '40px' }}
					/>
					RMMS
				</Link>
			</div>
			<div className='sidebar-wrapper'>
				<ul className='nav'>
					{links.map((link, index) => (
						<li className='nav-item' key={index}>
							<Link to={link.to} exact={link.exact} className='nav-link' activeClassName='active'>
								<i className='material-icons'>{link.icon}</i>
								<p>{link.title}</p>
							</Link>
						</li>
					))}
					<li className='nav-item active-pro'>
						<Link className='nav-link' to={routes.SETTINGS}>
							<i className='material-icons'>settings</i>
							<p>Settings</p>
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Sidebar;
