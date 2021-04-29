import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { Paginated } from '../../../Contracts/misc';
import { Record } from '../../../Contracts/Record';
import { makeDummyPagination, handleError } from '../../../helpers';
import state from '../../../state';
import Pagination from '../../Pagination';
import Table from '../../Table';
import lodash from 'lodash';
import toastr from 'toastr';
import { SearchBus } from '../../../events';
import { User } from '../../../Contracts/User';

type Props = {};

const List: FC<Props> = (props) => {
	const [records, setRecords] = useState<Record[]>([]);
	const [pagination, setPagination] = useState<Paginated>(makeDummyPagination());
	const match = useRouteMatch();

	const url = (path: string) => `${match.path}${path}`;

	const fetchRecords = async (url?: string) => {
		try {
			const page = state.get<number>('regular-records-page') || 1;
			const { data } = await axios.get<Paginated<Record>>(url ? url : `/regular-records?page=${page}`);
			setRecords(data.data);
			setPagination(data);
			state.set('regular-records-page', data.current_page);
		} catch (error) {
			handleError(error);
		}
	};

	// const deleteRecord = async (id: any) => {
	// 	try {
	// 		await axios.delete(`/regular-records/${id}`);
	// 		toastr.info('Record has been deleted.', 'Notice');
	// 		fetchRecords();
	// 	} catch (error) {
	// 		handleError(error);
	// 	}
	// };

	const search = async (keyword: string) => {
		try {
			const { data } = await axios.get(`/search?model=Record&keyword=${encodeURIComponent(keyword)}&paginate=false`);
			setRecords(data);
			setPagination(makeDummyPagination());
		} catch (error) {
			console.log(error.toJSON());
			toastr.error('Unable to search.');
		}
	};

	useEffect(() => {
		fetchRecords();
		const key = SearchBus.listen<string>('submit', (keyword) => {
			if (keyword.length > 0) {
				search(keyword);
			} else {
				fetchRecords();
			}
		});
		return () => {
			SearchBus.unlisten('submit', key);
		};
		// eslint-disable-next-line
	}, []);

	const user = state.get<User>('user');

	return (
		<>
			{!['Admin', 'Doctor'].includes(user.role) ? (
				<Link to={url('/add')} className='btn btn-info btn-sm'>
					Add New Regular Patient
				</Link>
			) : null}
			<Table
				title='Regular Patients'
				head={() => (
					<tr>
						<th>ID</th>
						<th>Case Number</th>
						<th>Patient</th>
						<th>Doctor</th>
						<th>Diagnosis</th>
						<th>Status</th>
						<th>Last Updated</th>
						<th colSpan={3}>Actions</th>
					</tr>
				)}
				foot={() => <Pagination pagination={pagination} onChange={(url) => fetchRecords(url)} />}>
				{records.map(({ id, case_number, updated_at, patient, doctor, diagnosis, status }, index) => (
					<tr key={index}>
						<td>{id}</td>
						<td>{dayjs(case_number!).format('MMMM DD, YYYY')}</td>
						<td>{patient?.name}</td>
						<td>{doctor?.name}</td>
						<td>{lodash.truncate(diagnosis, { length: 20 })}</td>
						<td>
							<b>{status}</b>
						</td>
						<td>{dayjs(updated_at!).format('MMMM DD, YYYY hh:mm A')}</td>
						<td>
							<Link to={url(`/${id}`)} className='btn btn-info btn-sm' title='View'>
								<i className='material-icons mr-1'>visibility</i>
								View
							</Link>
							{status !== 'Done' && !['Admin'].includes(user.role) ? (
								<>
									<Link to={url(`/${id}/edit`)} className='btn btn-warning btn-sm' title='Edit'>
										<i className='material-icons mr-1'>create</i>
										{user.role === 'Doctor' ? 'Add Diagnosis and Prescription' : 'Edit'}
									</Link>
								</>
							) : null}
						</td>
					</tr>
				))}
			</Table>
		</>
	);
};

export default List;
