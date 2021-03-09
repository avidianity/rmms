import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router-dom';
import toastr from 'toastr';
import { handleError } from '../../../helpers';
import { Record } from '../../../Contracts/Record';
import { User } from '../../../Contracts/User';
import { Patient } from '../../../Contracts/Patient';

type Props = {};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useState('Add');
	const [id, setID] = useState<number>();
	const [doctors, setDoctors] = useState<User[]>([]);
	const [patients, setPatients] = useState<Patient[]>([]);
	const { register, handleSubmit, setValue } = useForm<Record>({
		defaultValues: {
			diagnosis: 'N/A',
		},
	});
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();

	const submit = async (data: Record) => {
		setProcessing(true);
		try {
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

	const fetchRequirements = async () => {
		try {
			await Promise.all([fetchDoctors(), fetchPatients()]);
		} catch (error) {
			console.log(error.toJSON());
			toastr.error('Unable to fetch doctor and patient list.');
		}
	};

	useEffect(() => {
		fetchRequirements();
		if (match.path.includes('edit')) {
			setMode('Edit');
			fetchRecord(match.params.id);
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='card'>
			<div className='card-header card-header primary'>
				{mode} Record
				<p className='card-category'>Complete the form below.</p>
			</div>
			<div className='card-body'>
				<form onSubmit={handleSubmit(submit)}>
					<div className='row'>
						<div className='col-12 col-md-6'>
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
						<div className='col-12 col-md-6'>
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
						<div className='col-12'>
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating required'>Diagnosis</label>
								<textarea ref={register} className='form-control' disabled={processing} name='diagnosis' />
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
