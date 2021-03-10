import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
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

const Login: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const { register, handleSubmit, errors } = useForm({
		resolver: yupResolver(
			yup.object().shape({
				email: yup.string().required('Email Address is required.').email(),
				password: yup.string().required('Password is required.'),
			})
		),
	});
	const history = useHistory();

	const submit = async (payload: any) => {
		setProcessing(true);
		try {
			const {
				data: { user, token },
			} = await axios.post<{ user: User; token: string }>('/auth/login', payload);
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

	if (state.has('user')) {
		history.push(routes.DASHBOARD);
		return null;
	}

	return (
		<div className='d-flex h-100vh align-items-center justify-content-center'>
			<div className={`card ${styles.card}`}>
				<div className='card-header text-center'>
					<img src='/assets/img/manifest-icon-512.png' alt='' className={`rounded-circle shadow border ${styles.icon}`} />
					<h2 className='card-title'>RMMS</h2>
					<p className='card-category'>Welcome back! Ready to be productive again? ⚡</p>
				</div>
				<form onSubmit={handleSubmit(submit)}>
					<div className='card-body'>
						<div className='form-group bmd-form-group'>
							<label className='bmd-label-floating'>Email Address</label>
							<input
								ref={register}
								type='email'
								name='email'
								id='email'
								className={`form-control ${outIf(errors.email, 'is-invalid')}`}
								disabled={processing}
							/>
							{errors.email ? <div className='invalid-feedback'>{errors.email.message}</div> : null}
						</div>
						<div className='form-group bmd-form-group'>
							<label className='bmd-label-floating'>Password</label>
							<input
								ref={register}
								type='password'
								name='password'
								id='password'
								className={`form-control ${outIf(errors.password, 'is-invalid')}`}
								disabled={processing}
							/>
							{errors.password ? <div className='invalid-feedback'>{errors.password.message}</div> : null}
						</div>
						<div className='form-group '>
							<button type='submit' className='btn btn-success btn-sm w-100' disabled={processing}>
								{processing ? <i className='material-icons spin'>refresh</i> : 'Login'}
							</button>
						</div>
						<div className='d-flex'>
							{/* <Link to={routes.REGISTER} className='btn btn-link btn-success p-0'>
								Don't have an account? Register
							</Link> */}
							<a href='/forgot-password' className='btn btn-link btn-success p-0 ml-auto'>
								Forgot password?
							</a>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
