import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import config from '../../utils/config.json';
import classes from './MainNav.module.scss'

const MainNavigation = (props) => {
	const handleLogOut = (event) => {
		event.preventDefault();
		fetch(`${config.SERVER_URL}/v1/users/auth/logout/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Token ${localStorage.getItem('token')}`
			}
		})
		.then(() => {
			localStorage.clear();
			window.location.replace(`${config.WEB_URL}`);
		});
	};

	return (
		<div className={classes['wrap-nav']}>
			{props.isAuth ? (
				<Fragment>
					<Link to='/create-new-post/' className={classes['nav-item']}>New Post</Link>
					<Link to='/explore/' className={classes['nav-item']}>Explore</Link>

					<div>
						<button className={`${classes['nav-item']} dropdown-toggle`} type="button" id="dropdown" data-bs-toggle="dropdown" aria-expanded="false">
							{props.current_user.username}
						</button>

						<ul className="dropdown-menu" aria-labelledby="dropdown">
							<Link className={`${classes['nav-link']} dropdown-item`} to={`/${props.current_user.username}/`}>Profile</Link>
							<Link className={`${classes['nav-link']} dropdown-item`} to={`/new-collection/`}>Create Collection</Link>
							<Link className={`${classes['nav-link']} dropdown-item`} to={`/collections/`}>Collections</Link>
							<Link className={`${classes['nav-link']} dropdown-item`} to={`/account/`}>Account</Link>
							<span className={`${classes['nav-link']} dropdown-item`} onClick={handleLogOut}>Log out</span>
						</ul>
					</div>
				</Fragment>
			) : (
				<Link className={classes['nav-item']} to={`/login/`}>Join</Link>
			)}
		</div>
	);
};

export default MainNavigation;