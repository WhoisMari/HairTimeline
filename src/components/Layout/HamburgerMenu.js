import React, { Fragment, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../../config.json';
import SearchBar from '../Search/SearchBar';
import classes from './HamburgerMenu.module.scss';

const HamburgerMenu = (props) => {
	const [show, setShow] = useState(false)
	const toggleRef = useRef()
	const containerRef = useRef()

	const handleLogOut = (event) => {
		event.preventDefault();
		closeOverlay()
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

	const closeOverlay = () => {
		toggleRef.current.checked = false;
		setShow(false);
	}

	return (
			<label className={classes['menu-button-wrapper']} htmlFor=''>
				<input ref={toggleRef} onClick={() => setShow(!show)} className={classes['checkbox']} type='checkbox' name='' id='' />
				<div className={classes['icon-wrapper']}>
					<div className={classes['hamburger-lines']}>
						<span className={`${classes.line} ${classes.line1}`}></span>
						<span className={`${classes.line} ${classes.line2}`}></span>
						<span className={`${classes.line} ${classes.line3}`}></span>
					</div>
				</div>
				{show &&
					<div
						ref={containerRef}
						className={classes['hamburger-menu-container']}
						onClick={(e) => e.target === containerRef.current ? closeOverlay() : false}
						onWheel = {(e) => e.target === containerRef.current ? closeOverlay() : false}
					>
						<div className={classes['wrap-list']}>
							<div className={classes['item-list']}>
								{props.isAuth ? (
									<Fragment>
										<div className={classes['item-search']}><SearchBar /></div>
										<Link to='/create-new-post/' onClick={closeOverlay}>New Post</Link>
										<Link to='/explore/' onClick={closeOverlay}>Explore</Link>
										<Link to={`/${props.current_user.username}/`} onClick={closeOverlay}>Profile</Link>
										<Link to={`/new-collection/`} onClick={closeOverlay}>Create Collection</Link>
										<Link to={`/collections/`} onClick={closeOverlay}>Collections</Link>
										<Link to={`/account/`} onClick={closeOverlay}>Account</Link>
										<span className={classes['item']} onClick={handleLogOut}>Log out</span>
									</Fragment>
								) : (
									<Link className={classes['join-button']} to={`/login/`} onClick={closeOverlay}>Join</Link>
								)}
							</div>
						</div>
					</div>
				}
			</label>
	);
};

export default HamburgerMenu;