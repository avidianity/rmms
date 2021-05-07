import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import toastr from 'toastr';
import { Paginated } from '../../Contracts/misc';
import { InventoryRelease } from '../../Contracts/InventoryRelease';
import { SearchBus } from '../../events';
import { makeDummyPagination, handleError } from '../../helpers';
import state from '../../state';
import Pagination from '../Pagination';
import Table from '../Table';
import { User } from '../../Contracts/User';

type Props = {};

const List: FC<Props> = (props) => {
	const [inventoryReleases, setInventoryReleases] = useState<InventoryRelease[]>([]);
	const [pagination, setPagination] = useState<Paginated>(makeDummyPagination());
	const match = useRouteMatch();

	const url = (path: string) => `${match.path}${path}`;

	const user = state.get<User>('user');

	const fetchInventoryReleases = async (url?: string) => {
		try {
			const page = state.get<number>('inventory-releases-page') || 1;
			const { data } = await axios.get<Paginated<InventoryRelease>>(url ? url : `/inventory-releases?page=${page}`);
			setInventoryReleases(data.data);
			setPagination(data);
			state.set('inventory-releases-page', data.current_page);
		} catch (error) {
			handleError(error);
		}
	};

	const search = async (keyword: string) => {
		try {
			const { data } = await axios.get(`/search?model=InventoryRelease&keyword=${encodeURIComponent(keyword)}&paginate=false`);
			setInventoryReleases(data);
			setPagination(makeDummyPagination());
		} catch (error) {
			console.log(error.toJSON());
			toastr.error('Unable to search.');
		}
	};

	useEffect(() => {
		fetchInventoryReleases();
		const key = SearchBus.listen<string>('submit', (keyword) => {
			if (keyword.length > 0) {
				search(keyword);
			} else {
				fetchInventoryReleases();
			}
		});
		return () => {
			SearchBus.unlisten('submit', key);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<>
			{['Pharmacist'].includes(user.role) ? (
				<Link to={url('/add')} className='btn btn-info btn-sm'>
					Add New Supply Release
				</Link>
			) : null}
			<Table
				title='Supply Release'
				head={() => (
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Quantity</th>
						<th>Date</th>
						<th>Supply Name</th>
						<th className='text-center'>Actions</th>
					</tr>
				)}
				foot={() => <Pagination pagination={pagination} onChange={(url) => fetchInventoryReleases(url)} />}>
				{inventoryReleases.map((inventoryRelease, index) => (
					<tr key={index}>
						<td>{inventoryRelease.id}</td>
						<td>{inventoryRelease.name}</td>
						<td>{inventoryRelease.quantity}</td>
						<td>{dayjs(inventoryRelease.date).format('MMMM DD, YYYY')}</td>
						<td>{inventoryRelease.inventory?.description}</td>
						<td className='text-center'>
							{user.role !== 'Admin' ? (
								<Link to={url(`/${inventoryRelease.id}/edit`)} className='btn btn-warning btn-sm' title='Edit'>
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
