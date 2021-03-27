import React, { FC, useEffect, useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { SearchContext } from '../../contexts';
import { routes } from '../../routes';
import state from '../../state';
import Babies from '../Babies';
import IllnessHistories from '../IllnessHistories';
import Inventories from '../Inventories';
import Patients from '../Patients';
import Medicine from '../Pharmacy/Medicine';
import Prescriptions from '../Pharmacy/Prescriptions';
import Profile from '../Profile';
import Archived from '../Records/Archived';
import ImmunizationRecords from '../Records/Immunization';
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
	const [color, setColor] = useState(state.get<string>('background-color') || 'dark');
	const [showSearch, setShowSearch] = useState(true);

	const url = (path: string) => `${match.path}${path}`;

	useEffect(() => {
		if (color === 'dark') {
			document.body.style.backgroundColor = 'rgb(50, 50, 50)';
		} else {
			document.body.style.backgroundColor = '#fff';
		}
		const key = state.listen<string>('background-color', (color) => {
			setColor(color);
			if (color === 'dark') {
				document.body.style.backgroundColor = 'rgb(50, 50, 50)';
			} else {
				document.body.style.backgroundColor = '#fff';
			}
		});
		return () => {
			document.body.style.backgroundColor = '#fff';
			state.unlisten('background-color', key);
		};
		//eslint-disable-next-line
	}, []);

	if (!state.has('user')) {
		history.push(routes.LOGIN);
		return null;
	}

	return (
		<SearchContext.Provider value={{ show: showSearch, setShow: setShowSearch }}>
			<div className='wrapper' data-mode={color}>
				<Sidebar />
				<div className='main-panel'>
					<Navbar mode={color} />
					<div className='content'>
						<Switch>
							<Route path={url('')} exact component={Statistics} />
							<Route path={url(routes.MEDICINES)} component={Medicine} />
							<Route path={url(routes.PATIENTS)} component={Patients} />
							<Route path={url(routes.RECORDS.REGULAR)} component={RegularRecords} />
							<Route path={url(routes.RECORDS.PRENATAL)} component={PrenatalRecords} />
							<Route path={url(routes.RECORDS.IMMUNIZATION)} component={ImmunizationRecords} />
							<Route path={url(routes.RECORDS.ARCHIVED)} component={Archived} />
							<Route path={url(routes.PRESCRIPTIONS)} component={Prescriptions} />
							<Route path={url(routes.USERS)} component={Users} />
							<Route path={url(routes.PROFILE)} component={Profile} />
							<Route path={url(routes.INVENTORIES)} component={Inventories} />
							<Route path={url(routes.ILLNESS_HISTORIES)} component={IllnessHistories} />
							<Route path={url(routes.BABIES)} component={Babies} />
						</Switch>
					</div>
				</div>
			</div>
		</SearchContext.Provider>
	);
};

export default Dashboard;
