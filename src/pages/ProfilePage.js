import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import UserProfile from '../components/Profile/UserProfile';
import Loading from '../components/UI/Loading';
import config from '../config.json';
import classes from '../components/Profile/UserProfile.module.scss';

const ProfilePage = (props) => {
	const { username } = useParams()
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState(null);
	const [follows, setFollows] = useState([]);
	const [followers, setFollowers] = useState([]);
	const [following, setFollowing] = useState([]);
	const [error, setError] = useState(null);
	const isAuth = props.isAuth;

	const fetchUserHandler = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(`${config.SERVER_URL}/user/${username}/`, {
				method: 'GET',
			});
			if (!response.ok) {
				throw new Error('Something went wrong!');
			}

			const data = await response.json();
			setUser(data.user);
			setFollows(data.follows);
			setFollowers(data.followers);
			setFollowing(data.following)
		} catch (error) {
			setError(true);
		}
		setIsLoading(false);
	}, [username]);

	useEffect(() => {
			fetchUserHandler();
	}, [fetchUserHandler]);

	return (
		<div className={classes['wrapper']}>
			{isLoading && <Loading />}
			{!isLoading && !error &&
				<UserProfile 
					user={user}
					current_user={props.current_user} 
					follows={follows}
					following={following}
					followers={followers}
					onEditProfile={fetchUserHandler}
					isAuth={isAuth}
				/>
			}
			{!isLoading && error &&
				<div className={classes['sad-container']}>
					<div className={classes['error']}>404</div>
					<div>Page not found <i className="far fa-frown"></i></div>
				</div>
			}
		</div>
	);
};

export default ProfilePage;