import React from 'react';
import Moment from 'moment';
import { Link } from 'react-router-dom';
import { VerticalTimelineElement } from 'react-vertical-timeline-component';
import config from '../../config.json';
import classes from './Timeline.module.scss';

const TimelinePost = (props) => {
	Moment.locale('en');
	const post = props.post;
	const user = props.user;

	const handleDelete = (event) => {
		event.preventDefault();
		if (window.confirm('This action cannot be undone. Are you sure you want to delete this post?')) {
			fetch(`${config.SERVER_URL}/posts/delete/${post.post_id}/`, {
				method: 'POST',
				headers: {
					Authorization: `Token ${localStorage.getItem('token')}`
				},
			})
			.then(() => {
				props.reload()
			});
		};
	};

	return (
		<VerticalTimelineElement
			key={post.id}
			className="vertical-timeline-element--work"
			contentStyle={{ boxShadow: '0px 4px 35px #b6b6b680', background: '#fff' }}
			contentArrowStyle={{ borderRight: '7px solid  #fff', boxShadow: '0px 4px 35px #b6b6b680' }}
			date={Moment(post.date).format('MMMM DD, YYYY')}
			iconStyle={{ background: user.cover_color ? user.cover_color : '#6363ad', color: '#fff', fontWeight: 600,justifyContent: 'center', display: 'flex', alignItems: 'center' }}
			icon={<span>{Moment(post.date).format('MMM')}</span>}
		>
			<div className={classes['post-image']}>
				<Link to={`/${post.user}/post/${post.post_id}/`}>
					<img
						src={post.image.substring(0, post.image.indexOf('?'))}
						style={{ width: '100%' }}
					/>
					{props.current_user.username === user.username ? (
						<div className={classes['delete-post']}>
							<button onClick={handleDelete}>Delete <i className={`fas fa-trash-alt`}></i></button>
						</div>
					) : null}
					{props.current_user.username === user.username ? (
						<div className={classes['delete-post-mobile']} onClick={handleDelete}>
							<i className={`fas fa-trash-alt`}></i>
						</div>
					) : null}
				</Link>
			</div>
			
		</VerticalTimelineElement>
	);
};	

export default TimelinePost;