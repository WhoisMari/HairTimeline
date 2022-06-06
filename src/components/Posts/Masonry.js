import React from "react";
import MasonryPost from "./MasonryPost";
import classes from './Masonry.module.scss';

const Masonry = (props) => {
	return (
		<div id={classes['columns']}>
			{props.posts.map((post) => (
				<MasonryPost
					key={post.id}
					user={post.user}
					image={post.image}
					date={post.date}
					postId={post.id}
					isAuth={props.isAuth}
				/>
			))}
		</div>
	);
};

export default Masonry;