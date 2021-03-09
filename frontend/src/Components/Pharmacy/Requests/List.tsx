import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { PurchaseRequest } from '../../../Contracts/PurchaseRequest';
import { Paginated } from '../../../Contracts/misc';
import { handleError, makeDummyPagination } from '../../../helpers';
import Table from '../../Table';
import swal from 'sweetalert';
import toastr from 'toastr';
import state from '../../../state';
import Pagination from '../../Pagination';
import dayjs from 'dayjs';

type Props = {};

const List: FC<Props> = (props) => {
	const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
	const [pagination, setPagination] = useState<Paginated>(makeDummyPagination());
	const match = useRouteMatch();

	const url = (path: string) => `${match.path}${path}`;

	const fetchPurchaseRequests = async (url?: string) => {
		try {
			const page = state.get<number>('purchaseRequest-page') || 1;
			const { data } = await axios.get<Paginated<PurchaseRequest>>(url ? url : `/pharmacy/purchase-requests?page=${page}`);
			setPurchaseRequests(data.data);
			setPagination(data);
			state.set('purchaseRequest-page', data.current_page);
		} catch (error) {
			handleError(error);
		}
	};

	const deletePurchaseRequest = async (id: any) => {
		try {
			await axios.delete(`/pharmacy/purchase-requests/${id}`);
			toastr.info('Purchase Request has been deleted.', 'Notice');
			fetchPurchaseRequests();
		} catch (error) {
			handleError(error);
		}
	};

	useEffect(() => {
		fetchPurchaseRequests();
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<Link to={url('/add')} className='btn btn-info btn-sm'>
				Add New Purchase Request
			</Link>
			<Table
				title='Purchase Requests'
				head={() => (
					<tr>
						<th>ID</th>
						<th>PR Number</th>
						<th>SAI Number</th>
						<th>OBR Number</th>
						<th>Delivered</th>
						<th>Issued</th>
						<th colSpan={3}>Actions</th>
					</tr>
				)}
				foot={() => <Pagination pagination={pagination} onChange={(url) => fetchPurchaseRequests(url)} />}>
				{purchaseRequests.map(({ id, pr_number, sai_number, obr_number, delivered, created_at }, index) => (
					<tr key={index}>
						<td>{id}</td>
						<td>{pr_number || 'N/A'}</td>
						<td>{sai_number || 'N/A'}</td>
						<td>{obr_number || 'N/A'}</td>
						<td>{delivered ? dayjs(delivered).format('MMMM DD, YYYY') : 'No'}</td>
						<td>{dayjs(created_at!).format('MMMM DD, YYYY')}</td>
						<td>
							<Link to={url(`/${id}/view`)} className='btn btn-info btn-sm' title='Edit'>
								<i className='material-icons mr-1'>visibility</i>
								View
							</Link>
							<Link to={url(`/${id}/edit`)} className='btn btn-warning btn-sm' title='Edit'>
								<i className='material-icons mr-1'>create</i>
								Edit
							</Link>
							<a
								href={url(`/${id}/delete`)}
								className='btn btn-danger btn-sm'
								title='Delete'
								onClick={async (e) => {
									e.preventDefault();
									const confirm = await swal({
										title: `Delete this Purchase Request?`,
										icon: 'warning',
										buttons: ['Cancel', 'Confirm'],
										dangerMode: true,
									});
									if (confirm === true) {
										deletePurchaseRequest(id);
									}
								}}>
								<i className='material-icons mr-1'>remove_circle</i>
								Delete
							</a>
						</td>
					</tr>
				))}
			</Table>
		</>
	);
};

export default List;
