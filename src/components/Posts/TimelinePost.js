import React from 'react';
import Moment from 'moment';
import { Link } from 'react-router-dom';
import config from '../../config.json';

import classes from './Timeline.module.scss';

const TimelinePost = (props) => {
	Moment.locale('en');
	const image_str = props.image;
	const post_image = image_str.substring(0, image_str.indexOf('?'));

	const handleDelete = (event) => {
		event.preventDefault();
		if (window.confirm('This action cannot be undone. Are you sure you want to delete this post?')) {
			fetch(`${config.SERVER_URL}/posts/delete/${props.postId}/`, {
				method: 'POST',
				headers: {
					Authorization: `Token ${localStorage.getItem('token')}`
				},
			})
			.then(() => {
				props.reload()
			});
		}
	};

	return (
		<div className={classes['timeline-row']}>
			<div className={classes['timeline-time']}>
				{Moment(props.date).format('MMM DD')}
				<small>{Moment(props.date).format('Y')}</small>
			</div>
			<figure className={classes['timeline-content']}>
				<Link to={`/${props.user}/post/${props.postId}/`}>
					<div className={classes['post-image']}>
						<img
							src={post_image}
							alt=''
						/>
						{props.current_user.username === props.user && 
							<div className={classes['delete-post']}>
								<button onClick={handleDelete}>Delete <i className={`fas fa-trash-alt`}></i></button>
							</div>
						}
						{props.current_user.username === props.user && 
							<div className={classes['delete-post-mobile']} onClick={handleDelete}>
								<i className={`fas fa-trash-alt`}></i>
							</div>
						}
					</div>
				</Link>
			</figure>
		</div>
	);
};	

export default TimelinePost;