import React, { Fragment, useState } from 'react';
import Modal from 'react-bootstrap/Modal/';
import Loading from '../UI/Loading';
import config from '../../config.json';
import classes from './AuthForm.module.scss';

const AuthForm = (props) => {
	const [isLogin, setIsLogin] = useState(props.isLogin);
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [password2, setPassword2] = useState('');
	const [errors, setErrors] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	let errors_list = [];

	const switchAuthModeHandler = () => {
		errors_list = [];
		setErrors(null);
		setIsLogin((prevState) => !prevState);
	};

	const onSubmit = (event) => {
		event.preventDefault();
		setIsLoading(true);
		setErrors(null);
		errors_list = [];
		let user;
		let url;

		if (isLogin === false) {
			user = {
				username: username,
				email: email,
				password1: password,
				password2: password2,
			};
			url = 'register/'
		} else {
			user = {
				email: email,
				password: password
			};
			url = 'login/'
		};

		fetch(`${config.SERVER_URL}/v1/users/auth/${url}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		})
		.then((res) => res.json())
		.then(data => {
			errors_list = [];
			for (const [key, value] of Object.entries(data)) {
				if (key !== 'key') {
					errors_list.push(value);
				}
			}
			setErrors(errors_list);
			if (errors_list.length === 0) {
				localStorage.clear();
				localStorage.setItem('token', data.key);
				window.location.replace('/');
			};
			setIsLoading(false);
		});
	};

	return (
		<Modal 
			show={props.show}
			onHide={props.hide}
			backdrop="static"
			centered
		>
			<Modal.Header>
				<Modal.Title>
					<h3 className={classes['page-title']}>{isLogin ? ('Login') : ('Sign Up')}</h3>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className={classes['wrap-auth']}>
				{props.isLoading && <Loading />}
				{errors &&
					<div className={classes['error-messages']}>
						{errors.map((error) => (
							<span key={error}>{error}</span>
						))}
					</div>
				}
				<form onSubmit={onSubmit}>
					<label htmlFor='email'>Email address</label>
					<input 
						className="form-control"
						type='email'
						name='email'
						value={email}
						required 
						onChange={e => setEmail(e.target.value)}
					/>
					<label htmlFor='password'>Password</label>
					<input 
						className="form-control"
						type='password'
						name='password'
						value={password}
						required 
						onChange={e => setPassword(e.target.value)}
					/>
					{!isLogin &&
						<Fragment>
							<label htmlFor='password2'>Confirm Password</label>
							<input 
								className="form-control"
								type='password'
								name='password2'
								value={password2}
								required 
								onChange={e => setPassword2(e.target.value)}
							/>
							<small><em>(Your password should have at least 8 characters and shouldn't be too common or entirely numeric)</em></small>
							<label htmlFor='username'>Username</label>
							<input 
								className="form-control"
								type='username'
								name='username'
								value={username}
								required 
								onChange={e => setUsername(e.target.value)}
							/>
							
						</Fragment>
					}
					<input className={classes['primary-btn']} type='submit' value={(!isLogin ? 'Sign Up' : 'Login')} />
				</form>
				<div className={classes['action']}>
					{isLogin ? (
						<span className={classes['auth-message']}>Don't have an account? <strong onClick={switchAuthModeHandler}>Sign up</strong></span>
					) : (
						<span className={classes['auth-message']}>Already have an account? <strong onClick={switchAuthModeHandler}>Login</strong></span>
					)}
				</div>
				{isLoading && <Loading />}
			</Modal.Body>
		</Modal>
	);
};

export default AuthForm;