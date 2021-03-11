import React, { FC } from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';
import Form from './Form';
import List from './List';

type Props = {};

const IllnessHistories: FC<Props> = (props) => {
	const match = useRouteMatch();

	const url = (path: string) => `${match.path}${path}`;

	return (
		<Switch>
			<Route path={url('')} exact component={List} />
			<Route path={url('/add')} component={Form} />
			{/* <Route path={url('/:id')} exact component={View} /> */}
			<Route path={url('/:id/edit')} component={Form} />
		</Switch>
	);
};

export default IllnessHistories;
