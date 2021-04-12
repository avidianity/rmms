import axios from 'axios';
import React, { FC } from 'react';
import { sentencify } from '../helpers';
import toastr from 'toastr';

type Props = {};

const Exports: FC<Props> = (props) => {
	const exportAndDownload = async (name: string) => {
		toastr.info('Exporting data. Please wait or you can do something else while waiting.', 'Notice');
		try {
			const { data } = await axios.get(`/exports/${name}`, {
				responseType: 'blob',
			});

			const url = URL.createObjectURL(new Blob([data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `${name}.pdf`);
			document.body.append(link);
			link.click();
		} catch (error) {
			console.log(error.toJSON());
			toastr.error(`Unable to export ${sentencify(name)}.`);
		}
	};

	return (
		<div className='container-fluid'>
			<div className='row'>
				<div className='col-12 col-md-6 col-lg-4'>
					<button
						className='btn btn-info btn-sm m-1 w-100'
						onClick={(e) => {
							e.preventDefault();
							exportAndDownload('patients');
						}}>
						Export Patients
					</button>
				</div>
				<div className='col-12 col-md-6 col-lg-4'>
					<button
						className='btn btn-success btn-sm m-1 w-100'
						onClick={(e) => {
							e.preventDefault();
							exportAndDownload('regular-records');
						}}>
						Export Regular Records
					</button>
				</div>
				<div className='col-12 col-md-6 col-lg-4'>
					<button
						className='btn btn-primary btn-sm m-1 w-100'
						onClick={(e) => {
							e.preventDefault();
							exportAndDownload('prenatal-records');
						}}>
						Export Prenatal Records
					</button>
				</div>
				<div className='col-12 col-md-6 col-lg-4'>
					<button
						className='btn btn-secondary btn-sm m-1 w-100'
						onClick={(e) => {
							e.preventDefault();
							exportAndDownload('immunization-records');
						}}>
						Export Immunization Records
					</button>
				</div>
				<div className='col-12 col-md-6 col-lg-4'>
					<button
						className='btn btn-danger btn-sm m-1 w-100'
						onClick={(e) => {
							e.preventDefault();
							exportAndDownload('medicines');
						}}>
						Export Medicines
					</button>
				</div>
				<div className='col-12 col-md-6 col-lg-4'>
					<button
						className='btn btn-warning btn-sm m-1 w-100'
						onClick={(e) => {
							e.preventDefault();
							exportAndDownload('inventories');
						}}>
						Export Inventories
					</button>
				</div>
			</div>
		</div>
	);
};

export default Exports;
