import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { Medicine } from '../../Contracts/Medicine';
import { handleError } from '../../helpers';
import Header from './Header';

type Props = {};

type ReportRow = Medicine;

const Medicines: FC<Props> = (props) => {
	const [data, setData] = useState<Array<ReportRow>>([]);

	const fetchData = async () => {
		try {
			const { data } = await axios.get<ReportRow[]>('/reports/medicines');
			setData(data);
		} catch (error) {
			handleError(error);
		}
	};

	useEffect(() => {
		$('.modal-backdrop').remove();
		fetchData().then(() => {
			window.print();
			window.close();
		});
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container'>
			<Header />
			<div className='px-5 mt-5 table-responsive'>
				<table className='table'>
					<thead>
						<tr>
							<th className='text-center'>Description</th>
							<th className='text-center'>Released</th>
							<th className='text-center'>Available</th>
							<th className='text-cennter'>Estimated Unit Cost</th>
							<th className='text-cennter'>Estimated Cost</th>
						</tr>
					</thead>
					<tbody>
						{data.map((item, index) => (
							<tr key={index}>
								<td className='text-center'>{item.description}</td>
								<td className='text-center'>{item.released}</td>
								<td className='text-center'>{item.available}</td>
								<td className='text-center'>{item.estimated_unit_cost}</td>
								<td className='text-center'>{item.estimated_cost}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Medicines;
