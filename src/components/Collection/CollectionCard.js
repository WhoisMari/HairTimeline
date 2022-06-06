import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import classes from './CollectionCard.module.scss';

const CollectionCard = (props) => {
	const [post, setPost] = useState(props.posts);

	useEffect(() => {
		if (props.posts.length >= 1) {
			setPost(props.posts[0].image.substring(0, props.posts[0].image.indexOf('?')));
		}
	}, [props.posts]);


	return (
		<div className={classes['card']}>
			{post.length > 0 && <img src={post} alt='' />}
			{post.length === 0 && <img src={'https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png'} alt='' />}
			<Link to={`/collections/${props.title}/`}>{props.title}</Link>
		</div>
	);
};

export default CollectionCard;