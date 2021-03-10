import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { RecordableMap } from '../../../contants';
import { Prescription } from '../../../Contracts/Prescription';
import { Record } from '../../../Contracts/Record';
import { formatCurrency, handleError } from '../../../helpers';
import Table from '../../Table';

type Props = {};

const View: FC<Props> = (props) => {
	const [prescription, setPrescription] = useState<Prescription | null>(null);
	const { id } = useParams<{ id: string }>();
	const history = useHistory();

	const fetchPrescription = async (id: any) => {
		try {
			const { data } = await axios.get(`/prescriptions/${id}`);
			setPrescription(data);
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	useEffect(() => {
		fetchPrescription(id);
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container-fluid'>
			<div className='card'>
				<div className='card-header card-header-primary'>
					<h4 className='card-header'>View Prescription</h4>
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
									Type: {prescription?.recordable_type ? RecordableMap[prescription?.recordable_type] : null}
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
									<td>{formatCurrency(item.medicine?.cost || 0 * item.quantity)}</td>
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
