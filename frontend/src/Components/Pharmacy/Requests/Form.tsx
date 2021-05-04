import axios from 'axios';
import React, { FC, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router-dom';
import toastr from 'toastr';
import { Medicine } from '../../../Contracts/Medicine';
import { PurchaseRequest } from '../../../Contracts/PurchaseRequest';
import { formatCurrency, handleError } from '../../../helpers';
import Flatpickr from 'react-flatpickr';
import dayjs from 'dayjs';
import { SearchContext } from '../../../contexts';

type Props = {};

type Inputs = {
	pr_number: string;
	sai_number: string;
	obr_number: string;
	delivered: string;
	items: { quantity: number; medicine_id: number }[];
};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useState('Add');
	const [id, setID] = useState<number>();
	const { register, handleSubmit, setValue } = useForm<Inputs>();
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();
	const [medicines, setMedicines] = useState<Medicine[]>([]);
	const [items, setItems] = useState<{ quantity: number; medicine_id: number }[]>([]);
	const [delivered, setDelivered] = useState<Date | null>(null);

	const submit = async (data: Inputs) => {
		setProcessing(true);
		try {
			data.delivered = delivered?.toJSON() || '';
			data.items = items;
			await (mode === 'Add' ? axios.post(`/pharmacy/purchase-requests`, data) : axios.put(`/pharmacy/purchase-requests/${id}`, data));
			toastr.success('Purchase Request saved successfully.');
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	const fetchPurchaseRequest = async (id: any) => {
		try {
			const { data } = await axios.get<PurchaseRequest>(`/pharmacy/purchase-requests/${id}`);
			setValue('pr_number', data.pr_number);
			setValue('sai_number', data.sai_number);
			setValue('obr_number', data.obr_number);
			setItems(data.items!);
			setID(data.id);
			if (data.delivered) {
				setDelivered(dayjs(data.delivered).toDate());
			}
			$('.form-group').addClass('is-filled');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const getMedicineCost = (id: any) => {
		return medicines.find((medicine) => Number(medicine.id) === Number(id))?.estimated_unit_cost || 0;
	};

	const fetchMedicines = async () => {
		try {
			const { data } = await axios.get('/pharmacy/medicines?paginate=false');
			setMedicines(data);
		} catch (error) {
			console.log(error.toJSON());
			toastr.error('Unable to fetch medicines.', 'Oops!');
		}
	};

	const { setShow: setShowSearch } = useContext(SearchContext);

	useEffect(() => {
		fetchMedicines();
		setShowSearch(false);
		if (match.path.includes('edit')) {
			setMode('Edit');
			fetchPurchaseRequest(match.params.id);
		}
		return () => {
			setShowSearch(true);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<div className='card'>
			<div className='card-header card-header primary'>
				{mode} Purchase Request
				<p className='card-category'>Complete the form below. Leave blank if not applicable.</p>
			</div>
			<div className='card-body'>
				<form onSubmit={handleSubmit(submit)}>
					<div className='row'>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>PR Number</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='pr_number' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>SAI Number</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='sai_number' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>OBR Number</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='obr_number' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating'>Delivered</label>
								<Flatpickr
									value={delivered || ''}
									className='form-control'
									onChange={(data) => {
										setDelivered(data[0]);
									}}
									disabled={processing}
								/>
							</div>
						</div>
						<div className='col-12'>
							<div className='card'>
								<div className='card-body'>
									<div className='row'>
										<div className='col-12 mb-3'>
											<button
												className='btn btn-success btn-sm'
												onClick={(e) => {
													e.preventDefault();
													if (medicines.length > 0) {
														setItems([
															...items,
															{
																quantity: 0,
																medicine_id: medicines[0].id!,
															},
														]);
													}
												}}>
												Add Item
											</button>
										</div>
										{items.map((item, index) => (
											<div className='col-12 row' key={index}>
												<div className='form-group bmd-form-group is-filled col-12 col-md-3'>
													<label className='bmd-label-floating'>Medicine</label>
													<select
														className='form-control'
														disabled={processing}
														value={item.medicine_id}
														onChange={(e) => {
															item.medicine_id = e.target.value.parseNumbers();
															items.splice(index, 1, item);
															setItems([...items]);
														}}>
														{medicines.map((medicine, index) => (
															<option key={index} value={medicine.id}>
																{medicine.description}
															</option>
														))}
													</select>
												</div>
												<div className='form-group bmd-form-group is-filled col-12 col-md-3'>
													<label className='bmd-label-floating'>Quantity</label>
													<input
														type='number'
														className='form-control'
														disabled={processing}
														value={item.quantity}
														onChange={(e) => {
															item.quantity = e.target.value.parseNumbers();
															items.splice(index, 1, item);
															setItems([...items]);
														}}
													/>
												</div>
												<div className='form-group bmd-form-group is-filled col-12 col-md-3'>
													<label className='bmd-label-floating'>Total</label>
													<input
														type='text'
														readOnly
														className='form-control'
														value={formatCurrency(getMedicineCost(item.medicine_id) * item.quantity)}
													/>
												</div>
												<div className='col-md-3 text-center'>
													<button
														className='btn btn-danger btn-sm'
														onClick={(e) => {
															e.preventDefault();
															items.splice(index, 1);
															setItems([...items]);
														}}>
														Remove
													</button>
												</div>
											</div>
										))}
									</div>
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
