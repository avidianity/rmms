import axios from 'axios';
import dayjs from 'dayjs';
import React, { createRef, FC, useEffect, useState } from 'react';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { Patient } from '../../Contracts/Patient';
import { Record } from '../../Contracts/Record';
import { handleError } from '../../helpers';
import { routes } from '../../routes';
import Table from '../Table';
import swal from 'sweetalert';
import toastr from 'toastr';
import { PrenatalRecord } from '../../Contracts/PrenatalRecord';
import $ from 'jquery';
import Modal from '../Modal';
import lodash from 'lodash';

type Props = {};

const View: FC<Props> = (props) => {
	const [patient, setPatient] = useState<Patient | null>(null);
	const history = useHistory();
	const match = useRouteMatch<{ id: string }>();
	const [record, setRecord] = useState<Record | null>(null);
	const [prenatal, setPrenatal] = useState<PrenatalRecord | null>(null);
	const recordRef = createRef<HTMLDivElement>();
	const prenatalRef = createRef<HTMLDivElement>();

	const showRecordModal = (record: Record) => {
		setRecord(record);
		if (recordRef.current) {
			$(recordRef.current).modal('show');
		}
	};

	const showPrenatalRecordModal = (record: PrenatalRecord) => {
		setPrenatal(record);
		if (prenatalRef.current) {
			$(prenatalRef.current).modal('show');
		}
	};

	const fetchPatient = async (id: any) => {
		try {
			const { data } = await axios.get(`/patients/${id}`);
			setPatient(data);
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const deletePatient = async (id: any) => {
		try {
			await axios.delete(`/patients/${id}`);
			toastr.info('Patient has been deleted.', 'Notice');
			history.goBack();
		} catch (error) {
			handleError(error);
		}
	};

	useEffect(() => {
		fetchPatient(match.params.id);
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container-fluid'>
			<div className='card'>
				<div className='card-header card-header-success'>
					<h4 className='card-title'>View Patient</h4>
					<div className='d-flex'>
						{patient ? <p className='card-category align-self-center'>{patient.name}</p> : null}
						<Link to={`${routes.DASHBOARD}${routes.PATIENTS}/${patient?.id}/edit`} className='btn btn-warning btn-sm ml-auto'>
							<i className='material-icons mr-1'>create</i>
							Edit
						</Link>
						<a
							href={`${routes.DASHBOARD}${routes.PATIENTS}/${patient?.id}/delete`}
							className='btn btn-danger btn-sm ml-1'
							onClick={async (e) => {
								e.preventDefault();
								if (patient) {
									const confirm = await swal({
										title: `Delete ${patient.name}?`,
										icon: 'warning',
										buttons: ['Cancel', 'Confirm'],
										dangerMode: true,
									});
									if (confirm === true) {
										deletePatient(patient.id);
									}
								}
							}}>
							<i className='material-icons mr-1'>remove_circle</i>
							Delete
						</a>
					</div>
				</div>
				<div className='card-body'>
					<div className='card-title'>Age: {patient?.age}</div>
					<div className='card-title'>Sex: {patient?.sex}</div>
					<div className='card-title'>Birthday: {dayjs(patient?.birthday).format('MMMM DD, YYYY')}</div>
					<div className='card-title'>Address: {patient?.address}</div>
					<div className='card-title'>Civil Status: {patient?.civil_status || ''}</div>
					<div className='card-title'>Membership NH: {patient?.membership_nh || ''}</div>
					<div className='card-title'>Membership NN: {patient?.membership_nn || ''}</div>
					<div className='card-title'>Philhealth Number: {patient?.philhealth_number || ''}</div>
					<div className='card-title'>Contact Number: {patient?.contact_number || ''}</div>
					<div className='card-title'>4Ps: {patient?.['4ps'] || ''}</div>
					<div className='card-title'>Blood Type: {patient?.blood_type || ''}</div>
					<div className='container-fluid'>
						<Table
							title='Records'
							subtitles={patient?.records && patient.records.length === 0 ? 'No Records Available' : undefined}
							head={() => (
								<tr>
									<th>ID</th>
									<th>Case Number</th>
									<th>Status</th>
									<th>Physician</th>
									<th>Diagnosis</th>
									<th className='text-center'>Actions</th>
								</tr>
							)}>
							{patient?.records?.map((record, index) => (
								<tr key={index}>
									<td>{record.id}</td>
									<td>{dayjs(record.case_number).format('MMMM DD, YYYY')}</td>
									<td>
										<b>{record.status}</b>
									</td>
									<td>{record.doctor?.name}</td>
									<td>{lodash.truncate(record.diagnosis, { length: 20 })}</td>
									<td className='text-center'>
										<button
											className='btn btn-info btn-sm'
											onClick={(e) => {
												e.preventDefault();
												showRecordModal(record);
											}}>
											<i className='material-icons mr-1'>visibility</i>
											View
										</button>
									</td>
								</tr>
							))}
						</Table>
						{patient?.sex === 'Female' ? (
							<Table
								title='Prenatal Records'
								subtitles={
									patient?.prenatals && patient.prenatals.length === 0 ? 'No Prenatal Records Available' : undefined
								}
								head={() => (
									<tr>
										<th>ID</th>
										<th>Case Number</th>
										<th>Status</th>
										<th>Nurse/Midwife in Charge</th>
										<th>Remarks</th>
										<th>Actions</th>
									</tr>
								)}>
								{patient?.prenatals?.map((record, index) => (
									<tr key={index}>
										<td>{record.id}</td>
										<td>{dayjs(record.case_number).format('MMMM DD, YYYY')}</td>
										<td>
											<b>{record.status}</b>
										</td>
										<td>{record.attendee?.name}</td>
										<td>{lodash.truncate(record.remarks || '', { length: 10 })}</td>
										<td>
											<button
												className='btn btn-info btn-sm'
												onClick={(e) => {
													e.preventDefault();
													showPrenatalRecordModal(record);
												}}>
												<i className='material-icons mr-1'>visibility</i>
												View
											</button>
										</td>
									</tr>
								))}
							</Table>
						) : null}
					</div>
				</div>
			</div>
			<Modal ref={recordRef} title='View Record'>
				{record ? (
					<div className='container-fluid'>
						<p className='card-text'>Case Number: {dayjs(record.case_number).format('MMMM DD, YYYY')}</p>
						<p className='card-text'>Physician: {record.doctor?.name}</p>
						<p className='card-text'>Diagnosis: {record.diagnosis}</p>
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
							{record.prescriptions?.map((prescription, index) => (
								<tr key={index}>
									<td>{prescription.id}</td>
									<td>
										{prescription.released_at ? dayjs(prescription.released_at).format('MMMM DD, YYYY hh:mm A') : ''}
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
				) : null}
			</Modal>
			<Modal ref={prenatalRef} title='View Prenatal Record'>
				{prenatal ? (
					<div className='container-fluid'>
						<p className='card-text'>Case Number: {dayjs(prenatal.case_number).format('MMMM DD, YYYY')}</p>
						<p className='card-text'>
							{prenatal.attendee?.role}: {prenatal.attendee?.name}
						</p>
						<div className='container-fluid'>
							<div className='card'>
								<div className='card-header card-header-info d-flex align-items-center'>
									<h5 className='card-title'>Record Information</h5>
								</div>
								<div className='card-body'>
									<p className='card-title'>LMP: {prenatal.lmp || ''}</p>
									<p className='card-title'>EDC: {prenatal.edc || ''}</p>
									<p className='card-title'>Age of Gestation: {prenatal.aog || ''}</p>
									<p className='card-title'>Blood Pressure: {prenatal.bp || ''}</p>
									<p className='card-title'>Weight: {prenatal.wt || ''}</p>
									<p className='card-title'>Height: {prenatal.ht || ''}</p>
									<p className='card-title'>FHT: {prenatal.fht || ''}</p>
									<p className='card-title'>FH: {prenatal.fh || ''}</p>
									<p className='card-title'>Toxoid: {prenatal.toxoid || ''}</p>
									<p className='card-title'>Laboratory Requests: {prenatal.lab_requests || ''}</p>
									<p className='card-title'>FeSO4: {prenatal.feso4 || ''}</p>
									<p className='card-title'>Screened for Syphilis: {prenatal.screened_syphilis || ''}</p>
									<p className='card-title'>Screened for Hepatitis: {prenatal.screened_hepatitis || ''}</p>
									<p className='card-title'>Screened for HIV: {prenatal.screened_hiv || ''}</p>
									<p className='card-title'>
										Screened for Gestational Diabetes: {prenatal.screened_gestational_diabetes || ''}
									</p>
									<p className='card-title'>Diagnosed with Anemia: {prenatal.diagnosed_anemia || ''}</p>
									<p className='card-title'>CBC, HGB, HCT: {prenatal.cbc_hgb_hct || ''}</p>
									<p className='card-title'>Given one dose of Deworming: {prenatal.deworming_dose || ''}</p>
									<p className='card-title'>PHIC: {prenatal.phic || ''}</p>
									<p className='card-title'>BMI: {prenatal.bmi || ''}</p>
									<p className='card-title'>
										Status: <b>{prenatal.status || ''}</b>
									</p>
									<p className='card-title'>Remarks/Advice: {prenatal.remarks || ''}</p>
								</div>
							</div>
						</div>
						<Table
							title='Prescriptions'
							subtitles={
								prenatal.prescriptions && prenatal.prescriptions.length === 0 ? 'No Prescriptions Available' : undefined
							}
							head={() => (
								<tr>
									<th>ID</th>
									<th>Released</th>
									<th>Items</th>
								</tr>
							)}>
							{prenatal.prescriptions?.map((prescription, index) => (
								<tr key={index}>
									<td>{prescription.id}</td>
									<td>
										{prescription.released_at ? dayjs(prescription.released_at).format('MMMM DD, YYYY hh:mm A') : ''}
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
				) : null}
			</Modal>
		</div>
	);
};

export default View;
