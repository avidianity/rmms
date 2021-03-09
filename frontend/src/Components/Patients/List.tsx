import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import swal from 'sweetalert';
import toastr from 'toastr';
import { Paginated } from '../../Contracts/misc';
import { Patient } from '../../Contracts/Patient';
import { makeDummyPagination, handleError } from '../../helpers';
import state from '../../state';
import Pagination from '../Pagination';
import Table from '../Table';

type Props = {};

const List: FC<Props> = (props) => {
	const [patients, setPatients] = useState<Patient[]>([]);
	const [pagination, setPagination] = useState<Paginated>(makeDummyPagination());
	const match = useRouteMatch();

	const url = (path: string) => `${match.path}${path}`;

	const fetchPatients = async (url?: string) => {
		try {
			const page = state.get<number>('patient-page') || 1;
			const { data } = await axios.get<Paginated<Patient>>(url ? url : `/patients?page=${page}`);
			setPatients(data.data);
			setPagination(data);
			state.set('patient-page', data.current_page);
		} catch (error) {
			handleError(error);
		}
	};

	const deletePatient = async (id: any) => {
		try {
			await axios.delete(`/patients/${id}`);
			toastr.info('Patient has been deleted.', 'Notice');
			fetchPatients();
		} catch (error) {
			handleError(error);
		}
	};

	useEffect(() => {
		fetchPatients();
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<Link to={url('/add')} className='btn btn-info btn-sm'>
				Add New Patient
			</Link>
			<Table
				title='Patients'
				head={() => (
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Age</th>
						<th>Sex</th>
						<th>Address</th>
						<th>Birthday</th>
						<th colSpan={3}>Actions</th>
					</tr>
				)}
				foot={() => <Pagination pagination={pagination} onChange={(url) => fetchPatients(url)} />}>
				{patients.map(({ id, name, age, sex, address, birthday }, index) => (
					<tr key={index}>
						<td>{id}</td>
						<td>{name}</td>
						<td>{age}</td>
						<td>{sex}</td>
						<td>{address}</td>
						<td>{dayjs(birthday).format('MMMM DD, YYYY')}</td>
						<td>
							<Link to={url(`/${id}/view`)} className='btn btn-info btn-sm' title='Edit'>
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
										title: `Delete ${name}?`,
										icon: 'warning',
										buttons: ['Cancel', 'Confirm'],
										dangerMode: true,
									});
									if (confirm === true) {
										deletePatient(id);
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
