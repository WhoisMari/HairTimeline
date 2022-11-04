import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import noprofile from '../UI/noprofile.png';
import config from '../../config.json';
import classes from './Comment.module.scss';

const Comment = (props) => {
	const [showDeleteComment, setShowDeleteComment] = useState(false);
	const handleDelete = (event) => {
		event.preventDefault();
		fetch(`${config.SERVER_URL}/comments/${props.post_id}/delete/${props.comment_id}/`, {
			method: 'POST',
			headers: {
				Authorization: `Token ${localStorage.getItem('token')}`
			},
		})
		.then(() => {
			props.reload()
		});
	};

	useEffect(() => {
		setShowDeleteComment(false);
		if (props.current_user.pk === props.user.id || props.current_user.pk === props.post_user.id) {
			setShowDeleteComment(true);
		}
	}, [props.current_user, props.user, props.post_user])

	return (
		<div className={classes['wrap-comment']}>
			<div className={classes['comment']}>
				<Link to={`/${props.user.username}/`} className={classes['comment-username']}>
					<img src={props.user.profile_image ? (
							props.user.profile_image.substring(0, props.user.profile_image.indexOf('?'))
						) : (
							noprofile
						)} alt=''
					/>
					@{props.user.username}
				</Link>
				<span className={classes['comment-body']}>{props.body}</span>
			</div>
		{showDeleteComment && <span className={classes['comment-action']} onClick={handleDelete}>Delete Comment</span>}
		</div>
	);
};

export default Comment;