import axios from 'axios';
import React, { createRef, FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import toastr from 'toastr';
import { User } from '../Contracts/User';
import { handleError } from '../helpers';
import state from '../state';

type Props = {};

const Profile: FC<Props> = (props) => {
	const user = state.get<User>('user');
	const [picture, setPicture] = useState<File | null>(null);
	const [displayPicture, setDisplayPicture] = useState(user?.picture?.url || '//via.placeholder.com/200');
	const [processing, setProcessing] = useState(false);
	const { register, handleSubmit } = useForm<User>({
		defaultValues: {
			...user,
		},
	});
	const formRef = createRef<HTMLFormElement>();
	const fileRef = createRef<HTMLInputElement>();
	const reader = new FileReader();

	reader.onload = (event) => {
		if (event.target && event.target.result) {
			setDisplayPicture(String(event.target.result));
		}
	};

	const submit = async (data: any) => {
		setProcessing(true);
		try {
			const payload = new FormData();
			Object.entries(data).forEach(([key, value]) => payload.append(key, value as any));
			if (picture) {
				payload.append('picture', picture);
			}
			const response = await axios.post<User>('/auth/self', payload);
			state.set('user', response.data);
			toastr.info('Profile updated.', 'Notice');
			if (formRef.current) {
				formRef.current.reset();
			}
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	return (
		<div className='container-fluid'>
			<form onSubmit={handleSubmit(submit)} ref={formRef}>
				<div className='row'>
					<div className='col-md-8'>
						<div className='card'>
							<div className='card-header card-header-success'>
								<h4 className='card-title'>Edit Profile</h4>
								<p className='card-category'>Complete your profile</p>
							</div>
							<div className='card-body'>
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
											<input
												ref={register}
												type='email'
												className='form-control'
												disabled={processing}
												name='email'
											/>
										</div>
									</div>
									<div className='col-12 col-md-6'>
										<div className='form-group bmd-form-group'>
											<label className='bmd-label-floating required'>Password</label>
											<input
												ref={register}
												type='password'
												className='form-control'
												disabled={processing}
												name='password'
											/>
										</div>
									</div>
									<div className='col-12 col-md-6'>
										<div className='form-group bmd-form-group is-filled'>
											<label className='bmd-label-floating required'>Role</label>
											<input className='form-control disabled' disabled name='role' value={user.role} />
										</div>
									</div>
								</div>
								<button type='submit' className='btn btn-info btn-sm pull-right'>
									{processing ? <i className='material-icons spin'>refresh</i> : 'Update Profile'}
								</button>
								<div className='clearfix'></div>
							</div>
						</div>
					</div>
					<div className='col-md-4'>
						<div className='card card-profile'>
							<div className='card-avatar'>
								<a
									href='/'
									onClick={(e) => {
										e.preventDefault();
										if (fileRef.current) {
											fileRef.current.click();
										}
									}}>
									<img className='img' src={displayPicture} alt='Profile' />
									<input
										ref={fileRef}
										type='file'
										className='d-none'
										name='picture'
										disabled={processing}
										accept='image/*'
										onChange={(e) => {
											if (e.target.files && e.target.files.length > 0) {
												const file = e.target.files[0];
												reader.readAsDataURL(file);
												setPicture(file);
											}
										}}
									/>
								</a>
							</div>
							<div className='card-body'>
								<h4 className='card-title'>{user.name}</h4>
								<h6 className='card-category text-gray'>{user.role}</h6>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};

export default Profile;
