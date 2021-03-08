import React, { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Form from './Form';
import List from './List';

type Props = {};

const Medicine: FC<Props> = (props) => {
	const match = useRouteMatch();

	const url = (path: string) => `${match.path}${path}`;

	return (
		<Switch>
			<Route path={url('')} exact component={List} />
			<Route path={url('/add')} exact component={Form} />
			<Route path={url('/:id/edit')} exact component={Form} />
		</Switch>
	);
};

export default Medicine;
