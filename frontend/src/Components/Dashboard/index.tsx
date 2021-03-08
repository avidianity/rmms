import React, { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { routes } from '../../routes';
import Medicine from '../Pharmacy/Medicine';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

type Props = {};

const Dashboard: FC<Props> = (props) => {
	const match = useRouteMatch();

	const url = (path: string) => `${match.path}${path}`;

	return (
		<>
			<div className='wrapper'>
				<Sidebar />
				<div className='main-panel'>
					<Navbar />
					<div className='content'>
						<Switch>
							<Route path={url(routes.MEDICINES)} component={Medicine} />
						</Switch>
					</div>
				</div>
			</div>
		</>
	);
};

export default Dashboard;
