import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router-dom';
import toastr from 'toastr';
import { Patient } from '../../Contracts/Patient';
import { handleError } from '../../helpers';
import Flatpickr from 'react-flatpickr';
import dayjs from 'dayjs';

type Props = {};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useState('Add');
	const [id, setID] = useState<number>();
	const [birthday, setBirthday] = useState<Date | null>(null);
	const { register, handleSubmit, setValue } = useForm<Patient>();
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();

	const submit = async (data: Patient) => {
		setProcessing(true);
		try {
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
			setValue('membership_nh', data.membership_nh);
			setValue('membership_nn', data.membership_nn);
			setValue('philhealth_number', data.philhealth_number);
			setValue('contact_number', data.contact_number);
			setValue('4ps', data['4ps']);
			setValue('blood_type', data.blood_type);
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
									value={birthday?.toISOString() || ''}
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
								<label className='bmd-label-floating'>Membership NH</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='membership_nh' />
							</div>
						</div>
						<div className='col-12 col-md-6'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Membership NN</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='membership_nn' />
							</div>
						</div>
						<div className='col-12 col-md-6'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Philhealth Number</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='philhealth_number' />
							</div>
						</div>
						<div className='col-12 col-md-6'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>4Ps</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='4ps' />
							</div>
						</div>
						<div className='col-12 col-md-6'>
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
