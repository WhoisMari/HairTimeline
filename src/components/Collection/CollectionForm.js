import React, { useState } from 'react';
import Container from 'react-bootstrap/Container'
import Loading from '../UI/Loading';
import config from '../../config.json';

import classes from '../styles/Forms.module.scss';

const CollectionForm = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [title, setTitle] = useState('');
	const [message, setMessage] = useState({});

	const submitFormHandler = (event) => {
		event.preventDefault();
		setMessage('');
		setIsLoading(true);

		if (title.trim() === '') {
			setMessage({ERROR: 'Your collection should have a title.'});
			setIsLoading(false);
			return;
		}
		const collection_data = new FormData();
		collection_data.append('title', title);

		fetch(`${config.SERVER_URL}/collection/create/`, {
			method: 'POST',
			headers: {
				Authorization: `Token ${localStorage.getItem('token')}`
			},
			body: collection_data,
		})
		.then(() => {
			setIsLoading(false);
			setTitle('');
			setMessage({SUCCESS: 'Collection created successfully!'});
		});
	};

	return (
		<Container>
			<div className={classes['wrap-form']}>
				<h3 className={classes['page-title']}>Create collection</h3>
				
				{message['SUCCESS'] && <span>{message['SUCCESS'].value}</span>}
				<div className={classes['message']}>
					{message.SUCCESS && <span className={classes['success']}>{message.SUCCESS}</span>}
					{message.ERROR && <span className={classes['error']}>{message.ERROR}</span>}
				</div>

				{isLoading && <Loading />}
				{!isLoading &&
					<form onSubmit={submitFormHandler}>
						<input
							className="form-control"
							type="text"
							id="title"
							required
							placeholder='Like "Haircuts to try"'
							onChange={e => setTitle(e.target.value)}
						/>
						<button className={classes['primary-btn']}>Submit</button>
					</form>
				}
			</div>
		</Container>
	);
};

export default CollectionForm;