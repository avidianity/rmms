import axios from 'axios';
import dayjs from 'dayjs';
import lodash from 'lodash';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchContext } from '../../../contexts';
import { ImmunizationRecord } from '../../../Contracts/ImmunizationRecord';
import { Paginated } from '../../../Contracts/misc';
import { PrenatalRecord } from '../../../Contracts/PrenatalRecord';
import { Record } from '../../../Contracts/Record';
import { makeDummyPagination, handleError } from '../../../helpers';
import { routes } from '../../../routes';
import state from '../../../state';
import Pagination from '../../Pagination';
import Table from '../../Table';

type Paginations = {
	immunizationRecords: Paginated;
	prenatalRecords: Paginated;
	regularRecords: Paginated;
};

type Props = {};

const List: FC<Props> = (props) => {
	const [immunizationRecords, setImmunizationRecords] = useState<ImmunizationRecord[]>([]);
	const [prenatalRecords, setPrenatalRecords] = useState<PrenatalRecord[]>([]);
	const [records, setRecords] = useState<Record[]>([]);
	const [paginations, setPaginations] = useState<Paginations>({
		immunizationRecords: makeDummyPagination(),
		prenatalRecords: makeDummyPagination(),
		regularRecords: makeDummyPagination(),
	});

	const { setShow: setShowSearch } = useContext(SearchContext);

	const fetchimmunizationRecords = async (url?: string) => {
		try {
			const page = state.get<number>('immunization-record-page') || 1;
			const { data } = await axios.get<Paginated<ImmunizationRecord>>(url ? url : `/archived/immunization-records?page=${page}`);
			setImmunizationRecords(data.data);
			setPaginations({ ...paginations, immunizationRecords: data });
			state.set('immunization-record-page', data.current_page);
		} catch (error) {
			handleError(error);
		}
	};

	const fetchPrenatalRecords = async (url?: string) => {
		try {
			const page = state.get<number>('prenatal-records-page') || 1;
			const { data } = await axios.get<Paginated<PrenatalRecord>>(url ? url : `/archived/prenatal-records?page=${page}`);
			setPrenatalRecords(data.data);
			setPaginations({ ...paginations, prenatalRecords: data });
			state.set('prenatal-records-page', data.current_page);
		} catch (error) {
			handleError(error);
		}
	};

	const fetchRecords = async (url?: string) => {
		try {
			const page = state.get<number>('regular-records-page') || 1;
			const { data } = await axios.get<Paginated<Record>>(url ? url : `/archived/regular-records?page=${page}`);
			setRecords(data.data);
			setPaginations({ ...paginations, regularRecords: data });
			state.set('regular-records-page', data.current_page);
		} catch (error) {
			handleError(error);
		}
	};

	const fetchRequirements = async () => {
		await Promise.all([fetchimmunizationRecords(), fetchPrenatalRecords(), fetchRecords()]);
	};

	useEffect(() => {
		fetchRequirements();
		setShowSearch(false);
		return () => {
			setShowSearch(true);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<Table
				title='Archived Immunization Records'
				head={() => (
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Birthday</th>
						<th>Address</th>
						<th>Date Issued</th>
						<th>Actions</th>
					</tr>
				)}
				foot={() => <Pagination pagination={paginations.immunizationRecords} onChange={(url) => fetchimmunizationRecords(url)} />}>
				{immunizationRecords.map(({ id, name, birthday, address, created_at }, index) => (
					<tr key={index}>
						<td>{id}</td>
						<td>{name}</td>
						<td>{dayjs(birthday).format('MMMM DD, YYYY')}</td>
						<td>{address}</td>
						<td>{dayjs(created_at).format('MMMM DD, YYYY hh:mm A')}</td>
						<td>
							<Link
								to={`${routes.DASHBOARD}${routes.RECORDS.IMMUNIZATION}/${id}`}
								className='btn btn-info btn-sm'
								title='View'>
								<i className='material-icons mr-1'>visibility</i>
								View
							</Link>
						</td>
					</tr>
				))}
			</Table>
			<hr className='my-2' />
			<Table
				title='Archived Regular Records'
				head={() => (
					<tr>
						<th>ID</th>
						<th>Case Number</th>
						<th>Patient</th>
						<th>Doctor</th>
						<th>Diagnosis</th>
						<th>Status</th>
						<th>Last Updated</th>
						<th>Actions</th>
					</tr>
				)}
				foot={() => <Pagination pagination={paginations.regularRecords} onChange={(url) => fetchRecords(url)} />}>
				{records.map(({ id, case_number, updated_at, patient, doctor, diagnosis, status }, index) => (
					<tr key={index}>
						<td>{id}</td>
						<td>{dayjs(case_number!).format('MMMM DD, YYYY')}</td>
						<td>{patient?.name}</td>
						<td>{doctor?.name}</td>
						<td>{lodash.truncate(diagnosis, { length: 20 })}</td>
						<td>
							<b>{status}</b>
						</td>
						<td>{dayjs(updated_at!).format('MMMM DD, YYYY hh:mm A')}</td>
						<td>
							<Link to={`${routes.DASHBOARD}${routes.RECORDS.REGULAR}/${id}`} className='btn btn-info btn-sm' title='View'>
								<i className='material-icons mr-1'>visibility</i>
								View
							</Link>
						</td>
					</tr>
				))}
			</Table>
			<hr className='my-2' />
			<Table
				title='Archived Prenatal Records'
				head={() => (
					<tr>
						<th>ID</th>
						<th>Case Number</th>
						<th>Patient</th>
						<th>Attendee</th>
						<th>Status</th>
						<th>Remarks</th>
						<th>Last Updated</th>
						<th>Actions</th>
					</tr>
				)}
				foot={() => <Pagination pagination={paginations.prenatalRecords} onChange={(url) => fetchPrenatalRecords(url)} />}>
				{prenatalRecords.map(({ id, case_number, updated_at, patient, attendee, status, remarks }, index) => (
					<tr key={index}>
						<td>{id}</td>
						<td>{dayjs(case_number!).format('MMMM DD, YYYY')}</td>
						<td>{patient?.name}</td>
						<td>{attendee?.name}</td>
						<td>
							<b>{status}</b>
						</td>
						<td>{lodash.truncate(remarks || '', { length: 10 })}</td>
						<td>{dayjs(updated_at!).format('MMMM DD, YYYY hh:mm A')}</td>
						<td>
							<Link to={`${routes.DASHBOARD}${routes.RECORDS.PRENATAL}/${id}`} className='btn btn-info btn-sm' title='View'>
								<i className='material-icons mr-1'>visibility</i>
								View
							</Link>
						</td>
					</tr>
				))}
			</Table>
		</>
	);
};

export default List;
