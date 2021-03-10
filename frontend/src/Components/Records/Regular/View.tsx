import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import toastr from 'toastr';
import { Record } from '../../../Contracts/Record';
import { handleError } from '../../../helpers';
import Table from '../../Table';
import swal from 'sweetalert';
import { routes } from '../../../routes';

type Props = {};

const View: FC<Props> = (props) => {
	const [record, setRecord] = useState<Record | null>(null);
	const history = useHistory();
	const params = useParams<{ id: string }>();

	const fetchRecord = async (id: any) => {
		try {
			const { data } = await axios.get(`/regular-records/${id}`);
			setRecord(data);
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const deleteRecord = async (id: any) => {
		try {
			await axios.delete(`/regular-records/${id}`);
			toastr.info('Record has been deleted.', 'Notice');
			history.goBack();
		} catch (error) {
			handleError(error);
		}
	};

	useEffect(() => {
		fetchRecord(params.id);
		// eslint-disable-next-line
	}, []);

	const patient = record?.patient;

	return (
		<div className='container-fluid'>
			<div className='card'>
				<div className='card-header card-header-primary'>
					<h4 className='card-title'>View Regular Record</h4>
					<div className='d-flex'>
						<Link to={`${routes.DASHBOARD}${routes.PATIENTS}/${record?.patient_id}`} className='btn btn-info btn-sm ml-auto'>
							<i className='material-icons mr-1'>visibility</i>
							View Patient
						</Link>
						<Link
							to={`${routes.DASHBOARD}${routes.RECORDS.REGULAR}/${record?.id}/edit`}
							className='btn btn-warning btn-sm ml-1'>
							<i className='material-icons mr-1'>create</i>
							Edit
						</Link>
						<a
							href={`${routes.DASHBOARD}${routes.RECORDS.REGULAR}/${record?.id}/delete`}
							className='btn btn-danger btn-sm ml-1'
							onClick={async (e) => {
								e.preventDefault();
								if (record) {
									const confirm = await swal({
										title: `Delete this purchase request?`,
										icon: 'warning',
										buttons: ['Cancel', 'Confirm'],
										dangerMode: true,
									});
									if (confirm === true) {
										deleteRecord(record.id);
									}
								}
							}}>
							<i className='material-icons mr-1'>remove_circle</i>
							Delete
						</a>
					</div>
				</div>
				<div className='card-body'>
					<p className='card-title'>Patient: {patient?.name}</p>
					<div className='card-title'>Age: {patient?.age}</div>
					<div className='card-title'>Sex: {patient?.sex}</div>
					<div className='card-title'>Birthday: {dayjs(patient?.birthday).format('MMMM DD, YYYY')}</div>
					<div className='card-title'>Address: {patient?.address}</div>
					<div className='card-title'>Civil Status: {patient?.civil_status || 'N/A'}</div>
					<div className='card-title'>Membership NH: {patient?.membership_nh || 'N/A'}</div>
					<div className='card-title'>Membership NN: {patient?.membership_nn || 'N/A'}</div>
					<div className='card-title'>Philhealth Number: {patient?.philhealth_number || 'N/A'}</div>
					<div className='card-title'>Contact Number: {patient?.contact_number || 'N/A'}</div>
					<div className='card-title'>PHIC: {patient?.phic || 'N/A'}</div>
					<div className='card-title'>4Ps: {patient?.['4ps'] || 'N/A'}</div>
					<div className='card-title'>Blood Type: {patient?.blood_type || 'N/A'}</div>
					<div className='card-title'>Religion: {patient?.religion || 'N/A'}</div>
					<p className='card-title'>Attending Doctor: {record?.doctor?.name}</p>
					<p className='card-title'>
						Issued: {record?.created_at ? dayjs(record.created_at).format('MMMM DD, YYYY hh:mm A') : null}
					</p>
					<div className='container-fluid'>
						<Table
							title='Prescriptions'
							subtitles={
								record?.prescriptions && record.prescriptions.length === 0 ? 'No Prescriptions Available' : undefined
							}
							head={() => (
								<tr>
									<th>ID</th>
									<th>Released</th>
									<th>Items</th>
								</tr>
							)}>
							{record?.prescriptions?.map((prescription, index) => (
								<tr key={index}>
									<td>{prescription.id}</td>
									<td>
										{prescription.released_at ? dayjs(prescription.released_at).format('MMMM DD, YYYY hh:mm A') : 'N/A'}
									</td>
									<td>
										<ul>
											{prescription.items?.map((item, index) => (
												<li key={index}>
													{item.medicine?.name} ({item.quantity})
												</li>
											))}
										</ul>
									</td>
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
