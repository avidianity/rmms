import React, { FC, useState } from 'react';
import { outIf } from '../helpers';

type Props = {};

const Plugin: FC<Props> = (props) => {
	const [show, setShow] = useState(false);
	return (
		<div className='fixed-plugin'>
			<div className={`dropdown show-dropdown ${outIf(show, 'show')}`}>
				<a
					href='/'
					onClick={(e) => {
						e.preventDefault();
						setShow(!show);
					}}>
					<i className='fa fa-cog fa-2x'> </i>
				</a>
				<ul className={`dropdown-menu ${outIf(show, 'show')}`}>
					<li className='header-title'>Sidebar Filters</li>
					<li className='adjustments-line'>
						<a href='javascript:void(0)' className='switch-trigger active-color'>
							<div className='badge-colors ml-auto mr-auto'>
								<span className='badge filter badge-purple' data-color='purple'></span>
								<span className='badge filter badge-azure' data-color='azure'></span>
								<span className='badge filter badge-green' data-color='green'></span>
								<span className='badge filter badge-warning' data-color='orange'></span>
								<span className='badge filter badge-danger' data-color='danger'></span>
								<span className='badge filter badge-rose active' data-color='rose'></span>
							</div>
							<div className='clearfix'></div>
						</a>
					</li>
					<li className='header-title'>Images</li>
					<li className='active'>
						<a className='img-holder switch-trigger' href='javascript:void(0)'>
							<img src='/assets/img/sidebar-1.jpg' alt='' />
						</a>
					</li>
					<li>
						<a className='img-holder switch-trigger' href='javascript:void(0)'>
							<img src='/assets/img/sidebar-2.jpg' alt='' />
						</a>
					</li>
					<li>
						<a className='img-holder switch-trigger' href='javascript:void(0)'>
							<img src='/assets/img/sidebar-3.jpg' alt='' />
						</a>
					</li>
					<li>
						<a className='img-holder switch-trigger' href='javascript:void(0)'>
							<img src='/assets/img/sidebar-4.jpg' alt='' />
						</a>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Plugin;
