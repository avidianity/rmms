import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Medicine } from '../../../Contracts/Medicine';
import { Paginated } from '../../../Contracts/misc';
import { formatCurrency, handleError, makeDummyPagination } from '../../../helpers';
import Table from '../../Table';
import toastr from 'toastr';
import state from '../../../state';
import Pagination from '../../Pagination';
import { SearchBus } from '../../../events';
import { User } from '../../../Contracts/User';
import dayjs from 'dayjs';

type Props = {};

const List: FC<Props> = (props) => {
	const [medicines, setMedicines] = useState<Medicine[]>([]);
	const [pagination, setPagination] = useState<Paginated>(makeDummyPagination());
	const match = useRouteMatch();

	const url = (path: string) => `${match.path}${path}`;

	const fetchMedicines = async (url?: string) => {
		try {
			const page = state.get<number>('medicine-page') || 1;
			const { data } = await axios.get<Paginated<Medicine>>(url ? url : `/pharmacy/medicines?page=${page}`);
			setMedicines(data.data);
			setPagination(data);
			state.set('medicine-page', data.current_page);
		} catch (error) {
			handleError(error);
		}
	};

	// const deleteMedicine = async (id: any) => {
	// 	try {
	// 		await axios.delete(`/pharmacy/medicines/${id}`);
	// 		toastr.info('Medicine has been deleted.', 'Notice');
	// 		fetchMedicines();
	// 	} catch (error) {
	// 		handleError(error);
	// 	}
	// };

	const search = async (keyword: string) => {
		try {
			const { data } = await axios.get(`/search?model=Medicine&keyword=${encodeURIComponent(keyword)}&paginate=false`);
			setMedicines(data);
			setPagination(makeDummyPagination());
		} catch (error) {
			console.log(error.toJSON());
			toastr.error('Unable to search.');
		}
	};

	useEffect(() => {
		fetchMedicines();
		const key = SearchBus.listen<string>('submit', (keyword) => {
			if (keyword.length > 0) {
				search(keyword);
			} else {
				fetchMedicines();
			}
		});
		return () => {
			SearchBus.unlisten('submit', key);
		};
		// eslint-disable-next-line
	}, []);

	const user = state.get<User>('user');

	return (
		<>
			{!['Admin'].includes(user.role) ? (
				<Link to={url('/add')} className='btn btn-info btn-sm'>
					Add New Medicine
				</Link>
			) : null}
			<Table
				title='Medicines'
				head={() => (
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Description</th>
						<th>Unit of Issue</th>
						<th>Estimated Unit Cost</th>
						<th>Estimated Cost</th>
						<th>Quantity</th>
						<th>Released</th>
						<th>Available</th>
						<th>Date Delivered</th>
						<th>Expiry Date</th>
						<th>Estimated Cost</th>
						<th>Critical Value</th>
						<th>Actions</th>
					</tr>
				)}
				foot={() => <Pagination pagination={pagination} onChange={(url) => fetchMedicines(url)} />}>
				{medicines.map(
					(
						{
							id,
							name,
							description,
							unit_of_issue,
							estimated_unit_cost,
							quantity,
							released,
							available,
							date_delivered,
							expiry_date,
							critical_value,
						},
						index
					) => (
						<tr key={index}>
							<td>{id}</td>
							<td>{name}</td>
							<td>{description}</td>
							<td>{unit_of_issue}</td>
							<td>{formatCurrency(estimated_unit_cost.parseNumbers())}</td>
							<td>{formatCurrency(quantity * estimated_unit_cost.parseNumbers())}</td>
							<td>{quantity}</td>
							<td>{released}</td>
							<td>{available}</td>
							<td>{dayjs(date_delivered).format('MMMM DD, YYYY')}</td>
							<td>{dayjs(expiry_date).format('MMMM DD, YYYY')}</td>
							<td>{formatCurrency(quantity * estimated_unit_cost.parseNumbers())}</td>
							<td>{critical_value}</td>
							<td>
								<Link to={url(`/${id}/edit`)} className='btn btn-warning btn-sm' title='Edit'>
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
										deleteMedicine(id);
									}
								}}>
								<i className='material-icons mr-1'>remove_circle</i>
								Delete
							</a> */}
							</td>
						</tr>
					)
				)}
			</Table>
		</>
	);
};

export default List;
