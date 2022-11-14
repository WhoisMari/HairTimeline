import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import Masonry from '../Posts/Masonry';
import classes from './CollectionsList.module.scss';
import config from '../../utils/config.json';

const Collection = () => {
	const { collection_title } = useParams()
	const [posts, setPosts] = useState([]);

	const fetchPostsHandler = useCallback(async () => {
		try {
			const response = await fetch(`${config.SERVER_URL}/collections/${collection_title}/`, {
				method: 'GET',
				headers: {
					Authorization: `Token ${localStorage.getItem('token')}`
				}
			});
			if (!response.ok) {
				throw new Error('something went wrong');
			}
			const data = await response.json();
			setPosts(data.post);
		} catch(error) {
			console.log(error);
		}
	}, [collection_title]);

	const handleDelete = (event) => {
		event.preventDefault();
		if (window.confirm('This action cannot be undone. Are you sure you want to delete this post?')) {
			fetch(`${config.SERVER_URL}/collection/delete/${collection_title}/`, {
				method: 'POST',
				headers: {
					Authorization: `Token ${localStorage.getItem('token')}`
				},
			})
			.then(() => {
				window.location.replace('/collections/');
			});
		}
	};

	useEffect(() => {
		fetchPostsHandler();
	}, [fetchPostsHandler]);

	return (
		<Container className={classes['wrapper']}>
			<div className={classes['wrap-collection']}>
				<div className={classes['delete-collection']}>
					<button onClick={handleDelete}>Delete Collection</button>
				</div>
				{posts.length === 0 ? (
					<div className={classes['collections-msg']}>
						<i className="fas fa-layer-group"></i>
						<span>No posts in this collection</span>
					</div>
				) : (
					<Masonry posts={posts} />
				)}
			</div>
			
		</Container>
	);
};

export default Collection;