import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import config from '../utils/config.json';
import Loading from "../components/UI/Loading";
import PostDetail from "../components/Posts/PostDetail";
import Container from "react-bootstrap/esm/Container";
import classes from '../components/Posts/PostDetail.module.scss';

const PostPage = (props) => {
	const { postId } = useParams()
	const isAuth = props.isAuth;
	const [isLoading, setIsLoading] = useState(true);
	const [post, setPost] = useState([]);
	const [user, setUser] = useState([]);
	const [error, setError] = useState(null);

	const fetchPostHandler = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(`${config.SERVER_URL}/post/${postId}/`, {
				method: 'GET',
			});
			if (!response.ok) {
				throw new Error('something went wrong');
			}

			const data = await response.json();
			setUser(data.user)
			setPost(data.post);
		} catch(error) {
			setError(true);
		}
		setIsLoading(false);
	}, [postId]);

	useEffect(() => {
		fetchPostHandler();
	}, [fetchPostHandler]);

	return (
		<Container>
			{isLoading && <Loading />}
			{!isLoading && !error &&
				<PostDetail 
					post={post} 
					user={user} 
					reload={fetchPostHandler} 
					current_user={props.current_user}
					isAuth={isAuth}
				/>
			}
			{!isLoading && error &&
				<div className={classes['sad-container']}>
					<div className={classes['error']}>404</div>
					<div>Page not found <i className="far fa-frown"></i></div>
				</div>
			}
		</Container>
		
	);
};

export default PostPage;