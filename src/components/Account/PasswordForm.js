import React, { useState } from "react";
import Loading from '../UI/Loading';

import classes from '../styles/Forms.module.scss';

const PasswordForm = (props) => {
	const [errorMessage, setErrorMessage] = useState(false);
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
	
	const submitFormHandler = (event) => {
		event.preventDefault();
		setErrorMessage(false);
		if (newPassword.length < 8) {
			setErrorMessage('This password is too short. It must contain at least 8 characters.');
			return;
		}
		if (newPassword !== newPasswordConfirm) {
			setErrorMessage('Passwords do not match.');
			return;
		}
		let password_change_data;
		password_change_data = {
			new_password1: newPassword,
			new_password2: newPasswordConfirm,
			old_password: oldPassword,
		};
		props.onNewPassword(password_change_data);
	};

	return (
		<div className={classes['wrap-form']}>
			<h3 className={classes['page-title']}>Change Password</h3>
			<div className={classes['message']}>
				{props.successMessage && 
					<span className={classes['success']}>{props.successMessage}</span>
				}
				{errorMessage && <span className={classes['error']}>{errorMessage}</span>}
			</div>
			{props.isLoading && <Loading />}
			{!props.isLoading && 
				<form onSubmit={submitFormHandler}>
					<label htmlFor="old-password">Old Password</label>
					<input 
						className="form-control" 
						id='old-password' 
						type='password'
						onChange={e => setOldPassword(e.target.value)} 
					/>
					<label htmlFor="new-password">New Password</label>
					<input 
						className="form-control" 
						id='new-password'
						type='password'
						onChange={e => setNewPassword(e.target.value)} 
					/>
					<label htmlFor="new-password-confirm">Confirm New Password</label>
					<input 
						className="form-control" 
						id='new-password-confirm'
						type='password' 
						onChange={e => setNewPasswordConfirm(e.target.value)} 
					/>
					<small className={classes['info-message']}><em>(Your password should not be too similar to your email address)</em></small>
					<br />
					<button className={classes['primary-btn']}>Submit</button>
				</form>
			}	
		</div>
		
	);
};

export default PasswordForm;