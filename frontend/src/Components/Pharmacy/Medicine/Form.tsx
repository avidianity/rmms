import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router-dom';
import toastr from 'toastr';
import { Medicine } from '../../../Contracts/Medicine';
import { handleError } from '../../../helpers';

type Props = {};

type Inputs = {
	name: string;
	unit_of_issue: string;
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
			setValue('unit_of_issue', data.unit_of_issue);
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
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Name</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='name' />
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Unit of Issue</label>
								<input ref={register} type='text' className='form-control' disabled={processing} name='unit_of_issue' />
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Cost</label>
								<input ref={register} type='number' className='form-control' disabled={processing} name='cost' />
							</div>
						</div>
						<div className='col-12 col-md-3'>
							<div className='form-group bmd-form-group'>
								<label className='bmd-label-floating'>Stocks</label>
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
