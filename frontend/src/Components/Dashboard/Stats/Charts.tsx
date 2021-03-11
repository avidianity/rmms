import React, { createRef, FC, useEffect } from 'react';
import Chartist, { IBarChartOptions, ILineChartOptions } from 'chartist';
import 'chartist/dist/chartist.css';
import { Months as MonthsContract, Numbers } from '../../../Contracts/misc';

type Props = {
	months: MonthsContract;
};

const Charts: FC<Props> = ({ months }) => {
	const patientsRef = createRef<HTMLDivElement>();
	const regularRecordsRef = createRef<HTMLDivElement>();
	const prenatalRecordsRef = createRef<HTMLDivElement>();

	useEffect(() => {
		if (patientsRef.current) {
			initChart(patientsRef.current, months.patients, 'Bar');
		}
		if (regularRecordsRef.current) {
			initChart(regularRecordsRef.current, months.regular_records, 'Line');
		}
		if (prenatalRecordsRef.current) {
			initChart(prenatalRecordsRef.current, months.prenatal_records, 'Line');
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='row'>
			<div className='col-12 col-lg-6'>
				<div className='card card-chart'>
					<div className='card-header card-header-success'>
						<div className='ct-chart' ref={patientsRef}></div>
					</div>
					<div className='card-body'>
						<h4 className='card-title'>Patients</h4>
						<p className='card-category'>
							<span className='text-success'>
								<i className='fa fa-long-arrow-up'></i> 55%{' '}
							</span>{' '}
							increase.
						</p>
					</div>
					<div className='card-footer'>
						<div className='stats'>
							<i className='material-icons'>access_time</i> updated 4 minutes ago
						</div>
					</div>
				</div>
			</div>
			<div className='col-12 col-lg-6'>
				<div className='card card-chart'>
					<div className='card-header card-header-info'>
						<div className='ct-chart' ref={regularRecordsRef}></div>
					</div>
					<div className='card-body'>
						<h4 className='card-title'>Regular Records</h4>
						<p className='card-category'>Analytics by Month</p>
					</div>
					<div className='card-footer'>
						<div className='stats'>
							<i className='material-icons'>access_time</i> by date
						</div>
					</div>
				</div>
			</div>
			<div className='col-12 col-lg-6'>
				<div className='card card-chart'>
					<div className='card-header card-header-warning'>
						<div className='ct-chart' ref={prenatalRecordsRef}></div>
					</div>
					<div className='card-body'>
						<h4 className='card-title'>Prenatal Records</h4>
						<p className='card-category'>Analytics by Month</p>
					</div>
					<div className='card-footer'>
						<div className='stats'>
							<i className='material-icons'>pregnant_woman</i> on Pregnant Women
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const initChart = (element: HTMLDivElement, raw: Numbers, type: 'Line' | 'Bar' | 'Pie') => {
	const data = {
		labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		series: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
	};

	const options: ILineChartOptions | IBarChartOptions = {
		lineSmooth: Chartist.Interpolation.cardinal({
			tension: 0,
		}),
		low: 0,
		high: 50,
		chartPadding: {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
		},
	};

	for (const month in raw) {
		const value = raw[month];
		const index = data.labels.findIndex((label) => label.toLowerCase().includes(month.toLowerCase()));
		data.series[0][index] += value;
		if (value > options.high!) {
			options.high = value + 50;
		}
	}

	data.labels = data.labels.map((label) =>
		label
			.split('')
			.filter((_, i) => i < 3)
			.join('')
	);

	if (type === 'Line') {
		options.showArea = true;
	}

	return new Chartist[type](
		element,
		data,
		options,
		type === 'Bar'
			? ([
					[
						'screen and (max-width: 640px)',
						{
							seriesBarDistance: 5,
							axisX: {
								labelInterpolationFnc: function (value: any) {
									return value[0];
								},
							},
						},
					],
			  ] as any)
			: undefined
	);
};

export default Charts;
