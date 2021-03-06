import React, { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Form from './Form';
import List from './List';
import View from './View';

type Props = {};

const RegularRecords: FC<Props> = (props) => {
	const match = useRouteMatch();

	const url = (path: string) => `${match.path}${path}`;

	return (
		<Switch>
			<Route path={url('')} exact component={List} />
			<Route path={url('/add')} component={Form} />
			<Route path={url('/:id')} exact component={View} />
			<Route path={url('/:id/edit')} component={Form} />
		</Switch>
	);
};

export default RegularRecords;
