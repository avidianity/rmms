import axios from 'axios';
import React, { FC, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router-dom';
import toastr from 'toastr';
import { handleError } from '../../../helpers';
import { PrenatalRecord } from '../../../Contracts/PrenatalRecord';
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
	const [attendees, setAttendees] = useState<User[]>([]);
	const [patients, setPatients] = useState<Patient[]>([]);
	const [prescriptions, setPrescriptions] = useState<Partial<Prescription>[]>([]);
	const [medicines, setMedicines] = useState<Medicine[]>([]);
	const user = state.get<User>('user');
	const { register, handleSubmit, setValue } = useForm<PrenatalRecord>({
		defaultValues: {
			remarks: 'N/A',
			attendee_id: ['Nurse', 'Midwife'].includes(user.role) ? user.id! : -1,
		},
	});
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();

	const submit = async (data: any) => {
		setProcessing(true);
		try {
			data.prescriptions = prescriptions;
			if (!data.status || data.status.length === 0) {
				data.status = STATUSES.PrenatalRecord[0];
			}
			await (mode === 'Add' ? axios.post(`/prenatal-records`, data) : axios.put(`/prenatal-records/${id}`, data));
			toastr.success('Prenatal Patient saved successfully.');
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	const fetchPrenatalRecord = async (id: any) => {
		try {
			const { data } = await axios.get<PrenatalRecord>(`/prenatal-records/${id}`);
			setValue('case_number', data.case_number);
			setValue('lmp', data.lmp);
			setValue('edc', data.edc);
			setValue('aog', data.aog);
			setValue('bp', data.bp);
			setValue('wt', data.wt);
			setValue('ht', data.ht);
			setValue('fht', data.fht);
			setValue('fh', data.fh);
			setValue('toxoid', data.toxoid);
			setValue('lab_requests', data.lab_requests);
			setValue('feso4', data.feso4);
			setValue('remarks', data.remarks);
			setValue('screened_syphilis', data.screened_syphilis);
			setValue('screened_hepatitis', data.screened_hepatitis);
			setValue('screened_hiv', data.screened_hiv);
			setValue('screened_gestational_diabetes', data.screened_gestational_diabetes);
			setValue('diagnosed_anemia', data.diagnosed_anemia);
			setValue('cbc_hgb_hct', data.cbc_hgb_hct);
			setValue('deworming_dose', data.deworming_dose);
			setValue('phic', data.phic);
			setValue('attendee_id', data.attendee_id);
			setValue('patient_id', data.patient_id);
			setValue('bmi', data.bmi);
			setValue('delivery_status', data.delivery_status);
			setValue('delivery_outcome', data.delivery_outcome);
			setValue('husband', data.husband);
			setPrescriptions(data.prescriptions!);
			setID(data.id);
			$('.form-group').addClass('is-filled');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const fetchAttendees = async () => {
		const { data } = await axios.get('/users?roles[]=Nurse&roles[]=Midwife&paginate=false');
		setAttendees(data);
	};

	const fetchPatients = async () => {
		const { data } = await axios.get<Patient[]>('/patients?paginate=false&sex=Female');
		setPatients(data.filter((patient) => patient.age >= 12));
	};

	const fetchMedicines = async () => {
		const { data } = await axios.get<Medicine[]>(`/pharmacy/medicines?paginate=false`);
		setMedicines(data.filter((medicine) => medicine.available > 0));
	};

	const fetchRequirements = async () => {
		try {
			await Promise.all([fetchAttendees(), fetchPatients(), fetchMedicines()]);
		} catch (error) {
			console.log(error.toJSON());
			toastr.error('Unable to fetch doctor and patient list.');
		}
	};

	const { setShow: setShowSearch } = useContext(SearchContext);

	useEffect(() => {
		fetchRequirements();
		setShowSearch(false);
		if (match.path.includes('edit')) {
			setMode('Edit');
			fetchPrenatalRecord(match.params.id);
		}
		return () => {
			setShowSearch(true);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<div className='card'>
			<div className='card-header card-header primary'>
				Consultation
				<p className='card-category'>Complete the form below. Leave blank if not applicable.</p>
				<p className='card-category'>
					Fields with <span style={{ color: 'rgb(190, 0, 0)' }}>*</span> are required.
				</p>
			</div>
			<div className='card-body'>
				<form onSubmit={handleSubmit(submit)}>
					<div className='row'>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating required'>Patient</label>
								<select ref={register} className='form-control' disabled={processing} name='patient_id'>
									{patients.map((patient, index) => (
										<option key={index} value={patient.id}>
											{patient.name}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating required'>Attendee</label>
								<select ref={register} className='form-control' disabled={processing} name='attendee_id'>
									{attendees.map((attendee, index) => (
										<option key={index} value={attendee.id}>
											{attendee.name} - {attendee.role}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating'>Husband</label>
								<input
									ref={register}
									type='text'
									name='husband'
									id='husband'
									disabled={processing}
									className='form-control'
								/>
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Last Menstrual Period</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='lmp' />
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Expected Date of Confinement</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='edc' />
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Age of Gestation</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='aog' />
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>BP</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='bp' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Weight</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='wt' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Height</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='ht' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>FHT</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='fht' />
							</div>
						</div>
						<div className='col-12 col-md-6'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Fundal Height</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='fh' />
							</div>
						</div>
						<div className='col-12 col-md-6'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Toxoid</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='toxoid' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Laboratory Requests</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='lab_requests' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>FeSO4</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='feso4' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Given one dose of Deworming</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='deworming_dose' />
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Screened for Syphilis</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='screened_syphilis' />
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Screened for Hepatitis</label>
								<input
									ref={register}
									type='text'
									className='form-control'
									disabled={processing}
									name='screened_hepatitis'
								/>
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Screened for HIV</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='screened_hiv' />
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Screened Gestational Diabetes</label>
								<input
									ref={register}
									type='text'
									className='form-control'
									disabled={processing}
									name='screened_gestational_diabetes'
								/>
							</div>
						</div>
						<div className='col-12 col-md-6'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Diagnosed Anemia</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='diagnosed_anemia' />
							</div>
						</div>
						<div className='col-12 col-md-6'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Tested for CBC HGB HCT</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='cbc_hgb_hct' />
							</div>
						</div>
						<div className='col-12 col-md-6'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>PHIC</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='phic' />
							</div>
						</div>
						<div className='col-12 col-md-6'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Body Mass Index</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='bmi' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating required'>Delivery Status</label>
								<select ref={register} className='form-control' disabled={processing} name='delivery_status'>
									<option value='Alive'>Alive</option>
									<option value='Deceased'>Deceased</option>
								</select>
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating required'>Delivery Outcome</label>
								<select ref={register} className='form-control' disabled={processing} name='delivery_outcome'>
									<option value='Male'>Male</option>
									<option value='Female'>Female</option>
								</select>
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating required'>Remarks/Advice</label>
								<textarea ref={register} className='form-control' disabled={processing} name='remarks' rows={3} />
							</div>
						</div>
						{user.role === 'Doctor' ? (
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
																	medicine_id: medicines[0].id!,
																	quantity: 1,
																} as any,
															],
															released_at: null,
															doctor_id: user.id!,
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
																		prescription.items?.push({
																			medicine_id: medicines[0].id as number,
																			quantity: 1,
																			prescription_id: prescription.id as number,
																		});
																		prescriptions.splice(prescriptionIndex, 1, prescription);
																		setPrescriptions([...prescriptions]);
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
																						disabled={
																							processing || prescription.released_at !== null
																						}
																						name='medicine_id'
																						onChange={(e) => {
																							item.medicine_id = Number(e.target.value);
																							prescription.items?.splice(itemIndex, 1, item);
																							setPrescriptions([...prescriptions]);
																						}}
																						value={item.medicine_id}>
																						{medicines.map((medicine, index) => (
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
																						disabled={
																							processing || prescription.released_at !== null
																						}
																						name='quantity'
																						placeholder='Quantity'
																						max={
																							medicines.find(
																								(medicine) =>
																									medicine.id === item.medicine_id
																							)?.available || undefined
																						}
																						onChange={(e) => {
																							const value = Number(e.target.value);
																							if (value > 0) {
																								item.quantity = value;
																								prescription.items?.splice(
																									itemIndex,
																									1,
																									item
																								);
																								setPrescriptions([...prescriptions]);
																							}
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
