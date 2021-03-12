import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router-dom';
import toastr from 'toastr';
import { Inventory } from '../../Contracts/Inventory';
import { handleError } from '../../helpers';

type Props = {};

type Inputs = {
	name: string;
	cost: number;
	stocks: number;
};

const Form: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [mode, setMode] = useState('Add');
	const [id, setID] = useState<number>();
	const { register, handleSubmit, setValue } = useForm<Inputs>();
	const match = useRouteMatch<{ id: string }>();
	const history = useHistory();

	const submit = async (data: Inputs) => {
		setProcessing(true);
		try {
			await (mode === 'Add' ? axios.post(`/inventories`, data) : axios.put(`/inventories/${id}`, data));
			toastr.success('Supply saved successfully.');
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	const fetchInventory = async (id: any) => {
		try {
			const { data } = await axios.get<Inventory>(`/inventories/${id}`);
			setValue('name', data.name);
			setValue('stocks', data.stocks);
			setValue('cost', data.cost);
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
			fetchInventory(match.params.id);
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='card'>
			<div className='card-header card-header primary'>
				{mode} Supply
				<p className='card-category'>Complete the form below. Leave blank if not applicable.</p>
				<p className='card-category'>
					Fields with <span style={{ color: 'rgb(190, 0, 0)' }}>*</span> are required.
				</p>
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
								<label className='bmd-label-floating required'>Cost per Item</label>
								<input ref={register} type='number' className='form-control' disabled={processing} name='cost' />
							</div>
						</div>
						<div className='col-12 col-md-4'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating required'>Stocks</label>
								<input ref={register} type='number' className='form-control' disabled={processing} name='stocks' />
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
