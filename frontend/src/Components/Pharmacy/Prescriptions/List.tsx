import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import toastr from 'toastr';
import swal from 'sweetalert';
import { RecordableMap } from '../../../contants';
import { Paginated } from '../../../Contracts/misc';
import { Prescription } from '../../../Contracts/Prescription';
import { makeDummyPagination, handleError } from '../../../helpers';
import state from '../../../state';
import Pagination from '../../Pagination';
import Table from '../../Table';

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

	const deletePrescription = async (id: any) => {
		try {
			await axios.delete(`/pharmacy/prescriptions/${id}`);
			toastr.info('Prescription has been deleted.', 'Notice');
			fetchPrescriptions();
		} catch (error) {
			handleError(error);
		}
	};

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
				{prescriptions.map(({ id, released_at, recordable, recordable_type, doctor }, index) => (
					<tr key={index}>
						<td>{id}</td>
						<td>{recordable?.patient?.name}</td>
						<td>{doctor?.name}</td>
						<td>{RecordableMap[recordable_type]}</td>
						<td>{dayjs(recordable?.case_number!).format('MMMM DD, YYYY')}</td>
						<td>{dayjs(released_at!).format('MMMM DD, YYYY hh:mm A')}</td>
						<td>
							<Link to={url(`/${id}`)} className='btn btn-info btn-sm' title='View'>
								<i className='material-icons mr-1'>visibility</i>
								View
							</Link>
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
										title: `Delete this prescription?`,
										icon: 'warning',
										buttons: ['Cancel', 'Confirm'],
										dangerMode: true,
									});
									if (confirm === true) {
										deletePrescription(id);
									}
								}}>
								<i className='material-icons mr-1'>remove_circle</i>
								Delete
							</a>
						</td>
					</tr>
				))}
			</Table>
		</>
	);
};

export default List;
