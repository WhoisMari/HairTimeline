import React from "react";
import { Link } from "react-router-dom";
import SaveButton from "../Save/SaveButton";
import classes from './Masonry.module.scss';

const MasonryPost = (props) => {
	const image_str = props.image;
	const post_image = image_str.substring(0, image_str.indexOf('?'));
	const isAuth = props.isAuth;

	return (
		<figure>
			<Link to={`/${props.user.username}/post/${props.postId}/`}>
				<img
					src={post_image}
					alt={props.date}
				/>
			</Link>

			<div className={classes['post-actions']}>
				<Link to={`/${props.user.username}/post/${props.postId}/`}>
					<div className={classes['post-link']}></div>
				</Link>
				<Link to={`/${props.user.username}/`} className={classes['post-username']}>
					@{props.user.username}
				</Link>
				{isAuth && <SaveButton postId={props.postId} isExplore={true} />}
			</div>

			<div className={classes['mobile-overlay']}>
				<Link to={`/${props.user.username}/`} className={classes['post-username']}>
					@{props.user.username}
				</Link>
				<SaveButton postId={props.postId} isExplore={true} />
			</div>
		</figure>
	);
};

export default MasonryPost;