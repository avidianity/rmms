import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { handleError } from '../../helpers';
import Header from './Header';

type Props = {};

type ReportRow = {
	address: string;
	regular: number;
	prenatal: number;
	immunization: number;
};

const Patients: FC<Props> = (props) => {
	const [data, setData] = useState<Array<ReportRow>>([]);

	const fetchData = async () => {
		try {
			const { data } = await axios.get<ReportRow[]>('/reports/patients');
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
							<th>Barangay</th>
							<th className='text-center'>Regular</th>
							<th className='text-center'>Prenatal</th>
							<th className='text-center'>Immunization</th>
							<th className='text-center'>Total</th>
						</tr>
					</thead>
					<tbody>
						{data.map((item, index) => (
							<tr key={index}>
								<td>{item.address}</td>
								<td className='text-center'>{item.regular}</td>
								<td className='text-center'>{item.prenatal}</td>
								<td className='text-center'>{item.immunization}</td>
								<td className='text-center'>{item.regular + item.prenatal + item.immunization}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Patients;
