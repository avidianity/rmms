import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Paginated } from '../../Contracts/misc';
import { Patient } from '../../Contracts/Patient';
import { User } from '../../Contracts/User';
import { makeDummyPagination, handleError } from '../../helpers';
import state from '../../state';
import Pagination from '../Pagination';
import Table from '../Table';

type Props = {};

const List: FC<Props> = (props) => {
	const [patients, setPatients] = useState<Patient[]>([]);
	const [pagination, setPagination] = useState<Paginated>(makeDummyPagination());
	const match = useRouteMatch();

	const user = state.get<User>('user');

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

	// const deletePatient = async (id: any) => {
	// 	try {
	// 		await axios.delete(`/patients/${id}`);
	// 		toastr.info('Patient has been deleted.', 'Notice');
	// 		fetchPatients();
	// 	} catch (error) {
	// 		handleError(error);
	// 	}
	// };

	useEffect(() => {
		fetchPatients();
		// eslint-disable-next-line
	}, []);

	return (
		<>
			{['Nurse', 'Midwife'].includes(user.role) ? (
				<Link to={url('/add')} className='btn btn-info btn-sm'>
					Add New Patient
				</Link>
			) : null}
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
							<Link to={url(`/${id}`)} className='btn btn-info btn-sm' title='View'>
								<i className='material-icons mr-1'>visibility</i>
								View
							</Link>
							{['Nurse', 'Midwife', 'Admin'].includes(user.role) ? (
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
