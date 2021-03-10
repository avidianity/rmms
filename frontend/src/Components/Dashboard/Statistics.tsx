import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import {
	Counts as CountsContract,
	Daily as DailyContract,
	Months as MonthsContract,
	Quarters as QuartersContract,
	Weeks as WeeksContract,
	Years as YearsContract,
} from '../../Contracts/misc';
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

	useEffect(() => {
		fetchRequirements();
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container-fluid'>
			{showPrint ? (
				<button
					className='btn btn-info btn-sm'
					onClick={(e) => {
						e.preventDefault();
						print();
					}}>
					<i className='material-icons mr-1'>print</i>
					Print
				</button>
			) : null}
			<Counts counts={counts} />
			<div className='row'>
				<Years years={years} />
				<Quarters quarters={quarters} />
				<Weeks weeks={weeks} />
				<Daily daily={daily} />
			</div>
			<Months months={months} />
		</div>
	);
};

export default Statistics;
