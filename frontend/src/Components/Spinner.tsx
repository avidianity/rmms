import React, { FC } from 'react';

type Props = {};

const Spinner: FC<Props> = (props) => {
	return (
		<div className='d-flex align-items-center justify-content-center h-100vh'>
			<i className='material-icons spin'>settings</i>
		</div>
	);
};

export default Spinner;
