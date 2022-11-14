import React, { Fragment, useEffect, useState } from 'react';
import ProfileForm from './ProfileForm';
import Timeline from '../Posts/Timeline';
import Spinner from '../UI/Spinner';
import noprofile from '../UI/noprofile.png';
import FollowsModal from './FollowsModal';

import config from '../../utils/config.json';
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
		document.getElementById('cover-color').style.setProperty(`--cover-color`, user.cover_color ? user.cover_color.split('-')[0] : '#6363ad');
		document.getElementById('cover-color').style.setProperty(`--font-color`, user.cover_color ? user.cover_color.split('-')[1] : '240, 31%');
	}, [current_user, followers, user.cover_color]);

	return (
		<Fragment>
			<div className={classes['profile-container']} id='cover-color'>
				<div className={`row ${classes['wrap-profile']}`}>
					<div className={`col-lg-6 col-12 ${classes['avatar']}`}>
						<img
							style={{ background: user.profile_image ? '#fff' : '#f1f1f1'}}
							src={user.profile_image ? (user.profile_image.substring(0, user.profile_image.indexOf('?'))) : (noprofile)}
							alt={user.username}
						/>
					</div>
					<div className='col-lg-6 col-12'>
						<div className={classes['user-data']}>
							<div className={classes['wrap-basic-info']}>
								<div className={classes['wrap-action']}>
									<div className={classes['username']}>@{user.username}</div>
									{isAuth && 
										<>
											{current_user.username !== user.username ? (
												<div
													className={`${classes['follow-btn']} ${isFollowing ? classes['unfollow'] : classes['follow']}`}
													onClick={() => handleFollow(isFollowing ? 'unfollow' : 'follow')}
													title={isFollowing ? 'Unfollow' : 'Follow'}
												>
													<span><i className={`fa-solid ${isFollowing ? 'fa-user-minus' : 'fa-user-plus'}`}></i></span>
													{isLoading && <Spinner isWhite={true} />}
												</div>
											) : null}
										</>
									}
									{current_user.username === user.username &&
										<div className={classes['edit-btn']} onClick={handleShow}>
											<i className="fa-regular fa-pen-to-square"></i> Edit Profile
										</div>
									}
								</div>
								{user.first_name || user.last_name ? (
									<div className={classes['full-name']}>
										<span>{user.first_name ? user.first_name : null} {user.last_name ? user.last_name : null}</span>
									</div>
								) : null}
								<div className={classes['description-profile']}>{user.about}</div>
							</div>
							<div className={classes['follows-info']}>
								<div onClick={() => handleShowFollows('followers')}>
									<span>{followers.length} Followers</span>
								</div>
								<div onClick={() => handleShowFollows('following')}>
									<span>{following.length} Following</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
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
