import React, { Fragment, useState, useEffect, useCallback } from "react";
import Modal from 'react-bootstrap/Modal';
import CreatableSelect from "react-select/creatable";
import CollectionBadge from "./CollectionBadge";
import Loading from '../UI/Loading';
import classes from './SaveButton.module.scss';
import config from '../../config.json';

const SaveModal = (props) => {
	const [message, setMessage] = useState('');
	const [loading, setIsLoading] = useState(false);
	const [options, setOptions] = useState([]);
	const [inCollection, setInCollection] = useState([]);

	const fetchCollectionsHandler = useCallback(async () => {
		setMessage(null);
		setIsLoading(true);
		let user_options = [];
		let in_collection = [];
		try {
			const response = await fetch(`${config.SERVER_URL}/collections/`, {
				method: 'GET',
				headers: {
					Authorization: `Token ${localStorage.getItem('token')}`
				}
			});
			if (!response.ok) {
				throw new Error('something went wrong');
			}
			const data = await response.json();
			data.forEach((item) => {
				user_options.push({'value': item.id, 'label': item.title});
				item.post.forEach((post) => {
					if (props.postId === post.id) {
						in_collection.push(item);
						setInCollection(in_collection);
					};
				});
			});
			setOptions(user_options);
			setIsLoading(false);
		} catch(error) {
			console.log(error);
		}
	}, [props.postId]);

	const handleCreate = (inputValue) => {
		setMessage(null);
		setIsLoading(true);
		const new_collection = new FormData();
		new_collection.append('title', inputValue);
		fetch(`${config.SERVER_URL}/collection/create/`, {
			method: 'POST',
			headers: {
				Authorization: `Token ${localStorage.getItem('token')}`
			},
			body: new_collection,
		})
		.then(res => res.json())
		.then(data => {
			fetchCollectionsHandler();
			setMessage(data.message);
			setIsLoading(false);
		});
	};

	const handleChange = (newValue) => {
		setMessage(null);
		setIsLoading(true);
		if (newValue === null) {
			setIsLoading(false);
			return;
		};
		fetch(`${config.SERVER_URL}/add/${props.postId}/${newValue.value}/`, {
			method: 'PUT',
			headers: {
				Authorization: `Token ${localStorage.getItem('token')}`
			},
		})
		.then(res => res.json())
		.then(data => {
			fetchCollectionsHandler();
			setIsLoading(false);
			setMessage(data.message);
		});
	};

	useEffect(() => {
		fetchCollectionsHandler();
	}, [fetchCollectionsHandler]);

	return (
		<Fragment>
			<Modal show={props.show} onHide={props.onHide}>
				<Modal.Header closeButton>
					<Modal.Title>Add to collection</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{loading && <Loading />}
					{message && <span>{message}</span>}
					{!loading &&
						<div>
							<CreatableSelect
								isClearable
								className={classes['custom']}
								options={options}
								onCreateOption={handleCreate}
								onChange={handleChange}
							/>
							<div className={classes['wrap-collections']}>
								{inCollection.map((collection) => (
									<CollectionBadge
										key={collection.id}
										collection={collection.id}
										title={collection.title}
										postId={props.postId}
										fetchCollections={fetchCollectionsHandler}
									/>
								))}
							</div>
						</div>
					}
				</Modal.Body>
			</Modal>
		</Fragment>
		);
};

export default SaveModal;