import axios from 'axios';
import React, { createRef, FC, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router-dom';
import toastr from 'toastr';
import { Baby } from '../../Contracts/Baby';
import { User } from '../../Contracts/User';
import { handleError } from '../../helpers';
import Flatpickr from 'react-flatpickr';
import dayjs from 'dayjs';
import { BabyVaccination } from '../../Contracts/BabyVaccination';
import { SearchContext } from '../../contexts';

type Props = {};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useState('Add');
	const [id, setID] = useState<number>();
	const [attendees, setAttendees] = useState<User[]>([]);
	const [dateOfBirth, setDateOfBirth] = useState(new Date());
	const [completeInMonths, setCompleteInMonths] = useState(true);
	const [nameRegistrationDate, setNameRegistrationDate] = useState(new Date());
	const [vaccinations, setVaccinations] = useState<BabyVaccination[]>([]);
	const { register, handleSubmit, setValue } = useForm<Baby>({
		defaultValues: {
			sex: 'Male',
			complete_in_months: true,
		},
	});
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();
	const formRef = createRef<HTMLFormElement>();

	const submit = async (data: Baby) => {
		setProcessing(true);
		try {
			data.date_of_birth = dateOfBirth.toJSON();
			data.name_registration_date = nameRegistrationDate.toJSON();
			data.vaccinations = vaccinations;
			data.complete_in_months = completeInMonths;
			await (mode === 'Add' ? axios.post(`/babies`, data) : axios.put(`/babies/${id}`, data));
			toastr.success('Baby saved successfully.');
			formRef.current?.reset();
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	const fetchBaby = async (id: any) => {
		try {
			const { data } = await axios.get<Baby>(`/babies/${id}`);
			setValue('attendee_id', data.attendee_id);
			setValue('name', data.name);
			setValue('nickname', data.nickname);
			setValue('sex', data.sex);
			setValue('father', data.father);
			setValue('mother', data.mother);
			setValue('type_of_birth', data.type_of_birth);
			setValue('single_or_twin', data.single_or_twin);
			setValue('blood_type', data.blood_type);
			setValue('weight', data.weight);
			setValue('length_of_body', data.length_of_body);
			setValue('head_measurement', data.head_measurement);
			setValue('chest_measurement', data.chest_measurement);
			setValue('order_of_birth', data.order_of_birth);
			setValue('name_registration_location', data.name_registration_location);
			setValue('mishaps', data.mishaps);
			setNameRegistrationDate(dayjs(data.name_registration_date).toDate());
			setDateOfBirth(dayjs(data.date_of_birth).toDate());
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

	const { setShow: setShowSearch } = useContext(SearchContext);

	useEffect(() => {
		fetchAttendees();
		setShowSearch(false);
		if (match.path.includes('edit')) {
			setMode('Edit');
			fetchBaby(match.params.id);
		}
		return () => {
			setShowSearch(true);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<div className='card'>
			<div className='card-header card-header primary'>
				{mode} Supply
				<p className='card-category'>Complete the form below. Leave blank if not applicable.</p>
				<p className='card-category'>
					Fields with <span style={{ color: 'rgb(190, 0, 0)' }}>*</span> are required.
				</p>
			</div>
			<div className='card-body'>
				<form onSubmit={handleSubmit(submit)} ref={formRef}>
					<div className='row'>
						<div className='col-12'>
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
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Name</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='name' />
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Nickname</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='nickname' />
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Father</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='father' />
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Mother</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='mother' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Type of Birth</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='type_of_birth' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Date of Birth</label>
								<Flatpickr value={dateOfBirth} className='form-control' onChange={(dates) => setDateOfBirth(dates[0])} />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating required'>Complete in Months</label>
								<select
									ref={register}
									className='form-control'
									disabled={processing}
									value={completeInMonths ? 'Yes' : 'No'}
									onChange={(e) => {
										if (e.target.value === 'Yes') {
											setCompleteInMonths(true);
										} else {
											setCompleteInMonths(false);
										}
									}}>
									<option value='Yes'>Yes</option>
									<option value='No'>No</option>
								</select>
								<small className='form-text text-muted'>
									Whether the baby has reached 9 months while in mother's womb.
								</small>
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Single/Twin</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='single_or_twin' />
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
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating'>Sex</label>
								<select ref={register} className='form-control' disabled={processing} name='sex'>
									<option value='Male'>Male</option>
									<option value='Female'>Female</option>
								</select>
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Weight</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='weight' />
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Length of Body</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='length_of_body' />
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Round Head Measurement</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='head_measurement' />
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Round Chest Measurement</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='chest_measurement' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Order of Birth</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='order_of_birth' />
								<small className='form-text text-muted'>Ex: 1st, 2nd, 3rd, etc</small>
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Name Registration Date</label>
								<Flatpickr
									value={nameRegistrationDate}
									className='form-control'
									onChange={(dates) => setNameRegistrationDate(dates[0])}
								/>
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Name Registration Location</label>
								<input
									ref={register}
									type='text'
									className='form-control'
									disabled={processing}
									name='name_registration_location'
								/>
							</div>
						</div>
						<div className='col-12'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Mishaps</label>
								<textarea ref={register} className='form-control' disabled={processing} name='mishaps' />
							</div>
						</div>
						<div className='col-12'>
							<div className='row'>
								<div className='col-12'>
									<button
										className='btn btn-success btn-sm'
										disabled={processing}
										onClick={(e) => {
											e.preventDefault();
											vaccinations.push({
												name: '',
												doses: '',
												date: new Date().toJSON(),
												remarks: '',
											});
											setVaccinations([...vaccinations]);
										}}>
										Add Vaccination
									</button>
								</div>
								{vaccinations.map((vaccination, index) => (
									<div className='col-12'>
										<div className='card'>
											<div className='card-header'>
												<h4 className='card-title'>Vaccination {index + 1}</h4>
											</div>
											<div className='card-body'>
												<div className='row'>
													<div className='col-12 pb-4'>
														<button
															className='btn btn-danger btn-sm'
															disabled={processing}
															onClick={(e) => {
																e.preventDefault();
																vaccinations.splice(index, 1);
																setVaccinations([...vaccinations]);
															}}>
															Remove
														</button>
													</div>
													<div className='form-group bmd-form-group col-12 col-md-6 col-lg-3'>
														<label className='bmd-label-floating required'>Vaccine Name</label>
														<input
															type='text'
															className='form-control'
															onChange={(e) => {
																vaccination.name = e.target.value;
																vaccinations.splice(index, 1, vaccination);
																setVaccinations([...vaccinations]);
															}}
															value={vaccination.name}
														/>
													</div>
													<div className='form-group bmd-form-group col-12 col-md-6 col-lg-3'>
														<label className='bmd-label-floating required'>Doses</label>
														<input
															type='text'
															className='form-control'
															onChange={(e) => {
																vaccination.doses = e.target.value;
																vaccinations.splice(index, 1, vaccination);
																setVaccinations([...vaccinations]);
															}}
															value={vaccination.doses}
														/>
													</div>
													<div className='form-group bmd-form-group col-12 col-md-6 col-lg-3 is-filled'>
														<label className='bmd-label-floating required'>Date</label>
														<Flatpickr
															value={dayjs(vaccination.date).toDate()}
															className='form-control'
															onChange={(data) => {
																vaccination.date = data[0].toJSON();
																vaccinations.splice(index, 1, vaccination);
																setVaccinations([...vaccinations]);
															}}
															disabled={processing}
														/>
													</div>
													<div className='form-group bmd-form-group col-12 col-md-6 col-lg-3'>
														<label className='bmd-label-floating required'>Remarks</label>
														<input
															type='text'
															className='form-control'
															onChange={(e) => {
																vaccination.remarks = e.target.value;
																vaccinations.splice(index, 1, vaccination);
																setVaccinations([...vaccinations]);
															}}
															value={vaccination.remarks}
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
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
