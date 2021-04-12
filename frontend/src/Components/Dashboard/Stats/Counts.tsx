import React, { FC } from 'react';
import { Counts as CountsContract } from '../../../Contracts/misc';
import { User } from '../../../Contracts/User';
import { outIf } from '../../../helpers';
import state from '../../../state';

type Props = {
	counts: CountsContract;
};

const Counts: FC<Props> = ({ counts }) => {
	const user = state.get<User>('user');

	return (
		<div className='row'>
			<div className='col-12 pb-3'>
				<h3>Totals</h3>
			</div>
			<div className={`col-md-4 col-sm-12 ${outIf(!['Pharmacist', 'Admin'].includes(user.role), 'd-none')}`}>
				<div className={`card card-stats`}>
					<div className='card-header card-header-warning card-header-icon'>
						<div className='card-icon'>
							<i className='material-icons'>medication</i>
						</div>
						<p className='card-category'>Medicine Stocks</p>
						<h4 className='card-title'>{counts.medicine.on_stock}</h4>
					</div>
					<div className='card-footer'>
						<div className='stats'>
							<i className='material-icons'>filter_alt</i> {counts.medicine.out_of_stock} are{' '}
							<span className='badge-danger px-2 rounded ml-2'>Out of Stock</span>
						</div>
					</div>
				</div>
			</div>
			<div className={`col-md-4 col-sm-12 ${outIf(!['Pharmacist', 'Admin'].includes(user.role), 'd-none')}`}>
				<div className='card card-stats'>
					<div className='card-header card-header-primary card-header-icon'>
						<div className='card-icon'>
							<i className='material-icons'>contact_page</i>
						</div>
						<p className='card-category'>Released Prescriptions</p>
						<h4 className='card-title'>{counts.prescriptions.released}</h4>
					</div>
					<div className='card-footer'>
						<div className='stats'>
							<i className='material-icons'>eco</i> Total
						</div>
					</div>
				</div>
			</div>
			<div className={`col-md-4 col-sm-12 ${outIf(!['Pharmacist', 'Admin'].includes(user.role), 'd-none')}`}>
				<div className='card card-stats'>
					<div className='card-header card-header-danger card-header-icon'>
						<div className='card-icon'>
							<i className='material-icons'>medication</i>
						</div>
						<p className='card-category'>Pending Prescriptions</p>
						<h4 className='card-title'>{counts.prescriptions.pending}</h4>
					</div>
					<div className='card-footer'>
						<div className='stats'>
							<i className='material-icons'>label</i> Total
						</div>
					</div>
				</div>
			</div>
			<div className='col-lg-4 col-md-6 col-sm-12'>
				<div className='card card-stats'>
					<div className='card-header card-header-success card-header-icon'>
						<div className='card-icon'>
							<i className='material-icons'>favorite</i>
						</div>
						<p className='card-category'>Immunization Records</p>
						<h4 className='card-title'>{counts.immunization_records}</h4>
					</div>
					<div className='card-footer'>
						<div className='stats'>
							<i className='material-icons'>star_rate</i> Total
						</div>
					</div>
				</div>
			</div>
			<div className='col-lg-4 col-md-6 col-sm-12'>
				<div className='card card-stats'>
					<div className='card-header card-header-danger card-header-icon'>
						<div className='card-icon'>
							<i className='material-icons'>pregnant_woman</i>
						</div>
						<p className='card-category'>Prenatal Records</p>
						<h4 className='card-title'>{counts.prenatal_records}</h4>
					</div>
					<div className='card-footer'>
						<div className='stats'>
							<i className='material-icons'>local_offer</i> Total
						</div>
					</div>
				</div>
			</div>
			<div className='col-lg-4 col-md-6 col-sm-12'>
				<div className='card card-stats'>
					<div className='card-header card-header-info card-header-icon'>
						<div className='card-icon'>
							<i className='material-icons'>contact_page</i>
						</div>
						<p className='card-category'>Regular Records</p>
						<h4 className='card-title'>{counts.regular_records}</h4>
					</div>
					<div className='card-footer'>
						<div className='stats'>
							<i className='material-icons'>update</i> Total
						</div>
					</div>
				</div>
			</div>
			<div className='col-md-6 col-sm-12'>
				<div className='card card-stats'>
					<div className='card-header card-header-warning card-header-icon'>
						<div className='card-icon'>
							<i className='material-icons'>account_circle</i>
						</div>
						<p className='card-category'>Users</p>
						<h4 className='card-title'>{counts.users}</h4>
					</div>
					<div className='card-footer'>
						<div className='stats'>
							<i className='material-icons'>lightbulb</i> Total
						</div>
					</div>
				</div>
			</div>
			<div className='col-md-6 col-sm-12'>
				<div className='card card-stats'>
					<div className='card-header card-header-success card-header-icon'>
						<div className='card-icon'>
							<i className='material-icons'>supervised_user_circle</i>
						</div>
						<p className='card-category'>Patients</p>
						<h4 className='card-title'>{counts.patients}</h4>
					</div>
					<div className='card-footer'>
						<div className='stats'>
							<i className='material-icons'>filter_alt</i> Total
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Counts;
