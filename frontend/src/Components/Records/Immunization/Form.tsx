import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router-dom';
import toastr from 'toastr';
import { ImmunizationRecord } from '../../../Contracts/ImmunizationRecord';
import { handleError, outIf, sentencify } from '../../../helpers';
import Flatpickr from 'react-flatpickr';
import { STATUSES } from '../../../contants';
import state from '../../../state';
import { User } from '../../../Contracts/User';

type Props = {};

const sample = {
	at_birth: 'N/A',
	six_weeks: 'N/A',
	ten_weeks: 'N/A',
	fourteen_weeks: 'N/A',
	nine_months: 'N/A',
};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useState('Add');
	const [id, setID] = useState<number>();
	const [birthday, setBirthday] = useState(new Date());
	const { register, handleSubmit, setValue } = useForm<ImmunizationRecord>({
		defaultValues: {
			info: {
				bcg: sample,
				penta: sample,
				opv: sample,
				hepa_b: sample,
				measles: sample,
				mmr: sample,
				other: sample,
			},
		},
	});
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();

	const submit = async (data: ImmunizationRecord) => {
		setProcessing(true);
		try {
			data.birthday = birthday.toJSON();
			await (mode === 'Add' ? axios.post(`/immunization-records`, data) : axios.put(`/immunization-records/${id}`, data));
			toastr.success('Immunization Patient saved successfully.');
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	const fetchImmunizationRecord = async (id: any) => {
		try {
			const { data } = await axios.get<ImmunizationRecord>(`/immunization-records/${id}`);
			setValue('name', data.name);
			setBirthday(dayjs(data.birthday).toDate());
			setValue('outcome', data.outcome);
			setValue('address', data.address);
			setValue('weight', data.weight);
			setValue('nbs', data.nbs);
			setValue('mother', data.mother);
			setValue('father', data.father);
			setValue('tt_injection', data.tt_injection);
			setValue('time_of_del', data.time_of_del);
			setValue('type_of_del', data.type_of_del);
			setValue('place_of_del', data.place_of_del);
			setValue('gender', data.gender);

			STATUSES.Immunization.fields.forEach((field) => {
				STATUSES.Immunization.properties.forEach((property) => {
					setValue(`info[${field.key}][${property}]`, (data.info as any)[field.key][property]);
				});
			});
			setID(data.id);
			$('.form-group').addClass('is-filled');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const user = state.get<User>('user');

	useEffect(() => {
		if (match.path.includes('edit')) {
			setMode('Edit');
			fetchImmunizationRecord(match.params.id);
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='card'>
			<div className='card-header card-header'>
				{mode} Immunization Patient
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
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating required'>Birthday</label>
								<Flatpickr
									value={birthday}
									className='form-control'
									onChange={(data) => {
										setBirthday(data[0]);
									}}
									disabled={processing || mode === 'Edit'}
								/>
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Address</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='address' />
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating required'>Gender</label>
								<select ref={register} name='gender' className='form-control' disabled={processing}>
									<option value='Male'>Male</option>
									<option value='Female'>Female</option>
								</select>
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Outcome</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='outcome' />
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
								<label className='bmd-label-floating required'>NBS</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='nbs' />
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>TT Injection</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='tt_injection' />
							</div>
						</div>
						<div className='col-12 col-md-6'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Mother</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='mother' />
							</div>
						</div>
						<div className='col-12 col-md-6'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Father</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='father' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Time of Del.</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='time_of_del' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Type of Del.</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='type_of_del' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Place of Del.</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='place_of_del' />
							</div>
						</div>
						<div className={`col-12 ${outIf(user.role !== 'Doctor', 'd-none')}`}>
							<div className='card'>
								<div className='card-body table-responsive'>
									<table className='table'>
										<thead>
											<tr>
												<th></th>
												{STATUSES.Immunization.properties.map((property, index) => (
													<th className='text-center' key={index}>
														{sentencify(property)}
													</th>
												))}
											</tr>
										</thead>
										<tbody>
											{STATUSES.Immunization.fields.map((field, index) => (
												<tr key={index}>
													<td className='text-center'>{field.name}</td>
													{STATUSES.Immunization.properties.map((property, index) => (
														<td className='text-center' key={index}>
															<div className='form-group bmd-form-group text-left'>
																<input
																	ref={register}
																	type='text'
																	className='form-control'
																	disabled={processing || mode === 'Edit'}
																	name={`info[${field.key}][${property}]`}
																/>
															</div>
														</td>
													))}
												</tr>
											))}
										</tbody>
									</table>
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
