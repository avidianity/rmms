import axios from 'axios';
import React, { createRef, FC, useContext, useEffect, useState } from 'react';
import { SearchContext } from '../../contexts';
import {
	Counts as CountsContract,
	Daily as DailyContract,
	Months as MonthsContract,
	Quarters as QuartersContract,
	Weeks as WeeksContract,
	Years as YearsContract,
} from '../../Contracts/misc';
import { User } from '../../Contracts/User';
import { routes } from '../../routes';
import state from '../../state';
import Exports from '../Exports';
import Charts from './Stats/Charts';
import Counts from './Stats/Counts';
import Daily from './Stats/Daily';
import Months from './Stats/Months';
import Quarters from './Stats/Quarters';
import Weeks from './Stats/Weeks';
import Years from './Stats/Years';

type Props = {};

const Statistics: FC<Props> = (props) => {
	const [loaded, setLoaded] = useState(false);
	const [showPrint, setShowPrint] = useState(true);
	const [counts, setCounts] = useState<CountsContract>({
		medicine: {
			on_stock: 0,
			out_of_stock: 0,
		},
		purchase_requests: {
			delivered: 0,
			pending: 0,
		},
		prescriptions: {
			released: 0,
			pending: 0,
		},
		patients: 0,
		regular_records: 0,
		prenatal_records: 0,
		immunization_records: 0,
		users: 0,
	});
	const [years, setYears] = useState<YearsContract>({
		regular_records: 0,
		prenatal_records: 0,
		patients: 0,
	});
	const [quarters, setQuarters] = useState<QuartersContract>({
		regular_records: 0,
		prenatal_records: 0,
		patients: 0,
	});
	const [months, setMonths] = useState<MonthsContract>({
		current: {
			users: [],
			regular_records: [],
			prenatal_records: [],
		},
		regular_records: {},
		prenatal_records: {},
		patients: {},
	});
	const [weeks, setWeeks] = useState<WeeksContract>({
		regular_records: 0,
		prenatal_records: 0,
		patients: 0,
	});
	const [daily, setDaily] = useState<DailyContract>({
		regular_records: 0,
		prenatal_records: 0,
		patients: 0,
	});

	const { setShow: setShowSearch } = useContext(SearchContext);

	const exportModalRef = createRef<HTMLDivElement>();
	const reportModalRef = createRef<HTMLDivElement>();

	const fetchCounts = async () => {
		try {
			const { data } = await axios.get('/statistics/counts');
			setCounts(data);
		} catch (error) {
			console.log(error.toJSON());
		}
	};

	const fetchYears = async () => {
		try {
			const { data } = await axios.get('/statistics/years');
			setYears(data);
		} catch (error) {
			console.log(error.toJSON());
		}
	};

	const fetchQuarters = async () => {
		try {
			const { data } = await axios.get('/statistics/quarters');
			setQuarters(data);
		} catch (error) {
			console.log(error.toJSON());
		}
	};

	const fetchMonths = async () => {
		try {
			const { data } = await axios.get('/statistics/months');
			setMonths(data);
		} catch (error) {
			console.log(error.toJSON());
		}
	};

	const fetchWeeks = async () => {
		try {
			const { data } = await axios.get('/statistics/weeks');
			setWeeks(data);
		} catch (error) {
			console.log(error.toJSON());
		}
	};

	const fetchDaily = async () => {
		try {
			const { data } = await axios.get('/statistics/daily');
			setDaily(data);
		} catch (error) {
			console.log(error.toJSON());
		}
	};

	const fetchRequirements = async () => {
		setLoaded(false);
		await Promise.all([fetchCounts(), fetchYears(), fetchQuarters(), fetchMonths(), fetchWeeks(), fetchDaily()]);
		setLoaded(true);
	};

	const print = () => {
		setShowPrint(false);
		setTimeout(() => window.print(), 500);
		setTimeout(() => setShowPrint(true), 1500);
	};

	const user = state.get<User>('user');

	useEffect(() => {
		fetchRequirements();
		setShowSearch(false);
		return () => {
			setShowSearch(true);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container-fluid'>
			{showPrint ? (
				<button
					className='btn btn-info btn-sm d-none'
					onClick={(e) => {
						e.preventDefault();
						print();
					}}>
					<i className='material-icons mr-1'>print</i>
					Print
				</button>
			) : null}
			<button
				type='button'
				className='btn btn-info btn-sm mx-1 d-none'
				onClick={(e) => {
					e.preventDefault();
					if (exportModalRef.current) {
						$(exportModalRef.current).modal('toggle');
					}
				}}>
				Exports
			</button>
			<div className='modal fade' tabIndex={-1} ref={exportModalRef}>
				<div className='modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title'>Exports</h5>
							<button
								type='button'
								className='close'
								onClick={(e) => {
									e.preventDefault();
									if (exportModalRef.current) {
										$(exportModalRef.current).modal('hide');
									}
								}}>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<Exports />
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-secondary btn-sm'
								onClick={(e) => {
									e.preventDefault();
									if (exportModalRef.current) {
										$(exportModalRef.current).modal('hide');
									}
								}}>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
			<button
				type='button'
				className='btn btn-primary btn-sm mx-1'
				onClick={(e) => {
					e.preventDefault();
					if (reportModalRef.current) {
						$(reportModalRef.current).modal('toggle');
					}
				}}>
				Reports
			</button>
			<div className='modal fade' tabIndex={-1} ref={reportModalRef}>
				<div className='modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title'>Exports</h5>
							<button
								type='button'
								className='close'
								onClick={(e) => {
									e.preventDefault();
									if (reportModalRef.current) {
										$(reportModalRef.current).modal('hide');
									}
								}}>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<div className='container-fluid'>
								<div className='row'>
									<div className='col-12 col-md-6 col-lg-4'>
										<button
											className='btn btn-primary btn-sm w-100'
											onClick={(e) => {
												e.preventDefault();
												window.open(routes.EXPORTS.PATIENTS);
											}}>
											Patients
										</button>
									</div>
									{!['Doctor', 'Nurse'].includes(user?.role) ? (
										<>
											<div className='col-12 col-md-6 col-lg-4'>
												<button
													className='btn btn-info btn-sm w-100'
													onClick={(e) => {
														e.preventDefault();
														window.open(routes.EXPORTS.MEDICINES);
													}}>
													Medicines
												</button>
											</div>
											<div className='col-12 col-md-6 col-lg-4'>
												<button
													className='btn btn-warning btn-sm w-100'
													onClick={(e) => {
														e.preventDefault();
														window.open(routes.EXPORTS.INVENTORIES);
													}}>
													Supplies
												</button>
											</div>
										</>
									) : null}
									<div className='col-12 col-md-6 col-lg-4'>
										<button
											className='btn btn-success btn-sm w-100'
											onClick={(e) => {
												e.preventDefault();
												window.open(routes.EXPORTS.IMMUNIZATIONS);
											}}>
											Immunizations
										</button>
									</div>
									<div className='col-12 col-md-6 col-lg-4'>
										<button
											className='btn btn-danger btn-sm w-100'
											onClick={(e) => {
												e.preventDefault();
												window.open(routes.EXPORTS.RECORDS);
											}}>
											Regular Patients
										</button>
									</div>
									<div className='col-12 col-md-6 col-lg-4'>
										<button
											className='btn btn-secondary btn-sm w-100'
											onClick={(e) => {
												e.preventDefault();
												window.open(routes.EXPORTS.PRENATALS);
											}}>
											Prenatal Patients
										</button>
									</div>
								</div>
							</div>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-secondary btn-sm'
								onClick={(e) => {
									e.preventDefault();
									if (reportModalRef.current) {
										$(reportModalRef.current).modal('hide');
									}
								}}>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
			<Counts counts={counts} />
			<div className='row'>
				<Years years={years} />
				<Quarters quarters={quarters} />
				<Weeks weeks={weeks} />
				<Daily daily={daily} />
			</div>
			<Months months={months} />
			{loaded ? <Charts months={months} /> : null}
		</div>
	);
};

export default Statistics;
