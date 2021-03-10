import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router-dom';
import toastr from 'toastr';
import { User } from '../../Contracts/User';
import { handleError } from '../../helpers';

type Props = {};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useState('Add');
	const [id, setID] = useState<number>();
	const { register, handleSubmit, setValue } = useForm<User>();
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();

	const submit = async (data: User) => {
		setProcessing(true);
		try {
			await (mode === 'Add' ? axios.post(`/users`, data) : axios.put(`/users/${id}`, data));
			toastr.success('User saved successfully.');
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	const fetchUser = async (id: any) => {
		try {
			const { data } = await axios.get<User>(`/users/${id}`);
			setValue('name', data.name);
			setValue('email', data.email);
			setValue('role', data.role);
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
			fetchUser(match.params.id);
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='card'>
			<div className='card-header card-header primary'>
				{mode} User
				<p className='card-category'>Complete the form below.</p>
			</div>
			<div className='card-body'>
				<form onSubmit={handleSubmit(submit)}>
					<div className='row'>
						<div className='col-12 col-md-6'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Name</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='name' />
							</div>
						</div>
						<div className='col-12 col-md-6'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Email</label>
								<input ref={register} type='email' className='form-control' disabled={processing} name='email' />
							</div>
						</div>
						<div className='col-12 col-md-6'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Password</label>
								<input ref={register} type='password' className='form-control' disabled={processing} name='password' />
							</div>
						</div>
						<div className='col-12 col-md-6'>
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating required'>Role</label>
								<select ref={register} className='form-control' disabled={processing} name='role'>
									<option value='Admin'>Admin</option>
									<option value='Doctor'>Doctor</option>
									<option value='Nurse'>Nurse</option>
									<option value='Pharmacist'>Pharmacist</option>
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
