import axios from 'axios';
import React, { FC, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router-dom';
import toastr from 'toastr';
import { handleError } from '../../../helpers';
import { Record } from '../../../Contracts/Record';
import { User } from '../../../Contracts/User';
import { Patient } from '../../../Contracts/Patient';
import { Prescription } from '../../../Contracts/Prescription';
import { Medicine } from '../../../Contracts/Medicine';
import { STATUSES } from '../../../contants';
import state from '../../../state';
import { SearchContext } from '../../../contexts';

type Props = {};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useState('Add');
	const [id, setID] = useState<number>();
	const [doctors, setDoctors] = useState<User[]>([]);
	const [patients, setPatients] = useState<Patient[]>([]);
	const [prescriptions, setPrescriptions] = useState<Partial<Prescription>[]>([]);
	const [medicines, setMedicines] = useState<Medicine[]>([]);
	const user = state.get<User>('user');
	const { register, handleSubmit, setValue } = useForm<Record>({
		defaultValues: {
			diagnosis: 'N/A',
			doctor_id: user.role === 'Doctor' ? user.id! : -1,
			status: STATUSES.RegularRecord[0],
		},
	});
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();
	const [patient, setPatient] = useState<Patient | string>('');

	const submit = async (data: any) => {
		setProcessing(true);
		try {
			data.prescriptions = prescriptions;
			if (typeof patient !== 'string') {
				data.patient_id = patient.id;
			}
			await (mode === 'Add' ? axios.post(`/regular-records`, data) : axios.put(`/regular-records/${id}`, data));
			toastr.success('Record saved successfully.');
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	const fetchRecord = async (id: any) => {
		try {
			const { data } = await axios.get<Record>(`/regular-records/${id}`);
			setValue('diagnosis', data.diagnosis);
			setValue('doctor_id', data.doctor_id);
			setValue('patient_id', data.patient_id);
			setValue('status', data.status);
			setValue('chief_complaint', data.chief_complaint);
			setPrescriptions(data.prescriptions!);
			setPatient(data.patient!);
			setID(data.id);
			$('.form-group').addClass('is-filled');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const fetchDoctors = async () => {
		const { data } = await axios.get('/users?role=Doctor&paginate=false');
		setDoctors(data);
	};

	const fetchPatients = async () => {
		const { data } = await axios.get('/patients?paginate=false');
		setPatients(data);
	};

	const fetchMedicines = async () => {
		const { data } = await axios.get<Medicine[]>(`/pharmacy/medicines?paginate=false`);
		setMedicines(data.filter((medicine) => medicine.available > 0));
	};

	const fetchRequirements = async () => {
		try {
			await Promise.all([fetchDoctors(), fetchPatients(), fetchMedicines()]);
			if (match.path.includes('edit')) {
				setMode('Edit');
				await fetchRecord(match.params.id);
			}
		} catch (error) {
			console.log(error.toJSON());
			toastr.error('Unable to fetch doctor, patient and medicine list.');
		}
	};

	const { setShow: setShowSearch } = useContext(SearchContext);

	useEffect(() => {
		setShowSearch(false);
		fetchRequirements();
		return () => {
			setShowSearch(true);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<div className='card'>
			<div className='card-header card-header primary'>
				{mode} Regular Patient
				<p className='card-category'>Complete the form below.</p>
			</div>
			<div className='card-body'>
				<form onSubmit={handleSubmit(submit)}>
					<div className='row'>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating required'>Patient</label>
								<input
									className='form-control'
									disabled={processing}
									list='patientList'
									onChange={(e) => {
										const patient = patients.find((patient) => patient.id === e.target.value.parseNumbers());
										if (patient) {
											setPatient(patient);
										} else {
											setPatient(e.target.value);
										}
									}}
									value={typeof patient === 'string' ? patient : patient.name}
								/>
								<datalist id='patientList'>
									{patients.map((patient, index) => (
										<option key={index} value={patient.id}>
											{patient.name}
										</option>
									))}
								</datalist>
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating required'>Doctor</label>
								<select ref={register} className='form-control' disabled={processing} name='doctor_id'>
									{doctors.map((doctor, index) => (
										<option key={index} value={doctor.id}>
											{doctor.name}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Chief Complaint</label>
								<input
									ref={register}
									type='text'
									name='chief_complaint'
									id='chief_complaint'
									disabled={processing}
									className='form-control'
								/>
							</div>
						</div>
						{user.role === 'Doctor' ? (
							<>
								<div className='col-12 col-md-6 d-none'>
									<div className='form-group bmd-form-group is-filled'>
										<label className='bmd-label-floating required'>Status</label>
										<select ref={register} className='form-control' disabled={processing} name='status'>
											{STATUSES.RegularRecord.map((status, index) => (
												<option key={index} value={status}>
													{status}
												</option>
											))}
										</select>
									</div>
								</div>
								<div className='col-12'>
									<div className='form-group bmd-form-group is-filled'>
										<label className='bmd-label-floating required'>Diagnosis</label>
										<textarea ref={register} className='form-control' disabled={processing} name='diagnosis' />
									</div>
								</div>
								<div className='col-12'>
									<div className='container-fluid'>
										<div className='card'>
											<div className='card-header'>
												<h5 className='card-title'>Prescriptions</h5>
												<button
													className='btn btn-info btn-sm'
													disabled={medicines.length === 0}
													onClick={(e) => {
														e.preventDefault();
														if (medicines.length > 0) {
															prescriptions.push({
																items: [
																	{
																		medicine_id: medicines[0].id as number,
																		quantity: 1,
																	} as any,
																],
																released_at: null,
															});
															setPrescriptions([...prescriptions]);
														} else {
															toastr.error('There are no available medicines in stock.');
														}
													}}>
													{medicines.length === 0 ? 'No Medicine in Stock' : 'Add Prescription'}
												</button>
											</div>
											<div className='card-body'>
												<div className='container-fluid'>
													{prescriptions.map((prescription, prescriptionIndex) => (
														<div className='card' key={prescriptionIndex}>
															<div className='card-header'>
																<h5 className='card-title'>{prescriptionIndex + 1}) Prescription Items</h5>
																<div className='d-flex'>
																	<button
																		className='btn btn-warning btn-sm'
																		disabled={prescription.released_at !== null}
																		onClick={(e) => {
																			e.preventDefault();
																			if (prescription.released_at === null) {
																				prescription.items?.push({
																					medicine_id: medicines[0].id as number,
																					quantity: 1,
																					prescription_id: prescription.id as number,
																				});
																				prescriptions.splice(prescriptionIndex, 1, prescription);
																				setPrescriptions([...prescriptions]);
																			}
																		}}>
																		{prescription.released_at === null
																			? 'Add Item'
																			: 'Prescription Released'}
																	</button>
																	<button
																		className='btn btn-danger btn-sm'
																		disabled={prescription.released_at !== null}
																		onClick={(e) => {
																			e.preventDefault();
																			if (prescription.released_at === null) {
																				prescriptions.splice(prescriptionIndex, 1);
																				setPrescriptions([...prescriptions]);
																			} else {
																				toastr.error('Prescription has already been released.');
																			}
																		}}>
																		{prescription.released_at === null
																			? 'Remove Prescription'
																			: 'Prescription Released'}
																	</button>
																</div>
															</div>
															<div className='card-body'>
																<div className='row'>
																	<div className='col-12'>
																		{prescription.items?.map((item, itemIndex) => (
																			<div className='row' key={itemIndex}>
																				<div className='col-12 col-md-4'>
																					<div className='form-group bmd-form-group is-filled'>
																						<label className='bmd-label-floating required'>
																							Medicine
																						</label>
																						<select
																							className='form-control'
																							disabled={processing}
																							name='medicine_id'
																							onChange={(e) => {
																								item.medicine_id = Number(e.target.value);
																								prescription.items?.splice(
																									itemIndex,
																									1,
																									item
																								);
																								setPrescriptions([...prescriptions]);
																							}}
																							value={item.medicine_id}>
																							{medicines
																								.filter(
																									(medicine) => medicine.available > 0
																								)
																								.map((medicine, index) => (
																									<option key={index} value={medicine.id}>
																										{medicine.description}
																									</option>
																								))}
																						</select>
																					</div>
																				</div>
																				<div className='col-12 col-md-4'>
																					<div className='form-group bmd-form-group is-filled'>
																						<label className='bmd-label-floating required'>
																							Quantity
																						</label>
																						<input
																							type='number'
																							className='form-control'
																							disabled={processing}
																							name='quantity'
																							placeholder='Quantity'
																							max={
																								medicines.find(
																									(medicine) =>
																										medicine.id === item.medicine_id
																								)?.available || undefined
																							}
																							onChange={(e) => {
																								item.quantity = Number(e.target.value);
																								prescription.items?.splice(
																									itemIndex,
																									1,
																									item
																								);
																								setPrescriptions([...prescriptions]);
																							}}
																							value={item.quantity}
																						/>
																					</div>
																				</div>
																				<div className='col-12 col-md-4 pt-1'>
																					<button
																						className='btn btn-danger btn-sm'
																						disabled={prescription.released_at !== null}
																						onClick={(e) => {
																							e.preventDefault();
																							if (prescription.released_at === null) {
																								prescription.items?.splice(itemIndex, 1);
																								setPrescriptions([...prescriptions]);
																							}
																						}}>
																						Remove Item
																					</button>
																				</div>
																			</div>
																		))}
																	</div>
																</div>
															</div>
														</div>
													))}
												</div>
											</div>
										</div>
									</div>
								</div>
							</>
						) : null}
						<div className='col-12'>
							<button type='submit' className='btn btn-info btn-sm' disabled={processing}>
								{processing ? <i className='material-icons spin'>refresh</i> : 'Save'}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Form;
