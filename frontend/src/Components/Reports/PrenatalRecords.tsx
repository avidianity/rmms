import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { handleError } from '../../helpers';
import Header from './Header';

type Props = {};

type ReportRow = {
	address: string;
	males: number;
	females: number;
	live_births: number;
	death_births: number;
	nsd: number;
	cs: number;
};

const PrenatalRecords: FC<Props> = (props) => {
	const [data, setData] = useState<Array<ReportRow>>([]);

	const fetchData = async () => {
		try {
			const { data } = await axios.get<ReportRow[]>('/reports/prenatal-records');
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
							<th className='text-center'>Address</th>
							<th className='text-center'>Male</th>
							<th className='text-center'>Female</th>
							<th className='text-center'>NSD</th>
							<th className='text-center'>CS</th>
							<th className='text-center'>Live Births</th>
							<th className='text-center'>Deceased Births</th>
							<th className='text-center'>Total</th>
						</tr>
					</thead>
					<tbody>
						{data.map((item, index) => (
							<tr key={index}>
								<td className='text-center'>{item.address}</td>
								<td className='text-center'>{item.males}</td>
								<td className='text-center'>{item.females}</td>
								<td className='text-center'>{item.nsd}</td>
								<td className='text-center'>{item.cs}</td>
								<td className='text-center'>{item.live_births}</td>
								<td className='text-center'>{item.death_births}</td>
								<td className='text-center'>{item.live_births + item.death_births}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default PrenatalRecords;
