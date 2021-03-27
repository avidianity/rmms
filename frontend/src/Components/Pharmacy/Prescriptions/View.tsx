import axios from 'axios';
import dayjs from 'dayjs';
import React, { createRef, FC, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import toastr from 'toastr';
import { RecordableMap } from '../../../contants';
import { Prescription } from '../../../Contracts/Prescription';
import { Record } from '../../../Contracts/Record';
import { formatCurrency, handleError } from '../../../helpers';
import Modal from '../../Modal';
import Table from '../../Table';
import Flatpickr from 'react-flatpickr';

type Props = {};

const View: FC<Props> = (props) => {
	const [prescription, setPrescription] = useState<Prescription | null>(null);
	const { id } = useParams<{ id: string }>();
	const history = useHistory();
	const [released, setReleased] = useState(new Date());
	const [releasing, setReleasing] = useState(false);
	const modalRef = createRef<HTMLDivElement>();

	const fetchPrescription = async (id: any) => {
		try {
			const { data } = await axios.get(`/pharmacy/prescriptions/${id}`);
			setPrescription(data);
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const markAsDelivered = async () => {
		setReleasing(true);
		try {
			const { data } = await axios.put(`/pharmacy/prescriptions/${id}`, {
				released_at: released.toJSON(),
			});
			setPrescription(data);
			toastr.success('Prescription marked as Released.', 'Success!');
		} catch (error) {
			handleError(error);
		} finally {
			setReleasing(false);
		}
	};

	useEffect(() => {
		fetchPrescription(id);
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container-fluid'>
			<div className='card'>
				<div className='card-header card-header-success d-flex align-items-center'>
					<h4 className='card-title'>View Prescription</h4>
					<button
						className='btn btn-info btn-sm ml-auto'
						disabled={releasing || prescription?.released_at !== null}
						onClick={(e) => {
							e.preventDefault();
							if (modalRef.current && prescription?.released_at === null) {
								$(modalRef.current).modal('show');
							}
						}}>
						<i className='material-icons mr-1'>local_shipping</i>
						{prescription?.released_at === null ? 'Mark as Released' : 'Released'}
					</button>
				</div>
				<div className='card-body'>
					<p className='card-text'>Patient: {prescription?.recordable?.patient?.name}</p>
					<p className='card-text'>Doctor: {prescription?.doctor?.name}</p>
					<div className='container-fluid'>
						<div className='card'>
							<div className='card-header'>
								<h6 className='card-title'>Record Information</h6>
							</div>
							<div className='card-body'>
								<p className='card-text'>
									Type:{' '}
									{prescription?.recordable_type ? RecordableMap[prescription.recordable_type.split('\\')[2]] : null}
								</p>
								<p className='card-text'>
									Case Number:{' '}
									{prescription?.recordable ? dayjs(prescription.recordable.case_number).format('MMMM DD, YYYY') : null}
								</p>
								{prescription?.recordable_type && RecordableMap[prescription?.recordable_type] === 'Regular Record' ? (
									<p className='card-text'>Diagnosis: {(prescription?.recordable as Record).diagnosis}</p>
								) : null}
							</div>
						</div>
					</div>
					<div className='container-fluid'>
						<Table
							title='Items'
							head={() => (
								<tr>
									<th>ID</th>
									<th>Medicine</th>
									<th>Quantity</th>
									<th>Unit of Issue</th>
									<th>Cost</th>
									<th>Total</th>
								</tr>
							)}>
							{prescription?.items?.map((item, index) => (
								<tr key={index}>
									<td>{item.id}</td>
									<td>{item.medicine?.name}</td>
									<td>{item.quantity}</td>
									<td>{item.medicine?.unit_of_issue}</td>
									<td>{formatCurrency(item.medicine?.estimated_unit_cost.parseNumbers() || 0)}</td>
									<td>{formatCurrency((item.medicine?.estimated_unit_cost.parseNumbers() || 0) * item.quantity)}</td>
								</tr>
							))}
						</Table>
					</div>
				</div>
			</div>
			<Modal
				ref={modalRef}
				title='Mark Prescription as Released'
				buttons={
					<button
						className='btn btn-success btn-sm'
						disabled={releasing}
						onClick={(e) => {
							e.preventDefault();
							markAsDelivered();
							if (modalRef.current) {
								$(modalRef.current).modal('hide');
							}
						}}>
						{releasing ? <i className='material-icons spin'>refresh</i> : 'Submit'}
					</button>
				}>
				<div className='form-group bmd-form-group is-filled'>
					<label className='bmd-label-floating'>Date and Time</label>
					<Flatpickr
						className='form-control'
						data-enable-time
						value={released}
						onChange={(dates) => {
							setReleased(dates[0]);
						}}
						disabled={releasing}
					/>
				</div>
			</Modal>
		</div>
	);
};

export default View;
