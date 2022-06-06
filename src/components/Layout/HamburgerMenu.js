import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import config from '../../config.json';

import classes from './HamburgerMenu.module.scss'

const HamburgerMenu = (props) => {
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
		<Fragment>
			{props.isAuth ? (
				<label className={classes["menu-button-wrapper"]} htmlFor="">
					<input type="checkbox" className={classes["menu-button"]} />
					<div className={classes["icon-wrapper"]}>
						<label className={classes["hamburger"]}>
							<input className={classes["hamburger-input"]} type="checkbox" />
							<span className={`${classes['hamburger-line']} ${classes['first']}`}></span>
							<span className={`${classes['hamburger-line']} ${classes['second']}`}></span>
							<span className={`${classes['hamburger-line']} ${classes['third']}`}></span>
						</label>
					</div>
					<div className={classes["item-list"]}>
						<Fragment>
							<Link to='/create-new-post/' className={classes['nav-item']}>New Post</Link>
							<Link to='/explore/' className={classes['nav-item']}>Explore</Link>
							<Link to={`/${props.current_user.username}/`}>Profile</Link>
							<Link to={`/new-collection/`}>Create Collection</Link>
							<Link to={`/collections/`}>Collections</Link>
							<Link to={`/account/`}>Account</Link>
							<span onClick={handleLogOut}>Log out</span>
						</Fragment>
					</div>
				</label>
			) : (
				<Link className={classes['join-button']} to={`/login/`}>Join</Link>
			)}
		</Fragment>
	);
};

export default HamburgerMenu;