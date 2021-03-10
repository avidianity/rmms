import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import swal from 'sweetalert';
import toastr from 'toastr';
import { Paginated } from '../../Contracts/misc';
import { User } from '../../Contracts/User';
import { makeDummyPagination, handleError } from '../../helpers';
import state from '../../state';
import Pagination from '../Pagination';
import Table from '../Table';

type Props = {};

const List: FC<Props> = (props) => {
	const [users, setUsers] = useState<User[]>([]);
	const [pagination, setPagination] = useState<Paginated>(makeDummyPagination());
	const match = useRouteMatch();

	const url = (path: string) => `${match.path}${path}`;

	const fetchUsers = async (url?: string) => {
		try {
			const page = state.get<number>('user-page') || 1;
			const { data } = await axios.get<Paginated<User>>(url ? url : `/users?page=${page}`);
			setUsers(data.data);
			setPagination(data);
			state.set('user-page', data.current_page);
		} catch (error) {
			handleError(error);
		}
	};

	const deleteUser = async (id: any) => {
		try {
			await axios.delete(`/users/${id}`);
			toastr.info('User has been deleted.', 'Notice');
			fetchUsers();
		} catch (error) {
			handleError(error);
		}
	};

	useEffect(() => {
		fetchUsers();
		// eslint-disable-next-line
	}, []);

	const user = state.get('user');

	return (
		<>
			<Link to={url('/add')} className='btn btn-info btn-sm'>
				Add New User
			</Link>
			<Table
				title='Users'
				head={() => (
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Email</th>
						<th>Role</th>
						<th>Created</th>
						<th colSpan={2} className='text-center'>
							Actions
						</th>
					</tr>
				)}
				foot={() => <Pagination pagination={pagination} onChange={(url) => fetchUsers(url)} />}>
				{users.map(({ id, name, email, role, created_at }, index) => (
					<tr key={index}>
						<td>{id}</td>
						<td>{name}</td>
						<td>{email}</td>
						<td>
							<span
								className={`badge badge-${
									{ Admin: 'danger', Doctor: 'primary', Nurse: 'success', Midwife: 'info', Pharmacist: 'warning' }[role]
								}`}>
								{role}
							</span>
						</td>
						<td>{dayjs(created_at!).format('MMMM DD, YYYY hh:mm A')}</td>
						<td className='text-center'>
							<Link to={url(`/${id}/edit`)} className='btn btn-warning btn-sm' title='Edit'>
								<i className='material-icons mr-1'>create</i>
								Edit
							</Link>
							{user.id !== id ? (
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
											deleteUser(id);
										}
									}}>
									<i className='material-icons mr-1'>remove_circle</i>
									Delete
								</a>
							) : null}
						</td>
					</tr>
				))}
			</Table>
		</>
	);
};

export default List;
