import React, { FC } from 'react';
import { Daily as DailyContract } from '../../../Contracts/misc';

type Props = {
	daily: DailyContract;
};

const Daily: FC<Props> = ({ daily }) => {
	return (
		<div className='col-sm-12 col-md-3'>
			<div className='card'>
				<div className='card-header card-header-danger'>
					<p className='card-category'>Totals Today</p>
					<h5 className='card-title'>Regular Records: {daily.regular_records}</h5>
					<h5 className='card-title'>Prenatal Records: {daily.prenatal_records}</h5>
					<h5 className='card-title'>Patients: {daily.patients}</h5>
				</div>
				<div className='card-footer pb-2'>
					<div className='stats'>
						<i className='material-icons'>games</i>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Daily;
