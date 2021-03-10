import React, { FC } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { routes } from '../../routes';
import state from '../../state';
import Patients from '../Patients';
import Medicine from '../Pharmacy/Medicine';
import Prescriptions from '../Pharmacy/Prescriptions';
import Requests from '../Pharmacy/Requests';
import PrenatalRecords from '../Records/Prenatal';
import RegularRecords from '../Records/Regular';
import Users from '../Users';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Statistics from './Statistics';

type Props = {};

const Dashboard: FC<Props> = (props) => {
	const match = useRouteMatch();
	const history = useHistory();

	const url = (path: string) => `${match.path}${path}`;

	if (!state.has('user')) {
		history.push(routes.LOGIN);
		return null;
	}

	return (
		<>
			<div className='wrapper'>
				<Sidebar />
				<div className='main-panel'>
					<Navbar />
					<div className='content'>
						<Switch>
							<Route path={url('')} exact component={Statistics} />
							<Route path={url(routes.MEDICINES)} component={Medicine} />
							<Route path={url(routes.PURCHASE_REQUESTS)} component={Requests} />
							<Route path={url(routes.PATIENTS)} component={Patients} />
							<Route path={url(routes.RECORDS.REGULAR)} component={RegularRecords} />
							<Route path={url(routes.RECORDS.PRENATAL)} component={PrenatalRecords} />
							<Route path={url(routes.PRESCRIPTIONS)} component={Prescriptions} />
							<Route path={url(routes.USERS)} component={Users} />
						</Switch>
					</div>
				</div>
			</div>
		</>
	);
};

export default Dashboard;
