import dayjs from 'dayjs';
import lodash from 'lodash';
import React, { FC } from 'react';
import { useHistory } from 'react-router';
import { Months as MonthsContract } from '../../../Contracts/misc';
import { routes } from '../../../routes';

type Props = {
	months: MonthsContract;
};

const Months: FC<Props> = ({ months }) => {
	const month = dayjs().format('MMMM');
	const history = useHistory();

	return (
		<div className='row'>
			<div className='col-lg-6 col-md-12'>
				<div className='card'>
					<div className='card-header card-header-info'>
						<h4 className='card-title'>Monthly Prenatal Records</h4>
						<p className='card-category'>Newest - {month}</p>
					</div>
					<div className='card-body table-responsive'>
						<table className='table table-hover'>
							<thead className='text-info'>
								<tr>
									<th>ID</th>
									<th>Patient</th>
									<th>Attendee</th>
									<th>Remarks</th>
									<th>Last Updated</th>
								</tr>
							</thead>
							<tbody>
								{months.current.prenatal_records.map((record, index) => (
									<tr
										key={index}
										className='clickable'
										onClick={() => {
											history.push(`${routes.DASHBOARD}${routes.RECORDS.REGULAR}/${record.id}`);
										}}>
										<td>{record.id}</td>
										<td>{record.patient?.name}</td>
										<td>{record.attendee?.name}</td>
										<td>{lodash.truncate(record.remarks || '', { length: 10 })}</td>
										<td>{dayjs(record.updated_at!).format('MMMM DD, YYYY hh:mm A')}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div className='col-lg-6 col-md-12'>
				<div className='card'>
					<div className='card-header card-header-success'>
						<h4 className='card-title'>Monthly Regular Records</h4>
						<p className='card-category'>Newest - {month}</p>
					</div>
					<div className='card-body table-responsive'>
						<table className='table table-hover'>
							<thead className='text-success'>
								<tr>
									<th>ID</th>
									<th>Patient</th>
									<th>Doctor</th>
									<th>Diagnosis</th>
									<th>Last Updated</th>
								</tr>
							</thead>
							<tbody>
								{months.current.regular_records.map((record, index) => (
									<tr
										key={index}
										className='clickable'
										onClick={() => {
											history.push(`${routes.DASHBOARD}${routes.RECORDS.PRENATAL}/${record.id}`);
										}}>
										<td>{record.id}</td>
										<td>{record.patient?.name}</td>
										<td>{record.doctor?.name}</td>
										<td>{lodash.truncate(record.diagnosis, { length: 10 })}</td>
										<td>{dayjs(record.updated_at!).format('MMMM DD, YYYY hh:mm A')}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Months;
