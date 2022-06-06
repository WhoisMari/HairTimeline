import React from "react";
import classes from './LikeButton.module.scss';
import config from '../../config.json';

const LikeButton = (props) => {
	const handleLike = () => {
		if (props.isAuth === false) {
			return;
		} else {
			const action = props.liked ? 'delete' : 'create'
			fetch(`${config.SERVER_URL}/like/${props.post_id}/${action}/`, {
				method: 'POST',
				headers: {
					Authorization: `Token ${localStorage.getItem('token')}`
				},
			})
			.then(res => res.json())
			.then(() => {
				props.onSubmit();
			});
		}
	};

	return (
		<span 
			onClick={handleLike}
			className={classes['like-btn']}
		>
			{props.liked ? 
				<i className="fas fa-heart"></i>
			: 
				<i className="far fa-heart"></i>
			}
		</span>
	)
};

export default LikeButton;