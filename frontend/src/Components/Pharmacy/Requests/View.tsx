import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { PurchaseRequest } from '../../../Contracts/PurchaseRequest';
import { formatCurrency, handleError } from '../../../helpers';
import { routes } from '../../../routes';
import swal from 'sweetalert';
import dayjs from 'dayjs';
import Table from '../../Table';
import toastr from 'toastr';

type Props = {};

const View: FC<Props> = (props) => {
	const [purchaseRequest, setPurchaseRequest] = useState<PurchaseRequest | null>(null);
	const history = useHistory();
	const match = useRouteMatch<{ id: string }>();

	const fetchPurchaseRequest = async (id: any) => {
		try {
			const { data } = await axios.get(`/pharmacy/purchase-requests/${id}`);
			setPurchaseRequest(data);
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const deletePurchaseRequest = async (id: any) => {
		try {
			await axios.delete(`/pharmacy/purchase-requests/${id}`);
			toastr.info('Purchase Request has been deleted.', 'Notice');
			history.goBack();
		} catch (error) {
			handleError(error);
		}
	};

	useEffect(() => {
		fetchPurchaseRequest(match.params.id);
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container-fluid'>
			<div className='card'>
				<div className='card-header card-header-success'>
					<h4 className='card-title'>View Purchase Request</h4>
					<div className='d-flex'>
						<Link
							to={`${routes.DASHBOARD}${routes.PURCHASE_REQUESTS}/${purchaseRequest?.id}/edit`}
							className='btn btn-warning btn-sm ml-auto'>
							<i className='material-icons mr-1'>create</i>
							Edit
						</Link>
						<a
							href={`${routes.DASHBOARD}${routes.PURCHASE_REQUESTS}/${purchaseRequest?.id}/delete`}
							className='btn btn-danger btn-sm ml-1'
							onClick={async (e) => {
								e.preventDefault();
								if (purchaseRequest) {
									const confirm = await swal({
										title: `Delete this purchase request?`,
										icon: 'warning',
										buttons: ['Cancel', 'Confirm'],
										dangerMode: true,
									});
									if (confirm === true) {
										deletePurchaseRequest(purchaseRequest.id);
									}
								}
							}}>
							<i className='material-icons mr-1'>remove_circle</i>
							Delete
						</a>
					</div>
				</div>
				<div className='card-body'>
					<p className='card-title'>PR Number: {purchaseRequest?.pr_number}</p>
					<p className='card-title'>SAI Number: {purchaseRequest?.sai_number}</p>
					<p className='card-title'>OBR Number: {purchaseRequest?.obr_number}</p>
					<p className='card-title'>
						Delivered: {purchaseRequest?.delivered ? dayjs(purchaseRequest.delivered).format('MMMM DD, YYYY') : 'Pending'}
					</p>
					<p className='card-title'>
						Issued: {purchaseRequest?.created_at ? dayjs(purchaseRequest.created_at).format('MMMM DD, YYYY hh:mm A') : null}
					</p>
					<div className='container-fluid'>
						<Table
							title='Items'
							head={() => (
								<tr>
									<th>ID</th>
									<th>Quantity</th>
									<th>Unit of Issue</th>
									<th>Medicine Description</th>
									<th>Cost per Unit</th>
									<th>Total</th>
								</tr>
							)}>
							{purchaseRequest?.items?.map((item, index) => (
								<tr key={index}>
									<td>{item.id}</td>
									<td>{item.quantity}</td>
									<td>{item.medicine?.unit_of_issue}</td>
									<td>{item.medicine?.name}</td>
									<td>{formatCurrency(item.medicine?.estimated_unit_cost.parseNumbers() || 0)}</td>
									<td>{formatCurrency(item.medicine?.estimated_unit_cost.parseNumbers() || 0 * item.quantity)}</td>
								</tr>
							))}
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default View;
