import React, { useState } from 'react';
import config from '../../utils/config.json';
import classes from './Comment.module.scss';

const CommentForm = (props) => {
	const [error, setError] = useState(null);

	const [commentBody, setCommentBody] = useState('');

	const submitFormHandler = (event) => {
		event.preventDefault();
		setError(null);
		if (props.isAuth === false) {
			setError("User should be logged in.");
			return;
		} else {
			if (commentBody.trim() === '') {
				setError("Your comment can't be empty");
				return;
			}
			const comment = new FormData()
			comment.append('body', commentBody);
			fetch(`${config.SERVER_URL}/comments/${props.post_id}/create/`, {
				method: 'POST',
				headers: {
					Authorization: `Token ${localStorage.getItem('token')}`
				},
				body: comment,
			})
			.then(res => res.json())
			.then((data) => {
				props.reload();
				setCommentBody('');
			});
		};
	};

	return (
		<form className={classes['comment-form']} onSubmit={submitFormHandler}>
			{error && <span>{error}</span>}
			<textarea className={classes['form-textarea']}
				type="text"
				id="body"
				required
				placeholder='Write a comment...'
				value={commentBody}
				onChange={e => setCommentBody(e.target.value)}
			/>

			<button className={classes['comment-button']}>Submit</button>
		</form>
	);
};

export default CommentForm;