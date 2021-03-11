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

	return (
		<>
			<Link to={url('/add')} className='btn btn-info btn-sm'>
				Add New Medicine
			</Link>
			<Table
				title='Medicines'
				head={() => (
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Unit of Issue</th>
						<th>Estimated Unit Cost</th>
						<th>Stocks</th>
						<th colSpan={2}>Actions</th>
					</tr>
				)}
				foot={() => <Pagination pagination={pagination} onChange={(url) => fetchMedicines(url)} />}>
				{medicines.map(({ id, name, unit_of_issue, cost, stocks }, index) => (
					<tr key={index}>
						<td>{id}</td>
						<td>{name}</td>
						<td>{unit_of_issue}</td>
						<td>{formatCurrency(cost)}</td>
						<td>{stocks}</td>
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
				))}
			</Table>
		</>
	);
};

export default List;
