import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router-dom';
import toastr from 'toastr';
import { Medicine } from '../../../Contracts/Medicine';
import { handleError } from '../../../helpers';
import Flatpickr from 'react-flatpickr';

type Props = {};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useState('Add');
	const [id, setID] = useState<number>();
	const [dateDelivered, setDateDelivered] = useState(new Date());
	const [expiryDate, setExpiryDate] = useState(new Date());
	const { register, handleSubmit, setValue } = useForm<Medicine>();
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();

	const submit = async (data: Medicine) => {
		setProcessing(true);
		try {
			data.date_delivered = dateDelivered.toJSON();
			data.expiry_date = expiryDate.toJSON();
			await (mode === 'Add' ? axios.post(`/pharmacy/medicines`, data) : axios.put(`/pharmacy/medicines/${id}`, data));
			toastr.success('Medicine saved successfully.');
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	const fetchMedicine = async (id: any) => {
		try {
			const { data } = await axios.get<Medicine>(`/pharmacy/medicines/${id}`);
			setValue('name', data.name);
			setValue('description', data.description);
			setValue('unit_of_issue', data.unit_of_issue);
			setValue('estimated_unit_cost', data.estimated_unit_cost);
			setValue('quantity', data.quantity);
			setDateDelivered(dayjs(data.date_delivered).toDate());
			setExpiryDate(dayjs(data.expiry_date).toDate());
			setValue('critical_value', data.critical_value);
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
			fetchMedicine(match.params.id);
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='card'>
			<div className='card-header card-header primary'>
				{mode} Medicine
				<p className='card-category'>Complete the form below</p>
			</div>
			<div className='card-body'>
				<form onSubmit={handleSubmit(submit)}>
					<div className='row'>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Name</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='name' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Description</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='description' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Unit of Issue</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='unit_of_issue' />
							</div>
						</div>
						<div className='col-12 col-md-6'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Estimated Unit Cost</label>
								<input
									ref={register}
									type='text'
									className='form-control'
									disabled={processing}
									name='estimated_unit_cost'
								/>
							</div>
						</div>
						<div className='col-12 col-md-6'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Quantity</label>
								<input ref={register} type='number' className='form-control' disabled={processing} name='quantity' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating required'>Date Delivered</label>
								<Flatpickr
									value={dateDelivered}
									className='form-control'
									onChange={(dates) => setDateDelivered(dates[0])}
								/>
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating required'>Expiry Date</label>
								<Flatpickr value={expiryDate} className='form-control' onChange={(dates) => setExpiryDate(dates[0])} />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Critical Value</label>
								<input ref={register} type='number' className='form-control' disabled={processing} name='critical_value' />
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
