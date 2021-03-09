import React, { FC } from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';
import Form from './Form';
import List from './List';
import View from './View';

type Props = {};

const Patients: FC<Props> = (props) => {
	const match = useRouteMatch();

	const url = (path: string) => `${match.path}${path}`;

	return (
		<Switch>
			<Route path={url('')} exact component={List} />
			<Route path={url('/add')} exact component={Form} />
			<Route path={url('/:id/edit')} exact component={Form} />
			<Route path={url('/:id/view')} exact component={View} />
		</Switch>
	);
};

export default Patients;
