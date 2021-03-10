import React, { FC } from 'react';
import { Weeks as WeeksContract } from '../../../Contracts/misc';

type Props = {
	weeks: WeeksContract;
};

const Weeks: FC<Props> = ({ weeks }) => {
	return (
		<div className='col-sm-12 col-md-3'>
			<div className='card'>
				<div className='card-header card-header-info'>
					<p className='card-category'>Totals This Week</p>
					<h5 className='card-title'>Regular Records: {weeks.regular_records}</h5>
					<h5 className='card-title'>Prenatal Records: {weeks.prenatal_records}</h5>
					<h5 className='card-title'>Patients: {weeks.patients}</h5>
				</div>
				<div className='card-footer pb-2'>
					<div className='stats'>
						<i className='material-icons'>view_carousel</i>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Weeks;
