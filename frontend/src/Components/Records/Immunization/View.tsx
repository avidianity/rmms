import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { ImmunizationRecord } from '../../../Contracts/ImmunizationRecord';
import { handleError, sentencify } from '../../../helpers';
import Table from '../../Table';
import { routes } from '../../../routes';
import { STATUSES } from '../../../contants';
import state from '../../../state';
import { User } from '../../../Contracts/User';

type Props = {};

const View: FC<Props> = (props) => {
	const [immunizationRecord, setImmunizationRecord] = useState<ImmunizationRecord | null>(null);
	const history = useHistory();
	const params = useParams<{ id: string }>();

	const fetchImmunizationRecord = async (id: any) => {
		try {
			const { data } = await axios.get(`/immunization-records/${id}`);
			setImmunizationRecord(data);
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	// const deleteImmunizationRecord = async (id: any) => {
	// 	try {
	// 		await axios.delete(`/immunization-records/${id}`);
	// 		toastr.info('Immunization Record has been deleted.', 'Notice');
	// 		history.goBack();
	// 	} catch (error) {
	// 		handleError(error);
	// 	}
	// };

	useEffect(() => {
		fetchImmunizationRecord(params.id);
		// eslint-disable-next-line
	}, []);

	const user = state.get<User>('user');

	return (
		<div className='container-fluid'>
			<div className='card'>
				<div className='card-header card-header-success'>
					<div className='d-flex align-items-center'>
						<h4 className='card-title'>View Immunization Record</h4>
						{!['Admin'].includes(user.role) ? (
							<Link
								to={`${routes.DASHBOARD}${routes.RECORDS.IMMUNIZATION}/${immunizationRecord?.id}/edit`}
								className='btn btn-warning btn-sm ml-auto'>
								<i className='material-icons mr-1'>create</i>
								Edit
							</Link>
						) : null}
					</div>
				</div>
				<div className='card-body'>
					<p className='card-title'>Name: {immunizationRecord?.name}</p>
					<p className='card-title'>Birthday: {dayjs(immunizationRecord?.birthday).format('MMMM DD, YYYY')}</p>
					<p className='card-title'>Outcome: {immunizationRecord?.outcome}</p>
					<p className='card-title'>Address: {immunizationRecord?.address}</p>
					<p className='card-title'>Weight: {immunizationRecord?.weight}</p>
					<p className='card-title'>NBS: {immunizationRecord?.nbs}</p>
					<p className='card-title'>Father: {immunizationRecord?.father}</p>
					<p className='card-title'>Mother: {immunizationRecord?.mother}</p>
					<p className='card-title'>TT Injection: {immunizationRecord?.tt_injection}</p>
					<p className='card-title'>Time of Del.: {immunizationRecord?.time_of_del}</p>
					<p className='card-title'>Type of Del.: {immunizationRecord?.type_of_del}</p>
					<p className='card-title'>Place of Del.: {immunizationRecord?.place_of_del}</p>
					<p className='card-title'>
						Issued:{' '}
						{immunizationRecord?.created_at ? dayjs(immunizationRecord.created_at).format('MMMM DD, YYYY hh:mm A') : null}
					</p>
					<div className='container-fluid'>
						<Table
							title='Information'
							head={() => (
								<tr>
									<th></th>
									{STATUSES.Immunization.properties.map((property, index) => (
										<th className='text-center' key={index}>
											{sentencify(property)}
										</th>
									))}
								</tr>
							)}>
							{STATUSES.Immunization.fields.map((field, index) => (
								<tr key={index}>
									<td className='text-center'>{field.name}</td>
									{STATUSES.Immunization.properties.map((property, index) => (
										<td className='text-center' key={index}>
											{immunizationRecord?.info ? (immunizationRecord.info as any)[field.key][property] : null}
										</td>
									))}
								</tr>
							))}
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default View;
