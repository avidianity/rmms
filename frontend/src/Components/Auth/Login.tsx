import React, { FC, useEffect, useState } from 'react';
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
import bg from '../../assets/center.jpg';
import dayjs from 'dayjs';

type Props = {};

const Login: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [attempts, setAttempts] = useState(0);
	const [color, setColor] = useState(state.get<string>('background-color') || 'dark');
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
		const authExpires = state.get('auth-expires');
		if (authExpires) {
			const date = dayjs(authExpires);
			if (dayjs(new Date()).isAfter(date)) {
				state.remove('auth-expires');
			} else {
				return toastr.info(`Authentication temporarily disabled. Please try again after a few minutes.`);
			}
		}
		try {
			const {
				data: { user, token },
			} = await axios.post<{ user: User; token: string }>('/auth/login', payload);
			state.set('user', user);
			state.set('token', token);
			toastr.success(`Welcome back, ${user.name}!`);
			history.push(routes.DASHBOARD);
		} catch (error) {
			setAttempts(attempts + 1);
			if (attempts >= 3 || attempts + 1 >= 3) {
				state.set('auth-expires', dayjs(new Date()).add(2, 'minutes').toJSON());
				setTimeout(() => state.remove('auth-expires'), 1000 * 60 * 2);
			}
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	useEffect(() => {
		const key = state.listen<string>('background-color', (color) => setColor(color));
		return () => {
			state.unlisten('background-color', key);
		};
	}, []);

	if (state.has('user')) {
		history.push(routes.DASHBOARD);
		return null;
	}

	return (
		<div
			className='d-flex h-100vh align-items-center justify-content-center wrapper'
			data-mode={color}
			style={{
				backgroundImage: `url(${bg})`,
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
			}}>
			<div className={`card ${styles.card}`}>
				<div className='card-header text-center'>
					<img src='/assets/img/manifest-icon-512.png' alt='' className={`rounded-circle shadow border ${styles.icon} my-2`} />
					<h4 className='card-title mt-1'>Records Monitoring and Management System</h4>
					<h5 className='card-title'>MCHG</h5>
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
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
