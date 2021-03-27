import React, { FC } from 'react';
import { Route, Switch } from 'react-router';
import { useRouteMatch } from 'react-router-dom';
import List from './List';

type Props = {};

const Archived: FC<Props> = (props) => {
	const match = useRouteMatch();

	const url = (path: string) => `${match.path}${path}`;

	return (
		<Switch>
			<Route path={url('')} exact component={List} />
		</Switch>
	);
};

export default Archived;
