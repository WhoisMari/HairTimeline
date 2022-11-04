import React, { Fragment, useEffect, useState } from 'react';
import ProfileForm from './ProfileForm';
import Timeline from '../Posts/Timeline';
import Container from 'react-bootstrap/Container';
import Spinner from '../UI/Spinner';
import noprofile from '../UI/noprofile.png';
import FollowsModal from './FollowsModal';

import config from '../../config.json';
import classes from './UserProfile.module.scss';

const UserProfile = (props) => {
	const user = props.userData.user;
	const current_user = props.current_user;
	const isAuth = props.isAuth;
	const [show, setShow] = useState(false);
	const [showFollows, setShowFollows] = useState({show: false, action: ''});
	const [isLoading, setIsLoading] = useState(false);
	const [isFollowing, setIsFollowing] = useState(false);
	const [followers, setFollowers] = useState(props.userData.followers);
	const following = props.userData.following;

	const handleShowFollows = (action) => { setShowFollows({show: true, action: action}) };

	const handleHideFollows = () => { setShowFollows({show: false, action: ''}) };

	const handleShow = () => { setShow(!show) };

	const handleFollow = (action) => {
		setIsLoading(true);
		fetch(`${config.SERVER_URL}/${action}/${user.id}/`, {
			method: 'POST',
			headers: { Authorization: `Token ${localStorage.getItem('token')}` },
		})
		.then(res => res.json())
		.then((data) => {
			let followers = []
			data.followers.forEach(follower => { followers.push(follower.follower) });
			setFollowers(followers);
			setIsFollowing(action === 'follow' ? true : false)
			setIsLoading(false);
		})
	}

	useEffect(() => {
		const following_user = followers.find(follower => follower.id === current_user.pk)
		setIsFollowing(following_user ? true : false)
		document.getElementById('cover-img').style.setProperty(`--cover-color`, user.cover_color);
	}, [current_user, followers, user.cover_color]);

	return (
		<Fragment>
			<Container>
				<div className={classes["wrap-profile"]}>
					<div className={classes['profile-card']}>
						<div className={classes['img-user-profile']}>
							{/* banner */}
							<div className={classes["profile-bg"]} id='cover-img'></div>
							<img className={classes["avatar"]} 
								src={user.profile_image ? (user.profile_image.substring(0, user.profile_image.indexOf('?'))) : (noprofile)}
								alt=''
							/>
						</div>
						{isAuth && 
							<Fragment>
								{current_user.username !== user.username ? (
									<button
										onClick={() => handleFollow(isFollowing ? 'unfollow' : 'follow')}
										className={`${classes['follow-button']} ${isFollowing ? classes['unfollow'] : classes['follow']}`}
									>
										<span>{isFollowing ? 'Unfollow' : 'Follow'} </span>
										{isLoading && <Spinner isWhite={true} />}
									</button>
								) : null}
							</Fragment>
						}
						<div className={classes["user-profile-data"]}>
							<span className={classes['username']}>@{user.username}</span>
							<div className={classes["description-profile"]}>{user.about}</div>
						</div>

						<ul className={classes["data-user"]}>
							<li onClick={() => handleShowFollows('followers')}>
								<strong>{followers.length}</strong><span>Followers</span>
							</li>
							<li onClick={() => handleShowFollows('following')}>
								<strong>{following.length}</strong><span>Following</span>
							</li>
						</ul>
						
						{current_user.username === user.username &&
							<div className={classes['edit-profile']} onClick={handleShow}>
								Edit Profile
							</div>
						}
					</div>
				</div>
			</Container>
			<FollowsModal
				handleShow={showFollows}
				close={handleHideFollows}
				following={following}
				followers={followers}
			/>
			<Timeline
				userId={user.id}
				current_user={current_user}
			/>
			{show && 
				<ProfileForm
					user={user}
					handleShow={handleShow}
					onEditProfile={props.onEditProfile}
				/>
			}
		</Fragment>
	)
};

export default UserProfile;
