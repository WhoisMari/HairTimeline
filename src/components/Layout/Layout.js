import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainNavigation from './MainNavigation';
import HamburgerMenu from './HamburgerMenu';
import logo from './logo.png';
import classes from './Layout.module.scss'
import Container from 'react-bootstrap/esm/Container';
import SearchBar from '../Search/SearchBar';

const Layout = (props) => {
	const [isAuth, setIsAuth] = useState(false);
	const [show, setShow] = useState(false);

	const handleShow = () => {
		setShow(!show);
	};

	useEffect(() => {
		if (localStorage.getItem('token') !== null) {
			setIsAuth(true);
		}
	}, []);

	return (
		<header>
			<Container>
				<div className='row'>
					<div className='col-12'>
						<div className={classes['wrap-header']}>
							<div className={classes['logo']}>

								<Link to='/'>
									<img src={logo} alt='Hair Timeline - Logo' />
								</Link>
							</div>

							<div className={classes['user-search-bar']}>
								<SearchBar placeholder={'Are you looking for someone?'} />
							</div>

							<div>
								<MainNavigation isAuth={isAuth} current_user={props.current_user} />
							</div>

							<div className={`${classes['mobile-menu-wrap']} d-lg-none`}>
								<div className={classes['user-mobile-search-bar']}>
								{show && <SearchBar placeholder={'Username'} />}
									<div className={classes['search-icon']} onClick={handleShow}>
										<i className="fa-solid fa-magnifying-glass"></i>
									</div>
								</div>
								<HamburgerMenu isAuth={isAuth} current_user={props.current_user} />
							</div>

						</div>
					</div>
				</div>
			</Container>
		</header>
	);
};

export default Layout;
