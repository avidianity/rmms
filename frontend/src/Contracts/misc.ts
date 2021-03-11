import { PrenatalRecord } from './PrenatalRecord';
import { Record } from './Record';
import { User } from './User';

export type FreeObject = { [key: string]: string };

export type Nullable<T> = T | null;

export type Paginated<T = any> = {
	current_page: number;
	data: T[];
	first_page_url: string;
	from: null | number;
	last_page: number;
	last_page_url: string;
	links: { url: string; label: string | number; active: boolean }[];
	next_page_url: null | string;
	path: string;
	per_page: number;
	prev_page_url: null | string;
	to: null | number;
	total: number;
};

export type Counts = {
	medicine: {
		on_stock: number;
		out_of_stock: number;
	};
	purchase_requests: {
		delivered: number;
		pending: number;
	};
	prescriptions: {
		released: number;
		pending: number;
	};
	patients: number;
	regular_records: number;
	prenatal_records: number;
	users: number;
};

export type Years = {
	regular_records: number;
	prenatal_records: number;
	patients: number;
};

export type Quarters = {
	regular_records: number;
	prenatal_records: number;
	patients: number;
};

export type Numbers = {
	[month: string]: number;
};

export type Months = {
	current: {
		users: User[];
		regular_records: Record[];
		prenatal_records: PrenatalRecord[];
	};
	patients: Numbers;
	regular_records: Numbers;
	prenatal_records: Numbers;
};

export type Weeks = {
	regular_records: number;
	prenatal_records: number;
	patients: number;
};

export type Daily = {
	regular_records: number;
	prenatal_records: number;
	patients: number;
};
