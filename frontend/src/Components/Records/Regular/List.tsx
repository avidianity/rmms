import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import toastr from 'toastr';
import { Paginated } from '../../../Contracts/misc';
import { Record } from '../../../Contracts/Record';
import { makeDummyPagination, handleError } from '../../../helpers';
import state from '../../../state';
import Pagination from '../../Pagination';
import Table from '../../Table';
import swal from 'sweetalert';
import lodash from 'lodash';

type Props = {};

const List: FC<Props> = (props) => {
	const [records, setRecords] = useState<Record[]>([]);
	const [pagination, setPagination] = useState<Paginated>(makeDummyPagination());
	const match = useRouteMatch();

	const url = (path: string) => `${match.path}${path}`;

	const fetchRecords = async (url?: string) => {
		try {
			const page = state.get<number>('regular-recods-page') || 1;
			const { data } = await axios.get<Paginated<Record>>(url ? url : `/regular-records?page=${page}`);
			setRecords(data.data);
			setPagination(data);
			state.set('regular-recods-page', data.current_page);
		} catch (error) {
			handleError(error);
		}
	};

	const deleteRecord = async (id: any) => {
		try {
			await axios.delete(`/regular-records/${id}`);
			toastr.info('Record has been deleted.', 'Notice');
			fetchRecords();
		} catch (error) {
			handleError(error);
		}
	};

	useEffect(() => {
		fetchRecords();
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<Link to={url('/add')} className='btn btn-info btn-sm'>
				Add New Record
			</Link>
			<Table
				title='Records'
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
							{status !== 'Done' ? (
								<>
									<Link to={url(`/${id}/edit`)} className='btn btn-warning btn-sm' title='Edit'>
										<i className='material-icons mr-1'>create</i>
										Edit
									</Link>
									<a
										href={url(`/${id}/delete`)}
										className='btn btn-danger btn-sm'
										title='Delete'
										onClick={async (e) => {
											e.preventDefault();
											const confirm = await swal({
												title: `Delete this record?`,
												icon: 'warning',
												buttons: ['Cancel', 'Confirm'],
												dangerMode: true,
											});
											if (confirm === true) {
												deleteRecord(id);
											}
										}}>
										<i className='material-icons mr-1'>remove_circle</i>
										Delete
									</a>
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
