import React, { FC } from 'react';
import { Years as YearsContract } from '../../../Contracts/misc';

type Props = {
	years: YearsContract;
};

const Years: FC<Props> = ({ years }) => {
	return (
		<div className='col-sm-12 col-md-3'>
			<div className='card'>
				<div className='card-header card-header-warning'>
					<p className='card-category'>Totals This Year</p>
					<h5 className='card-title'>Regular Records: {years.regular_records}</h5>
					<h5 className='card-title'>Prenatal Records: {years.prenatal_records}</h5>
					<h5 className='card-title'>Patients: {years.patients}</h5>
				</div>
				<div className='card-footer pb-2'>
					<div className='stats'>
						<i className='material-icons'>lock_clock</i>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Years;
