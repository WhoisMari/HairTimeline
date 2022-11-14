import React, { useEffect, useState, useCallback } from 'react';
import config from '../../utils/config.json';

import CommentForm from './CommentForm';
import CommentsList from './CommentsList';
import Loading from '../UI/Loading';
import classes from './Comment.module.scss';

const CommentBox = (props) => {
	const [comments, setComments] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchCommentsHandler = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(`${config.SERVER_URL}/comments/${props.post_id}/`, {
				method: 'GET',
			});
			if (!response.ok) {
				throw new Error('Something went wrong!');
			}

			const data = await response.json();
			
			let loadedComments = [];
			for (const key in data) {
				loadedComments.push({
					id: key,
					user: data[key].user,
					body: data[key].body,
					comment_id: data[key].id
				});
			}
			setComments(loadedComments);
		} catch (error) {
			setError('No comments yet!');
		}
		setIsLoading(false);
	}, [props.post_id]);

	useEffect(() => {
		fetchCommentsHandler();
	}, [fetchCommentsHandler]);

	return (
		<div className={classes['wrap-comments']}>
			{!isLoading && 
				<CommentsList 
					comments={comments} 
					post_id={props.post_id} 
					current_user={props.current_user} 
					post_user={props.post_user}
					reload={fetchCommentsHandler}
				/>
			}
			{isLoading && <Loading />}
			{error && <span>{error}</span>}
			<CommentForm reload={fetchCommentsHandler} post_id={props.post_id} isAuth={props.isAuth} />
		</div>
	);
};

export default CommentBox;