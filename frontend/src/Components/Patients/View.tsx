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
					<div className='card-title'>Civil Status: {patient?.civil_status || 'N/A'}</div>
					<div className='card-title'>Membership NH: {patient?.membership_nh || 'N/A'}</div>
					<div className='card-title'>Membership NN: {patient?.membership_nn || 'N/A'}</div>
					<div className='card-title'>Philhealth Number: {patient?.philhealth_number || 'N/A'}</div>
					<div className='card-title'>Contact Number: {patient?.contact_number || 'N/A'}</div>
					<div className='card-title'>PHIC: {patient?.phic || 'N/A'}</div>
					<div className='card-title'>4Ps: {patient?.['4ps'] || 'N/A'}</div>
					<div className='card-title'>Blood Type: {patient?.blood_type || 'N/A'}</div>
					<div className='card-title'>Religion: {patient?.religion || 'N/A'}</div>
					<div className='container-fluid'>
						<Table
							title='Records'
							subtitles={patient?.records && patient.records.length === 0 ? 'No Records Available' : undefined}
							head={() => (
								<tr>
									<th>ID</th>
									<th>Case Number</th>
									<th>Physician</th>
									<th>Diagnosis</th>
									<th className='text-center'>Actions</th>
								</tr>
							)}>
							{patient?.records?.map((record, index) => (
								<tr key={index}>
									<td>{record.id}</td>
									<td>{dayjs(record.case_number).format('MMMM DD, YYYY')}</td>
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
										<th>Nurse/Midwife in Charge</th>
										<th>Remarks</th>
										<th>Actions</th>
									</tr>
								)}>
								{patient?.prenatals?.map((record, index) => (
									<tr key={index}>
										<td>{record.id}</td>
										<td>{dayjs(record.case_number).format('MMMM DD, YYYY')}</td>
										<td>{record.attendee?.name}</td>
										<td>{record.remarks}</td>
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
						<p className='card-text'>Diagnosis: {record.diagnosis}</p>
						<p className='card-text'>Physician: {record.doctor?.name}</p>
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
				) : null}
			</Modal>
			<Modal ref={prenatalRef} title='View Prenatal Record'>
				{prenatal ? (
					<div className='container-fluid'>
						<p className='card-text'>Case Number: {dayjs(prenatal.case_number).format('MMMM DD, YYYY')}</p>
						<p className='card-text'>Nurse/Midwife: {prenatal.attendee?.name}</p>
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
				) : null}
			</Modal>
		</div>
	);
};

export default View;
