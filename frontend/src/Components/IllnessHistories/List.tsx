import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Paginated } from '../../Contracts/misc';
import { IllnessHistory } from '../../Contracts/IllnessHistory';
import { User } from '../../Contracts/User';
import { makeDummyPagination, handleError } from '../../helpers';
import state from '../../state';
import Pagination from '../Pagination';
import Table from '../Table';
import toastr from 'toastr';
import { SearchBus } from '../../events';

type Props = {};

const List: FC<Props> = (props) => {
	const [inventorys, setIllnessHistories] = useState<IllnessHistory[]>([]);
	const [pagination, setPagination] = useState<Paginated>(makeDummyPagination());
	const match = useRouteMatch();

	const user = state.get<User>('user');

	const url = (path: string) => `${match.path}${path}`;

	const fetchIllnessHistories = async (url?: string) => {
		try {
			const page = state.get<number>('inventory-page') || 1;
			const { data } = await axios.get<Paginated<IllnessHistory>>(url ? url : `/illness-histories?page=${page}`);
			setIllnessHistories(data.data);
			setPagination(data);
			state.set('inventory-page', data.current_page);
		} catch (error) {
			handleError(error);
		}
	};

	// const deleteIllnessHistory = async (id: any) => {
	// 	try {
	// 		await axios.delete(`/illness-histories/${id}`);
	// 		toastr.info('Illness History has been deleted.', 'Notice');
	// 		fetchIllnessHistories();
	// 	} catch (error) {
	// 		handleError(error);
	// 	}
	// };

	const search = async (keyword: string) => {
		try {
			const { data } = await axios.get(`/search?model=IllnessHistory&keyword=${encodeURIComponent(keyword)}&paginate=false`);
			setIllnessHistories(data);
			setPagination(makeDummyPagination());
		} catch (error) {
			console.log(error.toJSON());
			toastr.error('Unable to search.');
		}
	};

	useEffect(() => {
		fetchIllnessHistories();
		const key = SearchBus.listen<string>('submit', (keyword) => {
			if (keyword.length > 0) {
				search(keyword);
			} else {
				fetchIllnessHistories();
			}
		});
		return () => {
			SearchBus.unlisten('submit', key);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<>
			{['Admin', 'Nurse', 'Midwife'].includes(user.role) ? (
				<Link to={url('/add')} className='btn btn-info btn-sm'>
					Add New Illness History
				</Link>
			) : null}
			<Table
				title='IllnessHistories'
				head={() => (
					<tr>
						<th>ID</th>
						<th>Date</th>
						<th>Patient</th>
						<th>History of Present Illness</th>
						<th>Assessment/Impression</th>
						<th>Treatment/Management Plan</th>
						<th>Issued</th>
						<th colSpan={3}>Actions</th>
					</tr>
				)}
				foot={() => <Pagination pagination={pagination} onChange={(url) => fetchIllnessHistories(url)} />}>
				{inventorys.map(({ id, date, description, assessment, physical_exams, treatment, patient, created_at }, index) => (
					<tr key={index}>
						<td>{id}</td>
						<td>{dayjs(date).format('MMMM DD, YYYY')}</td>
						<td>{patient?.name}</td>
						<td>{description}</td>
						<td>{assessment}</td>
						<td>{treatment}</td>
						<td>{dayjs(created_at).format('MMMM DD, YYYY hh:mm A')}</td>
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
