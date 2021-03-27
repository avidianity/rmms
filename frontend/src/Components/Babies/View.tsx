import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Baby } from '../../Contracts/Baby';
import { handleError } from '../../helpers';
import { routes } from '../../routes';
import Table from '../Table';

type Props = {};

const View: FC<Props> = (props) => {
	const [baby, setBaby] = useState<Baby | null>(null);
	const { id } = useParams<{ id: string }>();

	const fetchBaby = async (id: any) => {
		try {
			const { data } = await axios.get(`/babies/${id}`);
			setBaby(data);
		} catch (error) {
			handleError(error);
		}
	};

	useEffect(() => {
		fetchBaby(id);
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container-fluid'>
			<div className='card'>
				<div className='card-header card-header-success d-flex align-items-center'>
					<h4 className='card-title'>View Baby</h4>
					<Link to={`${routes.DASHBOARD}${routes.BABIES}/${baby?.id}/edit`} className='btn btn-warning btn-sm ml-auto'>
						<i className='material-icons mr-1'>create</i>
						Edit
					</Link>
				</div>
				<div className='card-body'>
					<p className='card-title'>Name: {baby?.name}</p>
					<p className='card-title'>Attendee: {baby?.attendee?.name}</p>
					<p className='card-title'>Nickname: {baby?.nickname}</p>
					<p className='card-title'>Father: {baby?.father}</p>
					<p className='card-title'>Mother: {baby?.mother}</p>
					<p className='card-title'>Sex: {baby?.sex}</p>
					<p className='card-title'>Type of Birth: {baby?.type_of_birth}</p>
					<p className='card-title'>Date of Birth: {dayjs(baby?.date_of_birth).format('MMMM DD, YYYY')}</p>
					<p className='card-title'>Complete in Months: {baby?.complete_in_months ? 'Yes' : 'No'}</p>
					<p className='card-title'>Single/Twin: {baby?.single_or_twin}</p>
					<p className='card-title'>Blood Type: {baby?.blood_type}</p>
					<p className='card-title'>Length of Body: {baby?.length_of_body}</p>
					<p className='card-title'>Round Head Measurement: {baby?.head_measurement}</p>
					<p className='card-title'>Round Chest Measurement: {baby?.chest_measurement}</p>
					<p className='card-title'>Order of Birth: {baby?.order_of_birth}</p>
					<p className='card-title'>Name Registration Date: {dayjs(baby?.name_registration_date).format('MMMM DD, YYYY')}</p>
					<p className='card-title'>Name Registration Location: {baby?.name_registration_location}</p>
					<p className='card-title'>Mishaps: {baby?.mishaps}</p>
					<div className='container-fluid'>
						<Table
							title='Vaccinations'
							subtitles={baby?.vaccinations && baby.vaccinations.length === 0 ? 'No Vaccinations Available' : undefined}
							head={() => (
								<tr>
									<th>ID</th>
									<th>Name</th>
									<th>Doses</th>
									<th>Date</th>
									<th>Remarks</th>
								</tr>
							)}>
							{baby?.vaccinations?.map((vaccination, index) => (
								<tr key={index}>
									<td>{vaccination.id}</td>
									<td>{vaccination.name}</td>
									<td>{vaccination.doses}</td>
									<td>{dayjs(vaccination.date).format('MMMM DD, YYYY')}</td>
									<td>{vaccination.remarks}</td>
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
