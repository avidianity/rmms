import React, { FC } from 'react';

type Props = {};

const Loader: FC<Props> = (props) => {
	return (
		<div className='h-100vh d-flex'>
			<div className='align-self-center mx-auto'>
				<div className='container-fluid text-center'>
					<img
						src='/assets/img/manifest-icon-512.png'
						alt=''
						className={`rounded-circle`}
						style={{ height: '150px', width: '150px' }}
					/>
					{props.children}
				</div>
			</div>
		</div>
	);
};

export default Loader;
