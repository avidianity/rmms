import React, { FC } from 'react';
import { Quarters as QuartersContract } from '../../../Contracts/misc';

type Props = {
	quarters: QuartersContract;
};

const Quarters: FC<Props> = ({ quarters }) => {
	return (
		<div className='col-sm-12 col-md-3'>
			<div className='card'>
				<div className='card-header card-header-success'>
					<p className='card-category'>Totals This Quarter</p>
					<h5 className='card-title'>Regular Records: {quarters.regular_records}</h5>
					<h5 className='card-title'>Prenatal Records: {quarters.prenatal_records}</h5>
					<h5 className='card-title'>Patients: {quarters.patients}</h5>
				</div>
				<div className='card-footer pb-2'>
					<div className='stats'>
						<i className='material-icons'>query_builder</i>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Quarters;
