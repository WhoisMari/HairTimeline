import React, { Fragment, useState, useCallback, useEffect } from 'react';
import classes from './LikeButton.module.scss';
import LikeButton from './LikeButton';
import Spinner from '../UI/Spinner';
import config from '../../config.json';

const Likes = (props) => {
	const [liked, setLiked] = useState(false);
	const [likesCount, setLikesCount] = useState();
	const [isLoading, setIsLoading] = useState(false);

	const fetchLikesHandler = useCallback(async () => {
		setIsLoading(true);
		try {
			let response;
			if (props.isAuth === true) {
				response = await fetch(`${config.SERVER_URL}/like/${props.post_id}/`, {
					method: 'GET',
					headers: {
						Authorization: `Token ${localStorage.getItem('token')}`
					},
				});
			} else {
				response = await fetch(`${config.SERVER_URL}/like/${props.post_id}/`, {
					method: 'GET',
				});
			};
			if (!response.ok) {
				throw new Error('Something went wrong!');
			}
			const data = await response.json();
			let loaded_likes = data.likes;
			setLikesCount(loaded_likes.length);
			setLiked(data.user_liked)
		} catch (error) {
			console.log('error');
		}
		setIsLoading(false);
	}, [props.post_id, props.isAuth]);

	useEffect(() => {
		fetchLikesHandler()
	}, [fetchLikesHandler]);

	return (
		<Fragment>
			<div className={classes['likes-wrapper']}>
				<LikeButton post_id={props.post_id} liked={liked} onSubmit={fetchLikesHandler} isAuth={props.isAuth} />
				{likesCount > 0 && <span>{likesCount} {likesCount > 1 ? 'likes' : 'like'}</span>}
			</div>
			{isLoading && <Spinner isWhite={false} />}
		</Fragment>
	);
};

export default Likes;