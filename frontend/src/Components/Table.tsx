import React, { FC } from 'react';

type Props = {
	title: string;
	subtitles?: string;
	head: () => JSX.Element;
	foot?: () => JSX.Element;
};

const Table: FC<Props> = ({ title, subtitles, head, children, foot }) => {
	return (
		<div className='card'>
			<div className='card-header card-header-success'>
				<h4 className='card-title'>{title}</h4>
				{subtitles ? <p className='card-category'>{subtitles}</p> : null}
			</div>
			<div className='card-body'>
				<div className='table-responsive'>
					<table className='table'>
						<thead className='text-success'>{head()}</thead>
						<tbody>{children}</tbody>
					</table>
				</div>
			</div>
			{foot ? <div className='card-footer'>{foot()}</div> : null}
		</div>
	);
};

export default Table;
