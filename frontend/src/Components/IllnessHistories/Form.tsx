import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router-dom';
import toastr from 'toastr';
import { IllnessHistory } from '../../Contracts/IllnessHistory';
import { handleError, outIf } from '../../helpers';
import Flatpickr from 'react-flatpickr';
import { Patient } from '../../Contracts/Patient';

type Props = {};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useState('Add');
	const [id, setID] = useState<number>();
	const [date, setDate] = useState(new Date());
	const [patients, setPatients] = useState<Patient[]>([]);
	const [patientID, setPatientID] = useState(-1);
	const [patientName, setPatientName] = useState('');
	const { register, handleSubmit, setValue } = useForm<IllnessHistory>();
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();

	const submit = async (data: IllnessHistory) => {
		setProcessing(true);
		try {
			data.date = date.toJSON();
			data.patient_id = patientID;
			await (mode === 'Add' ? axios.post(`/illness-histories`, data) : axios.put(`/illness-histories/${id}`, data));
			toastr.success('Illness History saved successfully.');
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	const fetchMedicine = async (id: any) => {
		try {
			const { data } = await axios.get<IllnessHistory>(`/illness-histories/${id}`);
			setDate(dayjs(data.date).toDate());
			setPatientID(data.patient_id);
			setPatientName(data.patient?.name || '');
			setValue('description', data.description);
			setValue('physical_exams[bp]', data.physical_exams.bp);
			setValue('physical_exams[wt]', data.physical_exams.wt);
			setValue('physical_exams[ht]', data.physical_exams.ht);
			setValue('physical_exams[spo2]', data.physical_exams.spo2);
			setValue('physical_exams[pr]', data.physical_exams.pr);
			setValue('physical_exams[tt]', data.physical_exams.tt);
			setValue('assessment', data.assessment);
			setValue('treatment', data.treatment);
			setID(data.id);
			$('.form-group').addClass('is-filled');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const fetchPatients = async () => {
		const { data } = await axios.get('/patients?paginate=false');
		setPatients(data);
	};

	const fetchRequirements = async () => {
		try {
			await Promise.all([fetchPatients()]);
		} catch (error) {
			console.log(error.toJSON());
			toastr.error('Unable to fetch patient list.');
		}
	};

	useEffect(() => {
		fetchRequirements();
		if (match.path.includes('edit')) {
			setMode('Edit');
			fetchMedicine(match.params.id);
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='card'>
			<div className='card-header card-header primary'>
				{mode} Illness History
				<p className='card-category'>Complete the form below. Leave blank if not applicable.</p>
				<p className='card-category'>
					Fields with <span style={{ color: 'rgb(190, 0, 0)' }}>*</span> are required.
				</p>
			</div>
			<div className='card-body'>
				<form onSubmit={handleSubmit(submit)}>
					<div className='row'>
						<div className='col-12'>
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating required'>Patient</label>
								<input
									className={`form-control ${outIf(mode === 'Edit', 'disabled')}`}
									disabled={processing || mode === 'Edit'}
									onChange={(e) => {
										const name = e.target.value;
										const patient = patients.find((patient) => patient.name === name);
										if (patient) {
											setPatientID(patient.id!);
											setPatientName(patient.name);
										} else {
											setPatientName(name);
										}
									}}
									value={patientName}
									list='patientList'
								/>
								<datalist id='patientList'>
									{patients.map((patient, index) => (
										<option key={index} value={patient.name}>
											{patient.name}
										</option>
									))}
								</datalist>
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating required'>Date</label>
								<Flatpickr
									value={date}
									className='form-control'
									onChange={(data) => {
										setDate(data[0]);
									}}
									disabled={processing}
								/>
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>History of Present Illness</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='description' />
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Assessment/Impression</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='assessment' />
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Treatment/Management Plan</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='treatment' />
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
									name='physical_exams[bp]'
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
									name='physical_exams[wt]'
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
									name='physical_exams[ht]'
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
									name='physical_exams[spo2]'
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
									name='physical_exams[pr]'
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
									name='physical_exams[tt]'
								/>
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
