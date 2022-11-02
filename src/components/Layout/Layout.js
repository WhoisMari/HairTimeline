import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainNavigation from './MainNavigation';
import HamburgerMenu from './HamburgerMenu';
import logo from './logo.png';
import Container from 'react-bootstrap/esm/Container';
import SearchBar from '../Search/SearchBar';
import classes from './Layout.module.scss'

const Layout = (props) => {
	const [isAuth, setIsAuth] = useState(false);

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
								<SearchBar />
							</div>
							<div>
								<MainNavigation isAuth={isAuth} current_user={props.current_user} />
							</div>

							<div className='d-lg-none'>
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
