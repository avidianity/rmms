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
	const [inventories, setInventories] = useState<Inventory[]>([]);
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
	// 		await axios.delete(`/inventories/${id}`);
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
					Add New Medical Equipment
				</Link>
			) : null}
			<Table
				title='Medical Equipment'
				head={() => (
					<tr>
						<th>ID</th>
						<th>Description</th>
						<th>Number of Units</th>
						<th>Unit of Issue</th>
						<th>Estimated Unit Cost</th>
						<th>Quantity</th>
						<th>Date Delivered</th>
						<th>Expiry Date</th>
						<th>Critical Value</th>
						<th>Released</th>
						<th>Available</th>
						<th>Estimated Cost</th>
						<th>Actions</th>
					</tr>
				)}
				foot={() => <Pagination pagination={pagination} onChange={(url) => fetchInventories(url)} />}>
				{inventories.map((inventory, index) => (
					<tr key={index}>
						<td>{inventory.id}</td>
						<td>{inventory.description}</td>
						<td>{inventory.number_of_units}</td>
						<td>{inventory.unit_of_issue}</td>
						<td>{formatCurrency(inventory.estimated_unit_cost)}</td>
						<td>{inventory.quantity}</td>
						<td>{inventory.date_delivered ? dayjs(inventory.date_delivered).format('MMMM DD, YYYY') : 'N/A'}</td>
						<td>{dayjs(inventory.expiry_date).format('MMMM DD, YYYY')}</td>
						<td>{inventory.critical_value}</td>
						<td>{inventory.released}</td>
						<td>{inventory.available}</td>
						<td>{formatCurrency(inventory.estimated_cost)}</td>
						<td>
							<Link to={url(`/${inventory.id}/edit`)} className='btn btn-warning btn-sm' title='Edit'>
								<i className='material-icons mr-1'>create</i>
								Edit
							</Link>
							{/* <a
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
										deleteinventory(id);
									}
								}}>
								<i className='material-icons mr-1'>remove_circle</i>
								Delete
							</a> */}
						</td>
					</tr>
				))}
			</Table>
		</>
	);
};

export default List;
