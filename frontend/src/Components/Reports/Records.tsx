import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { handleError } from '../../helpers';
import Header from './Header';

type Props = {};

type ReportRow = {
	disease: string;
	males: number;
	females: number;
};

const Records: FC<Props> = (props) => {
	const [data, setData] = useState<Array<ReportRow>>([]);

	const fetchData = async () => {
		try {
			const { data } = await axios.get<ReportRow[]>('/reports/records');
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
							<th className='text-center font-weight-bold'>Disease</th>
							<th className='text-center font-weight-bold'>Male</th>
							<th className='text-center font-weight-bold'>Female</th>
							<th className='text-center font-weight-bold'>Total</th>
						</tr>
					</thead>
					<tbody>
						{data.map((item, index) => (
							<tr key={index}>
								<td className='text-center font-weight-bold'>{item.disease}</td>
								<td className='text-center font-weight-bold'>{item.males}</td>
								<td className='text-center font-weight-bold'>{item.females}</td>
								<td className='text-center font-weight-bold'>{item.males + item.females}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Records;
