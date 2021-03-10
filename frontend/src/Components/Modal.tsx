import React, { forwardRef, PropsWithChildren } from 'react';

type Props = {
	id?: string;
	title: string;
	buttons?: JSX.Element;
};

export default forwardRef<HTMLDivElement, PropsWithChildren<Props>>(({ title, id, children, buttons }, ref) => (
	<div id={id} className='modal fade' tabIndex={-1} role='dialog' ref={ref}>
		<div className='modal-dialog modal-lg modal-dialog-centered' role='document'>
			<div className='modal-content'>
				<div className='modal-header'>
					<h5 className='modal-title'>{title}</h5>
					<button type='button' className='close' data-dismiss='modal' aria-label='Close'>
						<span aria-hidden='true'>&times;</span>
					</button>
				</div>
				<div className='modal-body'>{children}</div>
				<div className='modal-footer'>
					{buttons}
					<button type='button' className='btn btn-primary btn-sm' data-dismiss='modal'>
						<i className='material-icons'>close</i>
						Close
					</button>
				</div>
			</div>
		</div>
	</div>
));
