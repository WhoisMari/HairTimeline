import React, { useState, useCallback, useEffect } from 'react';
import AuthModal from '../components/Auth/AuthModal.js';
import Container from 'react-bootstrap/Container'
import config from '../config.json';
import Moment from 'moment';
import 'animate.css';
import classes from '../components/styles/DemoPage.module.scss';

const AuthPage = (props) => {
	const [errors, setErrors] = useState(false);
	const [timelinePosts, setTimelinePosts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	Moment.locale('en')

	const fetchTimelinePosts = useCallback(async () => {
		setIsLoading(true)
		try {
			const response = await fetch(`${config.SERVER_URL}/get-posts/timeline/`, {
				method: 'GET',
			});
			if (!response.ok) {
				throw new Error('Something went wrong!');
			}
			const data = await response.json();
			setTimelinePosts(data);
			setIsLoading(false);
		} catch (error) {
			setErrors(error)
		}
	}, []);

	useEffect(() => {
		fetchTimelinePosts();
		document.documentElement.style.setProperty('--animate-duration', '20s');
	}, [fetchTimelinePosts]);

	return (
		<Container className={classes['wrapper']}>
			{!isLoading &&
				<div className={`${classes['timeline']} animate__animated animate__slideInDown`}>
					{timelinePosts.map((post) => (
						<div key={post.id} className={classes['timeline-row']}>
							<div className={classes['timeline-time']}>
								{Moment(post.date).format('MMM D')}
								<small>{Moment(post.date).format('Y')}</small>
							</div>
							<figure className={classes['timeline-content']}>
								<div className={classes['post-image']}>
									<img
										src={post.image.substring(0, post.image.indexOf('?'))}
										alt=''
									/>
								</div>
							</figure>
						</div>
					))}
					{errors && <span>{errors}</span>}
				</div>
			}
			<AuthModal
				show={true}
				isLogin={props.isLogin}
				isLoading={isLoading}
			/>
		</Container>
	);
};

export default AuthPage;