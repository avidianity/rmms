import axios from 'axios';
import React, { FC, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router-dom';
import toastr from 'toastr';
import { handleError } from '../../helpers';
import Flatpickr from 'react-flatpickr';
import dayjs from 'dayjs';
import { InventoryRelease } from '../../Contracts/InventoryRelease';
import { Inventory } from '../../Contracts/Inventory';
import { SearchContext } from '../../contexts';

type Props = {};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useState('Add');
	const [id, setID] = useState<number>();
	const [date, setDate] = useState(new Date());
	const [inventories, setInventories] = useState<Inventory[]>([]);
	const { register, handleSubmit, setValue } = useForm<InventoryRelease>();
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();

	const submit = async (data: InventoryRelease) => {
		setProcessing(true);
		try {
			data.date = date.toJSON();
			await (mode === 'Add' ? axios.post(`/inventory-releases`, data) : axios.put(`/inventory-releases/${id}`, data));
			toastr.success('Supply Release saved successfully.');
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	const fetchInventoryRelease = async (id: any) => {
		try {
			const { data } = await axios.get<InventoryRelease>(`/inventory-releases/${id}`);
			setValue('name', data.name);
			setValue('inventory_id', data.inventory_id);
			setValue('quantity', data.quantity);
			setDate(dayjs(data.date).toDate());
			setID(data.id);
			$('.form-group').addClass('is-filled');
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const fetchInventories = async () => {
		try {
			const { data } = await axios.get<Inventory[]>('/inventories?paginate=false');
			if (data.length === 0) {
				toastr.error('No supplies exist. Cannot release.');
				history.goBack();
			}
			setInventories(data);
		} catch (error) {
			console.log(error.toJSON());
			toastr.error('Unable to fetch supply list.');
		}
	};

	const { setShow: setShowSearch } = useContext(SearchContext);

	useEffect(() => {
		fetchInventories();
		setShowSearch(false);
		if (match.path.includes('edit')) {
			setMode('Edit');
			fetchInventoryRelease(match.params.id);
		}
		return () => {
			setShowSearch(true);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<div className='card'>
			<div className='card-header card-header primary'>
				{mode} Supply Release
				<p className='card-category'>Complete the form below. Leave blank if not applicable.</p>
				<p className='card-category'>
					Fields with <span style={{ color: 'rgb(190, 0, 0)' }}>*</span> are required.
				</p>
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
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating required'>Supply Name</label>
								<select ref={register} className='form-control' disabled={processing} name='inventory_id'>
									{inventories.map((inventory, index) => (
										<option value={inventory.id} key={index}>
											{inventory.description}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className='col-12 col-md-6'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Quantity</label>
								<input ref={register} type='number' className='form-control' disabled={processing} name='quantity' />
							</div>
						</div>
						<div className='col-12 col-md-6'>
							<div className='form-group bmd-form-group is-filled'>
								<label className='bmd-label-floating'>Date</label>
								<Flatpickr
									value={date}
									className='form-control'
									options={{
										minDate: dayjs(`January 01, ${new Date().getFullYear()}`, 'MMMM DD, YYYY').toDate(),
									}}
									onChange={(dates) => setDate(dates[0])}
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
