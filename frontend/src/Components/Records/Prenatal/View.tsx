import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { PrenatalRecord } from '../../../Contracts/PrenatalRecord';
import { handleError } from '../../../helpers';
import Table from '../../Table';
import { routes } from '../../../routes';
import state from '../../../state';
import { User } from '../../../Contracts/User';

type Props = {};

const View: FC<Props> = (props) => {
	const [record, setPrenatalRecord] = useState<PrenatalRecord | null>(null);
	const history = useHistory();
	const params = useParams<{ id: string }>();

	const fetchPrenatalRecord = async (id: any) => {
		try {
			const { data } = await axios.get(`/prenatal-records/${id}`);
			setPrenatalRecord(data);
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	// const deletePrenatalRecord = async (id: any) => {
	// 	try {
	// 		await axios.delete(`/prenatal-records/${id}`);
	// 		toastr.info('Prenatal Record has been deleted.', 'Notice');
	// 		history.goBack();
	// 	} catch (error) {
	// 		handleError(error);
	// 	}
	// };

	useEffect(() => {
		fetchPrenatalRecord(params.id);
		// eslint-disable-next-line
	}, []);

	const patient = record?.patient;
	const user = state.get<User>('user');

	return (
		<div className='container-fluid'>
			<div className='card'>
				<div className='card-header card-header-success'>
					<h4 className='card-title'>View Prenatal Record</h4>
					<div className='d-flex'>
						<Link to={`${routes.DASHBOARD}${routes.PATIENTS}/${record?.patient_id}`} className='btn btn-info btn-sm ml-auto'>
							<i className='material-icons mr-1'>visibility</i>
							View Patient
						</Link>
						{record?.status !== 'Done' && !['Admin'].includes(user.role) ? (
							<>
								<Link
									to={`${routes.DASHBOARD}${routes.RECORDS.PRENATAL}/${record?.id}/edit`}
									className='btn btn-warning btn-sm ml-1'>
									<i className='material-icons mr-1'>create</i>
									Edit
								</Link>
							</>
						) : null}
					</div>
				</div>
				<div className='card-body'>
					<p className='card-title'>Patient: {patient?.name || ''}</p>
					<div className='card-title'>Age: {patient?.age || ''}</div>
					<div className='card-title'>Birthday: {patient ? dayjs(patient?.birthday).format('MMMM DD, YYYY') : ''}</div>
					<div className='card-title'>Address: {patient?.address || ''}</div>
					<div className='card-title'>Civil Status: {patient?.civil_status || ''}</div>
					<div className='card-title'>Membership NH/NN: {patient?.membership || ''}</div>
					<div className='card-title'>Philhealth Number: {patient?.philhealth_number || ''}</div>
					<div className='card-title'>Contact Number: {patient?.contact_number || ''}</div>
					<div className='card-title'>4Ps: {patient?.['4ps'] || ''}</div>
					<div className='card-title'>Blood Type: {patient?.blood_type || ''}</div>
					<p className='card-title'>
						{record?.attendee?.role}: {record?.attendee?.name || ''}
					</p>
					<p className='card-title'>
						Issued: {record?.created_at ? dayjs(record.created_at).format('MMMM DD, YYYY hh:mm A') : ''}
					</p>
					<div className='container-fluid'>
						<div className='card'>
							<div className='card-header card-header-info'>
								<h5 className='card-title'>Record Information</h5>
							</div>
							<div className='card-body'>
								<p className='card-title'>LMP: {record?.lmp || ''}</p>
								<p className='card-title'>EDC: {record?.edc || ''}</p>
								<p className='card-title'>Age of Gestation: {record?.aog || ''}</p>
								<p className='card-title'>Blood Pressure: {record?.bp || ''}</p>
								<p className='card-title'>Weight: {record?.wt || ''}</p>
								<p className='card-title'>Height: {record?.ht || ''}</p>
								<p className='card-title'>FHT: {record?.fht || ''}</p>
								<p className='card-title'>FH: {record?.fh || ''}</p>
								<p className='card-title'>Toxoid: {record?.toxoid || ''}</p>
								<p className='card-title'>Laboratory Requests: {record?.lab_requests || ''}</p>
								<p className='card-title'>FeSO4: {record?.feso4 || ''}</p>
								<p className='card-title'>Screened for Syphilis: {record?.screened_syphilis || ''}</p>
								<p className='card-title'>Screened for Hepatitis: {record?.screened_hepatitis || ''}</p>
								<p className='card-title'>Screened for HIV: {record?.screened_hiv || ''}</p>
								<p className='card-title'>
									Screened for Gestational Diabetes: {record?.screened_gestational_diabetes || ''}
								</p>
								<p className='card-title'>Diagnosed with Anemia: {record?.diagnosed_anemia || ''}</p>
								<p className='card-title'>CBC, HGB, HCT: {record?.cbc_hgb_hct || ''}</p>
								<p className='card-title'>Given one dose of Deworming: {record?.deworming_dose || ''}</p>
								<p className='card-title'>PHIC: {record?.phic || ''}</p>
								<p className='card-title'>BMI: {record?.bmi || ''}</p>
								<p className='card-title'>
									Status: <b>{record?.status || ''}</b>
								</p>
								<p className='card-title'>Delivery Status: {record?.delivery_status}</p>
								<p className='card-title'>Delivery Outcome: {record?.delivery_outcome}</p>
								<p className='card-title'>Remarks/Advice: {record?.remarks || ''}</p>
							</div>
						</div>
					</div>
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
										{prescription.released_at ? dayjs(prescription.released_at).format('MMMM DD, YYYY hh:mm A') : ''}
									</td>
									<td>
										<ul className='list-unstyled'>
											{prescription.items?.map((item, index) => (
												<li key={index}>
													{item.medicine?.description} ({item.quantity} {item.medicine?.unit_of_issue})
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
