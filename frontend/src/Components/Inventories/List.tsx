import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Paginated } from '../../Contracts/misc';
import { Inventory } from '../../Contracts/Inventory';
import { User } from '../../Contracts/User';
import { makeDummyPagination, handleError, formatCurrency } from '../../helpers';
import state from '../../state';
import Pagination from '../Pagination';
import Table from '../Table';
import toastr from 'toastr';
import { SearchBus } from '../../events';

type Props = {};

const List: FC<Props> = (props) => {
	const [inventorys, setInventories] = useState<Inventory[]>([]);
	const [pagination, setPagination] = useState<Paginated>(makeDummyPagination());
	const match = useRouteMatch();

	const user = state.get<User>('user');

	const url = (path: string) => `${match.path}${path}`;

	const fetchInventories = async (url?: string) => {
		try {
			const page = state.get<number>('inventory-page') || 1;
			const { data } = await axios.get<Paginated<Inventory>>(url ? url : `/inventories?page=${page}`);
			setInventories(data.data);
			setPagination(data);
			state.set('inventory-page', data.current_page);
		} catch (error) {
			handleError(error);
		}
	};

	// const deleteInventory = async (id: any) => {
	// 	try {
	// 		await axios.delete(`/inventorys/${id}`);
	// 		toastr.info('Inventory has been deleted.', 'Notice');
	// 		fetchInventories();
	// 	} catch (error) {
	// 		handleError(error);
	// 	}
	// };

	const search = async (keyword: string) => {
		try {
			const { data } = await axios.get(`/search?model=Inventory&keyword=${encodeURIComponent(keyword)}&paginate=false`);
			setInventories(data);
			setPagination(makeDummyPagination());
		} catch (error) {
			console.log(error.toJSON());
			toastr.error('Unable to search.');
		}
	};

	useEffect(() => {
		fetchInventories();
		const key = SearchBus.listen<string>('submit', (keyword) => {
			if (keyword.length > 0) {
				search(keyword);
			} else {
				fetchInventories();
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
					Add New Supply
				</Link>
			) : null}
			<Table
				title='Supplies'
				head={() => (
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Cost per Item</th>
						<th>Stocks</th>
						<th>Issued</th>
						<th>Last Updated</th>
						<th colSpan={3}>Actions</th>
					</tr>
				)}
				foot={() => <Pagination pagination={pagination} onChange={(url) => fetchInventories(url)} />}>
				{inventorys.map(({ id, name, cost, stocks, created_at, updated_at }, index) => (
					<tr key={index}>
						<td>{id}</td>
						<td>{name}</td>
						<td>{formatCurrency(cost)}</td>
						<td>{stocks}</td>
						<td>{dayjs(created_at).format('MMMM DD, YYYY hh:mm A')}</td>
						<td>{dayjs(updated_at).format('MMMM DD, YYYY hh:mm A')}</td>
						<td>
							{/* <Link to={url(`/${id}`)} className='btn btn-info btn-sm' title='View'>
								<i className='material-icons mr-1'>visibility</i>
								View
							</Link> */}
							{['Pharmacist', 'Admin'].includes(user.role) ? (
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
