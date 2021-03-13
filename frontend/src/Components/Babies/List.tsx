import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Paginated } from '../../Contracts/misc';
import { Baby } from '../../Contracts/Baby';
import { User } from '../../Contracts/User';
import { makeDummyPagination, handleError } from '../../helpers';
import state from '../../state';
import Pagination from '../Pagination';
import Table from '../Table';
import toastr from 'toastr';
import { SearchBus } from '../../events';

type Props = {};

const List: FC<Props> = (props) => {
	const [babies, setBabies] = useState<Baby[]>([]);
	const [pagination, setPagination] = useState<Paginated>(makeDummyPagination());
	const match = useRouteMatch();

	const user = state.get<User>('user');

	const url = (path: string) => `${match.path}${path}`;

	const fetchBabies = async (url?: string) => {
		try {
			const page = state.get<number>('inventory-page') || 1;
			const { data } = await axios.get<Paginated<Baby>>(url ? url : `/babies?page=${page}`);
			setBabies(data.data);
			setPagination(data);
			state.set('inventory-page', data.current_page);
		} catch (error) {
			handleError(error);
		}
	};

	// const deleteBaby = async (id: any) => {
	// 	try {
	// 		await axios.delete(`/babies/${id}`);
	// 		toastr.info('Baby has been deleted.', 'Notice');
	// 		fetchBabies();
	// 	} catch (error) {
	// 		handleError(error);
	// 	}
	// };

	const search = async (keyword: string) => {
		try {
			const { data } = await axios.get(`/search?model=Baby&keyword=${encodeURIComponent(keyword)}&paginate=false`);
			setBabies(data);
			setPagination(makeDummyPagination());
		} catch (error) {
			console.log(error.toJSON());
			toastr.error('Unable to search.');
		}
	};

	useEffect(() => {
		fetchBabies();
		const key = SearchBus.listen<string>('submit', (keyword) => {
			if (keyword.length > 0) {
				search(keyword);
			} else {
				fetchBabies();
			}
		});
		return () => {
			SearchBus.unlisten('submit', key);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<>
			{['Nurse', 'Midwife'].includes(user.role) ? (
				<Link to={url('/add')} className='btn btn-info btn-sm'>
					Add New Baby
				</Link>
			) : null}
			<Table
				title='Babies'
				head={() => (
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Attendee</th>
						<th>Type of Birth</th>
						<th>Date of Birth</th>
						<th>Complete in Months</th>
						<th>Issued</th>
						<th>Last Updated</th>
						<th colSpan={3}>Actions</th>
					</tr>
				)}
				foot={() => <Pagination pagination={pagination} onChange={(url) => fetchBabies(url)} />}>
				{babies.map((baby, index) => (
					<tr key={index}>
						<td>{baby.id}</td>
						<td>{baby.name}</td>
						<td>{baby?.attendee?.name}</td>
						<td>{baby.type_of_birth}</td>
						<td>{dayjs(baby.date_of_birth).format('MMMM DD, YYYY')}</td>
						<td>
							{baby.complete_in_months ? (
								<span className='badge badge-success'>Yes</span>
							) : (
								<span className='badge badge-danger'>No</span>
							)}
						</td>
						<td>{dayjs(baby.created_at).format('MMMM DD, YYYY hh:mm A')}</td>
						<td>{dayjs(baby.updated_at).format('MMMM DD, YYYY hh:mm A')}</td>
						<td>
							<Link to={url(`/${baby.id}`)} className='btn btn-info btn-sm' title='View'>
								<i className='material-icons mr-1'>visibility</i>
								View
							</Link>
							{['Nurse', 'Midwife'].includes(user.role) ? (
								<Link to={url(`/${baby.id}/edit`)} className='btn btn-warning btn-sm' title='Edit'>
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
