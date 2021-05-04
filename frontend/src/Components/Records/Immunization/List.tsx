import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import toastr from 'toastr';
import { ImmunizationRecord } from '../../../Contracts/ImmunizationRecord';
import { Paginated } from '../../../Contracts/misc';
import { User } from '../../../Contracts/User';
import { SearchBus } from '../../../events';
import { makeDummyPagination, handleError } from '../../../helpers';
import state from '../../../state';
import Pagination from '../../Pagination';
import Table from '../../Table';

type Props = {};

const List: FC<Props> = (props) => {
	const [immunizationRecords, setimmunizationRecords] = useState<ImmunizationRecord[]>([]);
	const [pagination, setPagination] = useState<Paginated>(makeDummyPagination());
	const match = useRouteMatch();

	const user = state.get<User>('user');

	const url = (path: string) => `${match.path}${path}`;

	const fetchimmunizationRecords = async (url?: string) => {
		try {
			const page = state.get<number>('immunization-record-page') || 1;
			const { data } = await axios.get<Paginated<ImmunizationRecord>>(url ? url : `/immunization-records?page=${page}`);
			setimmunizationRecords(data.data);
			setPagination(data);
			state.set('immunization-record-page', data.current_page);
		} catch (error) {
			handleError(error);
		}
	};

	// const deleteImmunizationRecord = async (id: any) => {
	// 	try {
	// 		await axios.delete(`/immunizationRecords/${id}`);
	// 		toastr.info('ImmunizationRecord has been deleted.', 'Notice');
	// 		fetchimmunizationRecords();
	// 	} catch (error) {
	// 		handleError(error);
	// 	}
	// };

	const search = async (keyword: string) => {
		try {
			const { data } = await axios.get(`/search?model=ImmunizationRecord&keyword=${encodeURIComponent(keyword)}&paginate=false`);
			setimmunizationRecords(data);
			setPagination(makeDummyPagination());
		} catch (error) {
			console.log(error.toJSON());
			toastr.error('Unable to search.');
		}
	};

	useEffect(() => {
		fetchimmunizationRecords();
		const key = SearchBus.listen<string>('submit', (keyword) => {
			if (keyword.length > 0) {
				search(keyword);
			} else {
				fetchimmunizationRecords();
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
					Add New Immunization Patient
				</Link>
			) : null}
			<Table
				title='Immunization Patients'
				head={() => (
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Outcome</th>
						<th>Birthday</th>
						<th>Address</th>
						<th>Date Issued</th>
						<th colSpan={2}>Actions</th>
					</tr>
				)}
				foot={() => <Pagination pagination={pagination} onChange={(url) => fetchimmunizationRecords(url)} />}>
				{immunizationRecords.map(({ id, name, birthday, outcome, address, created_at }, index) => (
					<tr key={index}>
						<td>{id}</td>
						<td>{name}</td>
						<td>{outcome}</td>
						<td>{dayjs(birthday).format('MMMM DD, YYYY')}</td>
						<td>{address}</td>
						<td>{dayjs(created_at).format('MMMM DD, YYYY hh:mm A')}</td>
						<td>
							<Link to={url(`/${id}`)} className='btn btn-info btn-sm' title='View'>
								<i className='material-icons mr-1'>visibility</i>
								View
							</Link>
							{['Nurse', 'Midwife', 'Doctor'].includes(user.role) ? (
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
