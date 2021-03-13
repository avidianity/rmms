import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router-dom';
import toastr from 'toastr';
import { Patient } from '../../Contracts/Patient';
import { handleError } from '../../helpers';
import Flatpickr from 'react-flatpickr';
import dayjs from 'dayjs';
import { IllnessHistory } from '../../Contracts/IllnessHistory';

type Props = {};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useState('Add');
	const [id, setID] = useState<number>();
	const [birthday, setBirthday] = useState<Date | null>(null);
	const [histories, setHistories] = useState<IllnessHistory[]>([]);
	const { register, handleSubmit, setValue } = useForm<Patient & { histories: IllnessHistory[] }>();
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();

	const submit = async (data: Patient) => {
		setProcessing(true);
		try {
			data.histories = histories;
			data.birthday = dayjs(birthday as Date).format('YYYY-MM-DD');
			await (mode === 'Add' ? axios.post(`/patients`, data) : axios.put(`/patients/${id}`, data));
			toastr.success('Patient saved successfully.');
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	const fetchPatient = async (id: any) => {
		try {
			const { data } = await axios.get<Patient>(`/patients/${id}`);
			setValue('name', data.name);
			setValue('age', data.age);
			setValue('sex', data.sex);
			setBirthday(dayjs(data.birthday).toDate());
			setValue('address', data.address);
			setValue('civil_status', data.civil_status);
			setValue('membership', data.membership);
			setValue('philhealth_number', data.philhealth_number);
			setValue('contact_number', data.contact_number);
			setValue('4ps', data['4ps']);
			setValue('blood_type', data.blood_type);
			setValue('religion', data.religion);
			setHistories(data.histories!);
			setID(data.id);
			$('.form-group').addClass('is-filled');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	useEffect(() => {
		if (match.path.includes('edit')) {
			setMode('Edit');
			fetchPatient(match.params.id);
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='card'>
			<div className='card-header card-header primary'>
				{mode} Patient
				<p className='card-category'>Complete the form below. Leave blank if not applicable.</p>
				<p className='card-category'>
					Fields with <span style={{ color: 'rgb(190, 0, 0)' }}>*</span> are required.
				</p>
			</div>
			<div className='card-body'>
				<form onSubmit={handleSubmit(submit)}>
					<div className='row'>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Name</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='name' />
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Age</label>
								<input ref={register} type='number' className='form-control' disabled={processing} name='age' />
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating required'>Sex</label>
								<select ref={register} className='form-control' disabled={processing} name='sex'>
									<option value='Male'>Male</option>
									<option value='Female'>Female</option>
								</select>
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Address</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='address' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Birthday</label>
								<Flatpickr
									value={birthday || ''}
									className='form-control'
									onChange={(data) => {
										setBirthday(data[0]);
									}}
									disabled={processing}
								/>
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating'>Civil Status</label>
								<select ref={register} className='form-control' disabled={processing} name='civil_status'>
									<option value='Single'>Single</option>
									<option value='Married'>Married</option>
									<option value='Widowed'>Widowed</option>
								</select>
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Contact Number</label>
								<input ref={register} type='number' className='form-control' disabled={processing} name='contact_number' />
							</div>
						</div>
						<div className='col-12 col-md-6'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Membership NN/NH</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='membership' />
							</div>
						</div>
						<div className='col-12 col-md-6'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Philhealth Number</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='philhealth_number' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>4Ps</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='4ps' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating'>Blood Type</label>
								<select ref={register} className='form-control' disabled={processing} name='blood_type'>
									<option value='O-'>O-</option>
									<option value='O+'>O+</option>
									<option value='A-'>A-</option>
									<option value='A+'>A+</option>
									<option value='B-'>B-</option>
									<option value='B+'>B+</option>
									<option value='AB-'>AB-</option>
									<option value='AB+'>AB+</option>
								</select>
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Religion</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='religion' />
							</div>
						</div>
						<div className='col-12 d-none'>
							<div className='container-fluid'>
								<div className='card'>
									<div className='card-header card-header-success'>
										<h5 className='card-title'>Illness Histories</h5>
									</div>
									<div className='card-body'>
										<button
											className='btn btn-info btn-sm'
											onClick={(e) => {
												e.preventDefault();
												setHistories([
													...histories,
													{
														date: new Date().toJSON(),
														description: '',
														physical_exams: {
															bp: '',
															wt: '',
															ht: '',
															spo2: '',
															pr: '',
															tt: '',
														},
														assessment: '',
														treatment: '',
														patient_id: -1,
													},
												]);
											}}>
											Add History
										</button>
										{histories.map((history, index) => (
											<div className='card' key={index}>
												<div className='card-header d-flex align-items-center'>
													<h5 className='card-title'>History {index + 1}</h5>
													<button
														className='btn btn-danger btn-sm ml-auto'
														onClick={(e) => {
															e.preventDefault();
															histories.splice(index, 1);
															setHistories([...histories]);
														}}>
														Remove History
													</button>
												</div>
												<div className='card-body'>
													<div className='row'>
														<div className='col-12 col-md-3'>
															<div className='form-group bmd-form-group is-filled'>
																<label className='bmd-label-floating required'>Date</label>
																<Flatpickr
																	value={dayjs(history.date).toDate()}
																	className='form-control'
																	onChange={(data) => {
																		history.date = data[0].toJSON();
																		histories.splice(index, 1, history);
																		setHistories([...histories]);
																	}}
																	disabled={processing}
																/>
															</div>
														</div>
														<div className='col-12 col-md-3'>
															<div className='form-group bmd-form-group'>
																<label className='bmd-label-floating required'>
																	History of Present Illness
																</label>
																<input
																	ref={register}
																	type='text'
																	className='form-control'
																	disabled={processing}
																	name='description'
																	onChange={(e) => {
																		history.description = e.target.value;
																		histories.splice(index, 1, history);
																		setHistories([...histories]);
																	}}
																	value={history.description}
																/>
															</div>
														</div>
														<div className='col-12 col-md-3'>
															<div className='form-group bmd-form-group'>
																<label className='bmd-label-floating required'>Assessment/Impression</label>
																<input
																	ref={register}
																	type='text'
																	className='form-control'
																	disabled={processing}
																	name='assessment'
																	onChange={(e) => {
																		history.assessment = e.target.value;
																		histories.splice(index, 1, history);
																		setHistories([...histories]);
																	}}
																	value={history.assessment}
																/>
															</div>
														</div>
														<div className='col-12 col-md-3'>
															<div className='form-group bmd-form-group'>
																<label className='bmd-label-floating required'>
																	Treatment/Management Plan
																</label>
																<input
																	ref={register}
																	type='text'
																	className='form-control'
																	disabled={processing}
																	name='treatment'
																	onChange={(e) => {
																		history.treatment = e.target.value;
																		histories.splice(index, 1, history);
																		setHistories([...histories]);
																	}}
																	value={history.treatment}
																/>
															</div>
														</div>
														<div className='col-12'>
															<hr className='my-3' />
															<h3>Physical Exams</h3>
														</div>
														<div className='col-12 col-md-4'>
															<div className='form-group bmd-form-group'>
																<label className='bmd-label-floating required'>Blood Pressure</label>
																<input
																	ref={register}
																	type='text'
																	className='form-control'
																	disabled={processing}
																	onChange={(e) => {
																		history.physical_exams.bp = e.target.value;
																		histories.splice(index, 1, history);
																		setHistories([...histories]);
																	}}
																	value={history.physical_exams.bp}
																/>
															</div>
														</div>
														<div className='col-12 col-md-4'>
															<div className='form-group bmd-form-group'>
																<label className='bmd-label-floating required'>Weight</label>
																<input
																	ref={register}
																	type='text'
																	className='form-control'
																	disabled={processing}
																	onChange={(e) => {
																		history.physical_exams.wt = e.target.value;
																		histories.splice(index, 1, history);
																		setHistories([...histories]);
																	}}
																	value={history.physical_exams.wt}
																/>
															</div>
														</div>
														<div className='col-12 col-md-4'>
															<div className='form-group bmd-form-group'>
																<label className='bmd-label-floating required'>Height</label>
																<input
																	ref={register}
																	type='text'
																	className='form-control'
																	disabled={processing}
																	onChange={(e) => {
																		history.physical_exams.ht = e.target.value;
																		histories.splice(index, 1, history);
																		setHistories([...histories]);
																	}}
																	value={history.physical_exams.ht}
																/>
															</div>
														</div>
														<div className='col-12 col-md-4'>
															<div className='form-group bmd-form-group'>
																<label className='bmd-label-floating required'>SPO2</label>
																<input
																	ref={register}
																	type='text'
																	className='form-control'
																	disabled={processing}
																	onChange={(e) => {
																		history.physical_exams.spo2 = e.target.value;
																		histories.splice(index, 1, history);
																		setHistories([...histories]);
																	}}
																	value={history.physical_exams.spo2}
																/>
															</div>
														</div>
														<div className='col-12 col-md-4'>
															<div className='form-group bmd-form-group'>
																<label className='bmd-label-floating required'>PR</label>
																<input
																	ref={register}
																	type='text'
																	className='form-control'
																	disabled={processing}
																	onChange={(e) => {
																		history.physical_exams.pr = e.target.value;
																		histories.splice(index, 1, history);
																		setHistories([...histories]);
																	}}
																	value={history.physical_exams.pr}
																/>
															</div>
														</div>
														<div className='col-12 col-md-4'>
															<div className='form-group bmd-form-group'>
																<label className='bmd-label-floating required'>TT</label>
																<input
																	ref={register}
																	type='text'
																	className='form-control'
																	disabled={processing}
																	onChange={(e) => {
																		history.physical_exams.tt = e.target.value;
																		histories.splice(index, 1, history);
																		setHistories([...histories]);
																	}}
																	value={history.physical_exams.tt}
																/>
															</div>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
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
