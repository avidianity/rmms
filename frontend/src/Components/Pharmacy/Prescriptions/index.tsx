import React, { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import List from './List';
import View from './View';

type Props = {};

const Prescriptions: FC<Props> = (props) => {
	const match = useRouteMatch();

	const url = (path: string) => `${match.path}${path}`;

	return (
		<Switch>
			<Route path={url('')} exact component={List} />
			<Route path={url('/:id')} exact component={View} />
		</Switch>
	);
};

export default Prescriptions;
