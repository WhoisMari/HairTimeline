import React from "react";
import classes from './SaveButton.module.scss';
import config from '../../config.json';

const CollectionBadge = (props) => {
	const handleRemove = (event) => {
		event.preventDefault();
		fetch(`${config.SERVER_URL}/remove/${props.postId}/${props.collection}/`, {
			method: 'PUT',
			headers: {
				Authorization: `Token ${localStorage.getItem('token')}`
			},
		})
		.then(() => {
			props.fetchCollections()
		});
	}
	return (
		<div className={`badge rounded-pill ${classes['badge']}`}>
			{props.title}
			<span className={classes['remove-from-collection']}>
				<i className="fa-solid fa-xmark" onClick={handleRemove}></i>	
			</span>
		</div>
	);
};

export default CollectionBadge;