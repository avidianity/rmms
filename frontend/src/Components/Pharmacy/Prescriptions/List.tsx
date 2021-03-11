import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { RecordableMap } from '../../../contants';
import { Paginated } from '../../../Contracts/misc';
import { Prescription } from '../../../Contracts/Prescription';
import { makeDummyPagination, handleError } from '../../../helpers';
import state from '../../../state';
import Pagination from '../../Pagination';
import Table from '../../Table';
import { User } from '../../../Contracts/User';

type Props = {};

const List: FC<Props> = (props) => {
	const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
	const [pagination, setPagination] = useState<Paginated>(makeDummyPagination());
	const match = useRouteMatch();

	const url = (path: string) => `${match.path}${path}`;

	const fetchPrescriptions = async (url?: string) => {
		try {
			const page = state.get<number>('prescription-page') || 1;
			const { data } = await axios.get<Paginated<Prescription>>(url ? url : `/pharmacy/prescriptions?page=${page}`);
			setPrescriptions(data.data);
			setPagination(data);
			state.set('prescription-page', data.current_page);
		} catch (error) {
			handleError(error);
		}
	};

	// const deletePrescription = async (id: any) => {
	// 	try {
	// 		await axios.delete(`/pharmacy/prescriptions/${id}`);
	// 		toastr.info('Prescription has been deleted.', 'Notice');
	// 		fetchPrescriptions();
	// 	} catch (error) {
	// 		handleError(error);
	// 	}
	// };

	const user = state.get<User>('user');

	useEffect(() => {
		fetchPrescriptions();
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<Table
				title='Prescriptions'
				head={() => (
					<tr>
						<th>ID</th>
						<th>Patient</th>
						<th>Doctor</th>
						<th>Type of Record</th>
						<th>Case Number</th>
						<th>Released</th>
						<th colSpan={3}>Actions</th>
					</tr>
				)}
				foot={() => <Pagination pagination={pagination} onChange={(url) => fetchPrescriptions(url)} />}>
				{prescriptions.map(({ id, released_at, recordable, recordable_type, doctor, doctor_id }, index) => (
					<tr key={index}>
						<td>{id}</td>
						<td>{recordable?.patient?.name}</td>
						<td>{doctor?.name}</td>
						<td>{RecordableMap[recordable_type.split('\\')[2]]}</td>
						<td>{dayjs(recordable?.case_number!).format('MMMM DD, YYYY')}</td>
						<td>{released_at ? dayjs(released_at).format('MMMM DD, YYYY hh:mm A') : 'N/A'}</td>
						<td>
							<Link to={url(`/${id}`)} className='btn btn-info btn-sm' title='View'>
								<i className='material-icons mr-1'>visibility</i>
								View
							</Link>
							{released_at === null && doctor_id === user.id ? (
								<Link to={url(`/${id}/edit`)} className='btn btn-warning btn-sm' title='Edit'>
									<i className='material-icons mr-1'>create</i>
									Edit
								</Link>
							) : null}
						</td>
					</tr>
				))}
			</Table>
		</>
	);
};

export default List;
