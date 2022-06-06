import React, { Fragment, useEffect, useState } from 'react';

import ProfileForm from './ProfileForm';
import Timeline from '../Posts/Timeline';
import Container from 'react-bootstrap/Container'
import Spinner from '../UI/Spinner';

import config from '../../config.json';
import classes from './UserProfile.module.scss';

const UserProfile = (props) => {
	const user = props.user;
	const current_user = props.current_user;
	const isAuth = props.isAuth;
	const [show, setShow] = useState(false);
	const [isFollowing, setIsFollowing] = useState(false);
	const [followers, setFollowers] = useState(props.followers);
	const [isLoading, setIsLoading] = useState(false);
	const following = props.following;

	const handleShow = () => {
		setShow(!show);
	};

	const handleUnfollow = () => {
		setIsLoading(true);
		fetch(`${config.SERVER_URL}/unfollow/${user.id}/`, {
			method: 'POST',
			headers: {
				Authorization: `Token ${localStorage.getItem('token')}`
			},
		})
		.then(res => res.json())
		.then((data) => {
			setFollowers(data.followers);
			setIsFollowing(false);
			setIsLoading(false);
		});
	};

	const handleFollow = () => {
		setIsLoading(true);
		fetch(`${config.SERVER_URL}/follow/${user.id}/`, {
			method: 'POST',
			headers: {
				Authorization: `Token ${localStorage.getItem('token')}`
			},
		})
		.then(res => res.json())
		.then((data) => {
			setFollowers(data.followers);
			setIsFollowing(true);
			setIsLoading(false);
		});
	};

	useEffect(() => {
		props.follows.forEach((follow) => {
			if (current_user.username === follow.follower.username) {
				setIsFollowing(true);
			} else {
				setIsFollowing(false);
			};
		});
		document.getElementById('cover-img').style.setProperty(`--cover-color`, user.cover_color);
	}, [current_user, props.follows, user.cover_color]);

	return (
		<Fragment>
			<Container>
				<div className={classes["wrap-profile"]}>
					<div className={classes['profile-card']}>
						<div className={classes['img-user-profile']}>
							{/* banner */}
							<div className={classes["profile-bg"]} id='cover-img'></div>
							<img className={classes["avatar"]} 
								src={user.profile_image ?
									(
										user.profile_image.substring(0, user.profile_image.indexOf('?'))
									) : (
										'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
									)
								}
								alt=''
							/>
						</div>
						{isAuth && 
							<Fragment>
								{current_user.username !== user.username && isFollowing &&
									<button
										onClick={handleUnfollow}
										className={`${classes['follow-button']} ${classes['unfollow']}`}
									>
										<span>Unfollow </span>
										{isLoading && <Spinner isWhite={true} />}
									</button>
								}

								{current_user.username !== user.username && !isFollowing &&
									<button
										onClick={handleFollow}
										className={`${classes['follow-button']} ${classes['follow']}`}
									>
										<span>Follow</span>
										{isLoading && <Spinner isWhite={true} />}
									</button>
								}
							</Fragment>
						}

						<div className={classes["user-profile-data"]}>
							<span className={classes['username']}>@{user.username}</span>
							<div className={classes["description-profile"]}>{user.about}</div>
						</div>

						<ul className={classes["data-user"]}>
							<li><strong>{followers}</strong><span>Followers</span></li>
							<li><strong>{following}</strong><span>Following</span></li>
						</ul>
						
						{current_user.username === user.username &&
							<div className={classes['edit-profile']} onClick={handleShow}>
								Edit Profile
							</div>
						}
					</div>
				</div>
			</Container>

			<Timeline userId={user.id} current_user={current_user} />

			{show && <ProfileForm user={user} handleShow={handleShow} onEditProfile={props.onEditProfile} />}
		</Fragment>
	);
};

export default UserProfile;
