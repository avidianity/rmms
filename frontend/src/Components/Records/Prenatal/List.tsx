import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { Paginated } from '../../../Contracts/misc';
import { PrenatalRecord } from '../../../Contracts/PrenatalRecord';
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
	const [records, setPrenatalRecords] = useState<PrenatalRecord[]>([]);
	const [pagination, setPagination] = useState<Paginated>(makeDummyPagination());
	const match = useRouteMatch();

	const url = (path: string) => `${match.path}${path}`;

	const fetchPrenatalRecords = async (url?: string) => {
		try {
			const page = state.get<number>('prenatal-records-page') || 1;
			const { data } = await axios.get<Paginated<PrenatalRecord>>(url ? url : `/prenatal-records?page=${page}`);
			setPrenatalRecords(data.data);
			setPagination(data);
			state.set('prenatal-records-page', data.current_page);
		} catch (error) {
			handleError(error);
		}
	};

	// const deletePrenatalRecord = async (id: any) => {
	// 	try {
	// 		await axios.delete(`/prenatal-records/${id}`);
	// 		toastr.info('Prenatal Record has been deleted.', 'Notice');
	// 		fetchPrenatalRecords();
	// 	} catch (error) {
	// 		handleError(error);
	// 	}
	// };

	const search = async (keyword: string) => {
		try {
			const { data } = await axios.get(`/search?model=PrenatalRecord&keyword=${encodeURIComponent(keyword)}&paginate=false`);
			setPrenatalRecords(data);
			setPagination(makeDummyPagination());
		} catch (error) {
			console.log(error.toJSON());
			toastr.error('Unable to search.');
		}
	};

	useEffect(() => {
		fetchPrenatalRecords();
		const key = SearchBus.listen<string>('submit', (keyword) => {
			if (keyword.length > 0) {
				search(keyword);
			} else {
				fetchPrenatalRecords();
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
					Add New Prenatal Patient
				</Link>
			) : null}
			<Table
				title='Prenatal Patients'
				head={() => (
					<tr>
						<th>ID</th>
						<th>Case Number</th>
						<th>Patient</th>
						<th>Attendee</th>
						<th>Status</th>
						<th>Remarks</th>
						<th>Last Updated</th>
						<th colSpan={3}>Actions</th>
					</tr>
				)}
				foot={() => <Pagination pagination={pagination} onChange={(url) => fetchPrenatalRecords(url)} />}>
				{records.map(({ id, case_number, updated_at, patient, attendee, status, remarks }, index) => (
					<tr key={index}>
						<td>{id}</td>
						<td>{dayjs(case_number!).format('MMMM DD, YYYY')}</td>
						<td>{patient?.name}</td>
						<td>{attendee?.name}</td>
						<td>
							<b>{status}</b>
						</td>
						<td>{lodash.truncate(remarks || '', { length: 10 })}</td>
						<td>{dayjs(updated_at!).format('MMMM DD, YYYY hh:mm A')}</td>
						<td>
							<Link to={url(`/${id}`)} className='btn btn-info btn-sm' title='View'>
								<i className='material-icons mr-1'>visibility</i>
								View
							</Link>
							{status !== 'Done' ? (
								<>
									<Link to={url(`/${id}/edit`)} className='btn btn-warning btn-sm' title='Edit'>
										<i className='material-icons mr-1'>create</i>
										Edit
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
