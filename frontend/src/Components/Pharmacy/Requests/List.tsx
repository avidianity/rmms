import axios from 'axios';
import React, { createRef, FC, useEffect, useState } from 'react';
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
import Modal from '../../Modal';
import Flatpickr from 'react-flatpickr';
import $ from 'jquery';

type Props = {};

const List: FC<Props> = (props) => {
	const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
	const [pagination, setPagination] = useState<Paginated>(makeDummyPagination());
	const match = useRouteMatch();
	const [id, setID] = useState(-1);
	const [delivered, setDelivered] = useState(new Date());
	const [delivering, setDelivering] = useState(false);
	const modalRef = createRef<HTMLDivElement>();

	const url = (path: string) => `${match.path}${path}`;

	const fetchPurchaseRequests = async (url?: string) => {
		try {
			const page = state.get<number>('purchase-request-page') || 1;
			const { data } = await axios.get<Paginated<PurchaseRequest>>(url ? url : `/pharmacy/purchase-requests?page=${page}`);
			setPurchaseRequests(data.data);
			setPagination(data);
			state.set('purchase-request-page', data.current_page);
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

	const markAsDelivered = async (id: any) => {
		if (id > 1) {
			setDelivering(true);
			try {
				await axios.put(`/pharmacy/purchase-requests/${id}`, {
					delivered: delivered.toJSON(),
				});
				toastr.success('Purchase Request set as delivered.', 'Success!');
				fetchPurchaseRequests();
			} catch (error) {
				handleError(error);
			} finally {
				setDelivering(false);
				setID(-1);
			}
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
						<td>{delivered ? dayjs(delivered).format('MMMM DD, YYYY') : 'Pending'}</td>
						<td>{dayjs(created_at!).format('MMMM DD, YYYY')}</td>
						<td>
							<Link to={url(`/${id}`)} className='btn btn-info btn-sm' title='View'>
								<i className='material-icons mr-1'>visibility</i>
								View
							</Link>
							{delivered === null ? (
								<button
									className='btn btn-success btn-sm'
									title='Mark as Delivered'
									onClick={(e) => {
										e.preventDefault();
										if (modalRef.current) {
											setID(id || -1);
											$(modalRef.current).modal('show');
										}
									}}>
									<i className='material-icons mr-1'>task_alt</i>
									Mark as Delivered
								</button>
							) : null}
							{delivered === null ? (
								<Link to={url(`/${id}/edit`)} className='btn btn-warning btn-sm' title='Edit'>
									<i className='material-icons mr-1'>create</i>
									Edit
								</Link>
							) : (
								<button
									className='btn btn-warning btn-sm'
									title='Edit'
									disabled
									onClick={(e) => {
										e.preventDefault();
										toastr.error('Request already delivered.', 'Forbidden');
									}}>
									<i className='material-icons mr-1'>local_shipping</i>
									Delivered
								</button>
							)}
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
			<Modal
				ref={modalRef}
				title='Mark Request as Delivered'
				buttons={
					<button
						className='btn btn-success btn-sm'
						disabled={delivering}
						onClick={(e) => {
							e.preventDefault();
							markAsDelivered(id);
							if (modalRef.current) {
								$(modalRef.current).modal('hide');
							}
						}}>
						{delivering ? <i className='material-icons spin'>refresh</i> : 'Submit'}
					</button>
				}>
				<div className='form-group bmd-form-group is-filled'>
					<label className='bmd-label-floating'>Date and Time</label>
					<Flatpickr
						className='form-control'
						data-enable-time
						value={delivered}
						onChange={(dates) => {
							setDelivered(dates[0]);
						}}
						disabled={delivering}
					/>
				</div>
			</Modal>
		</>
	);
};

export default List;
