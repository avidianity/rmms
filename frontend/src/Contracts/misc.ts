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
