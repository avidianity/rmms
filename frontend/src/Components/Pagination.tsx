import React from 'react';
import { Paginated } from '../Contracts/misc';
import { outIf, toBool } from '../helpers';

type Props = {
	pagination: Paginated<any>;
	onChange: (url: string) => void;
	small?: boolean;
};

export default function Pagination({ pagination, onChange, small }: Props) {
	const links = pagination.links.filter((link) => Number.isInteger(Number(link.label)));

	const handleClick = (url: string | null) => {
		return (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
			e.preventDefault();
			if (url) {
				onChange(url);
			}
		};
	};

	if (pagination.total <= pagination.per_page) {
		return null;
	}

	return (
		<nav aria-label='Page Navigation'>
			<ul className={`pagination ${outIf(toBool(small), 'pagination-sm')}`}>
				<li className={`page-item ${outIf(pagination.prev_page_url === null, 'disabled')}`}>
					<a className='page-link' href={`${pagination.prev_page_url}`} onClick={handleClick(pagination.prev_page_url)}>
						<span aria-hidden='true'>&lt;</span>
						<span className='sr-only'>Previous</span>
					</a>
				</li>
				{links.map(({ active, label, url }, index) => (
					<li className={`page-item ${outIf(active, 'active')}`} key={index}>
						<a className='page-link' href={`${url}`} onClick={handleClick(url)}>
							{label}
						</a>
					</li>
				))}
				<li className={`page-item ${outIf(pagination.next_page_url === null, 'disabled')}`}>
					<a className='page-link' href={`${pagination.next_page_url}`} onClick={handleClick(pagination.next_page_url)}>
						<span aria-hidden='true'>&gt;</span>
						<span className='sr-only'>Next</span>
					</a>
				</li>
			</ul>
		</nav>
	);
}
