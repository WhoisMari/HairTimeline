import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import PasswordForm from '../components/Account/PasswordForm';
import classes from '../components/styles/Forms.module.scss';
import config from '../utils/config.json';

const AccountPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');

	const newPasswordHandler = (passwords) => {		
		setIsLoading(true);
		setSuccessMessage('');
		fetch(`${config.SERVER_URL}/auth/password/change/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Token ${localStorage.getItem('token')}`
			},
			body: JSON.stringify(passwords),
		})
		.then(res => res.json())
		.then(() => {
			setSuccessMessage('Password changed successfully!');
			setIsLoading(false);
		});
	}

	return (
		<Container className={classes['wrapper']}>
			<PasswordForm onNewPassword={newPasswordHandler} isLoading={isLoading} successMessage={successMessage} />	
		</Container>
	)
}

export default AccountPage;