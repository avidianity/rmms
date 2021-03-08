import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { routes } from '../../routes';
import styles from '../../Styles/auth.module.css';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { User } from '../../Contracts/User';
import toastr from 'toastr';
import state from '../../state';
import { handleError, outIf } from '../../helpers';

type Props = {};

const Register: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const { register, handleSubmit, errors } = useForm({
		resolver: yupResolver(
			yup.object().shape({
				name: yup.string().required('Name is required.'),
				email: yup.string().required('Email Address is required.').email(),
				password: yup.string().required('Password is required.').min(6),
				role: yup.string().oneOf(['Doctor', 'Admin', 'Nurse', 'Midwife'], 'Role is not valid.'),
			})
		),
	});
	const history = useHistory();

	const submit = async (payload: any) => {
		setProcessing(true);
		try {
			const {
				data: { user, token },
			} = await axios.post<{ user: User; token: string }>('/auth/register', payload);
			toastr.success(`Welcome back, ${user.name}!`);
			state.set('user', user);
			state.set('token', token);
			history.push(routes.DASHBOARD);
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	return (
		<div className='d-flex h-100vh align-items-center justify-content-center'>
			<div className={`card ${styles.card}`}>
				<div className='card-header text-center'>
					<img src='/assets/img/manifest-icon-512.png' alt='' className={`rounded-circle shadow border ${styles.icon}`} />
					<h2 className='card-title'>RMMS</h2>
				</div>
				<form onSubmit={handleSubmit(submit)}>
					<div className='card-body'>
						<div className='form-group'>
							<input
								ref={register}
								type='text'
								name='name'
								id='name'
								placeholder='Name'
								className={`form-control form-control-sm ${outIf(errors.name, 'is-invalid')}`}
								disabled={processing}
							/>
							{errors.name ? <div className='invalid-feedback'>{errors.name.message}</div> : null}
						</div>
						<div className='form-group'>
							<input
								ref={register}
								type='email'
								name='email'
								id='email'
								placeholder='Email Address'
								className={`form-control form-control-sm ${outIf(errors.password, 'is-invalid')}`}
								disabled={processing}
							/>
							{errors.email ? <div className='invalid-feedback'>{errors.email.message}</div> : null}
						</div>
						<div className='form-group'>
							<input
								ref={register}
								type='password'
								name='password'
								id='password'
								placeholder='Password'
								className={`form-control form-control-sm ${outIf(errors.password, 'is-invalid')}`}
								disabled={processing}
							/>
							{errors.password ? <div className='invalid-feedback'>{errors.password.message}</div> : null}
						</div>
						<div className='form-group '>
							<select
								ref={register}
								name='role'
								id='role'
								placeholder='Role'
								className={`form-control form-control-sm ${outIf(errors.role, 'is-invalid')}`}
								disabled={processing}>
								<option value='Admin'>Admin</option>
								<option value='Doctor'>Doctor</option>
								<option value='Nurse'>Nurse</option>
								<option value='Midwife'>Midwife</option>
							</select>
							{errors.role ? <div className='invalid-feedback'>{errors.role.message}</div> : null}
						</div>
						<div className='form-group '>
							<button type='submit' className='btn btn-info btn-sm w-100' disabled={processing}>
								{processing ? <i className='material-icons spin'>refresh</i> : 'Register'}
							</button>
						</div>
						<Link to={routes.LOGIN} className='btn btn-link btn-info'>
							Already have an account? Login
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Register;
