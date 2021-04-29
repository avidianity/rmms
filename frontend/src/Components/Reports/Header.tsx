import React, { FC } from 'react';

type Props = {};

const Header: FC<Props> = (props) => {
	return (
		<div className='d-flex mt-5 pt-3'>
			<img
				src='/assets/img/doh.jpg'
				alt='DOH'
				className='ml-auto border shadow-sm rounded-circle'
				style={{ height: '100px', width: '100px' }}
			/>
			<div className='mx-5 text-center'>
				<h2>MUNICIPAL HEALTH CENTER OF GLORIA</h2>
				<h4>Maligaya Gloria, Oriental Mindoro</h4>
			</div>
			<img
				src='/assets/img/logo.svg'
				alt='Center'
				className='mr-auto border shadow-sm rounded-circle'
				style={{ height: '100px', width: '100px' }}
			/>
		</div>
	);
};

export default Header;
